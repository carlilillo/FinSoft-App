import { useDisconnectGmail, useGmailConnection } from "@/features/analysis";
import { formatDate } from "@/shared/lib/dates";
import { Button, ButtonLink, Skeleton } from "@/shared/ui";
import styles from "./SettingsPage.module.css";

export function GmailSection() {
    const connection = useGmailConnection();
    const disconnect = useDisconnectGmail();

    return (
        <section aria-labelledby="gmail-title" className={styles.section}>
            <h2 id="gmail-title" className={styles.sectionTitle}>
                Gmail
            </h2>
            {connection.isPending && <Skeleton lines={1} />}
            {connection.data?.connected && (
                <div className={styles.inline}>
                    <p>
                        Connected as{" "}
                        <strong>
                            {connection.data.googleEmail ??
                                "your Google account"}
                        </strong>
                        {connection.data.connectedAt
                            ? ` since ${formatDate(connection.data.connectedAt)}`
                            : ""}
                        .
                    </p>
                    <Button
                        variant="secondary"
                        isBusy={disconnect.isPending}
                        onClick={() => disconnect.mutate()}
                    >
                        Disconnect Gmail
                    </Button>
                </div>
            )}
            {connection.data && !connection.data.connected && (
                <div className={styles.inline}>
                    <p>
                        Gmail isn&apos;t connected. You&apos;ll be asked to
                        connect it when you run an analysis.
                    </p>
                    <ButtonLink to="/analyze" variant="secondary">
                        Go to Analyze
                    </ButtonLink>
                </div>
            )}
        </section>
    );
}
