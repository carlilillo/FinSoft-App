import { useSearchParams } from "react-router";
import {
    connectionErrorMessage,
    useConnectGmailAccount,
    useDisconnectGmailAccount,
    useGmailAccounts,
} from "@/features/analysis";
import { formatDate } from "@/shared/lib/dates";
import { Button, ErrorState, Skeleton } from "@/shared/ui";
import type { GmailAccountListProps } from "./types";
import styles from "./SettingsPage.module.css";

export function GmailSection() {
    const [searchParams] = useSearchParams();
    const accounts = useGmailAccounts();
    const connect = useConnectGmailAccount();
    const errorMessage = connectionErrorMessage(searchParams.get("error"));

    return (
        <section aria-labelledby="gmail-title" className={styles.section}>
            <h2 id="gmail-title" className={styles.sectionTitle}>
                Gmail
            </h2>
            <p className={styles.sectionHelp}>
                Every analysis reads the inbox of all the accounts connected
                here.
            </p>
            {accounts.isPending && <Skeleton lines={2} />}
            {accounts.isError && (
                <ErrorState
                    error={accounts.error}
                    onRetry={() => void accounts.refetch()}
                />
            )}
            {accounts.data && <GmailAccountList accounts={accounts.data} />}
            <div className={styles.formActions}>
                <Button
                    isBusy={connect.isPending}
                    onClick={() => connect.mutate()}
                >
                    Add Gmail account
                </Button>
            </div>
            {errorMessage && (
                <p className={styles.error} role="alert">
                    {errorMessage}
                </p>
            )}
            {connect.isError && <ErrorState error={connect.error} />}
        </section>
    );
}

function GmailAccountList({ accounts }: GmailAccountListProps) {
    const disconnect = useDisconnectGmailAccount();

    if (accounts.length === 0) {
        return (
            <p className={styles.muted}>
                No Gmail account is connected yet. Add one to analyze its inbox.
            </p>
        );
    }
    return (
        <>
            <ul className={styles.sessions}>
                {accounts.map((account) => (
                    <li key={account.id} className={styles.session}>
                        <div>
                            <p className={styles.device}>
                                {account.googleEmail}
                            </p>
                            <p className={styles.muted}>
                                Connected {formatDate(account.connectedAt)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            isBusy={
                                disconnect.isPending &&
                                disconnect.variables === account.id
                            }
                            onClick={() => disconnect.mutate(account.id)}
                            aria-label={`Disconnect ${account.googleEmail}`}
                        >
                            Disconnect
                        </Button>
                    </li>
                ))}
            </ul>
            {disconnect.isError && <ErrorState error={disconnect.error} />}
        </>
    );
}
