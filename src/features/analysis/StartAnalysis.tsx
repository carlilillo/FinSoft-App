import { useSearchParams } from "react-router";
import { Button, ErrorState, Skeleton } from "@/shared/ui";
import {
    connectedAccountsText,
    connectionErrorMessage,
    gmailStartBlockedReason,
} from "./analysis.model";
import { ScheduledAnalysis } from "./ScheduledAnalysis";
import {
    useGmailAccounts,
    useRunCapacity,
    useStartAnalysis,
} from "./useAnalysis";
import type { StartButtonProps } from "./types";
import styles from "./AnalyzePage.module.css";

const STEPS = [
    {
        title: "Connect Gmail",
        text: "FinSift asks Google for read-only access to your inbox.",
    },
    {
        title: "We review last week",
        text: "Emails are read in the background; you can close the page.",
    },
    {
        title: "Check the result",
        text: "Confirm which emails were real invoices and re-run if something was missed.",
    },
];

export function StartAnalysis() {
    const [searchParams] = useSearchParams();
    const accounts = useGmailAccounts();
    const start = useStartAnalysis();
    const capacity = useRunCapacity();
    const errorMessage = connectionErrorMessage(searchParams.get("error"));

    return (
        <section className={styles.start} aria-labelledby="start-title">
            <h2 id="start-title" className="visually-hidden">
                Start an analysis
            </h2>
            <ol className={styles.steps}>
                {STEPS.map((step) => (
                    <li key={step.title}>
                        <strong>{step.title}</strong>
                        <span>{step.text}</span>
                    </li>
                ))}
            </ol>
            {accounts.isPending ? (
                <Skeleton lines={1} height="2.75rem" />
            ) : (
                <StartButton
                    accounts={accounts.data ?? []}
                    isBusy={start.isPending}
                    blockedReason={gmailStartBlockedReason(capacity)}
                    onStart={(isConnected) => start.mutate(isConnected)}
                />
            )}
            {errorMessage && (
                <p className={styles.error} role="alert">
                    {errorMessage}
                </p>
            )}
            {start.isError && <ErrorState error={start.error} />}
            <ScheduledAnalysis />
        </section>
    );
}

function StartButton({
    accounts,
    isBusy,
    blockedReason,
    onStart,
}: StartButtonProps) {
    const isConnected = accounts.length > 0;
    return (
        <div className={styles.action}>
            <Button
                isBusy={isBusy}
                disabled={blockedReason !== null}
                aria-describedby="start-note"
                onClick={() => onStart(isConnected)}
            >
                {isConnected
                    ? "Analyze last week's emails"
                    : "Connect Gmail and analyze"}
            </Button>
            <p id="start-note" className={styles.connection}>
                {blockedReason ?? connectedAccountsText(accounts)}
            </p>
        </div>
    );
}
