import { useSearchParams } from "react-router";
import { Button, ErrorState, Skeleton } from "@/shared/ui";
import { connectionErrorMessage } from "./analysis.model";
import { useGmailConnection, useStartAnalysis } from "./useAnalysis";
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
    const connection = useGmailConnection();
    const start = useStartAnalysis();
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
            {connection.isPending ? (
                <Skeleton lines={1} height="2.75rem" />
            ) : (
                <StartButton
                    isConnected={connection.data?.connected ?? false}
                    googleEmail={connection.data?.googleEmail ?? null}
                    isBusy={start.isPending}
                    onStart={(isConnected) => start.mutate(isConnected)}
                />
            )}
            {errorMessage && (
                <p className={styles.error} role="alert">
                    {errorMessage}
                </p>
            )}
            {start.isError && <ErrorState error={start.error} />}
        </section>
    );
}

function StartButton({
    isConnected,
    googleEmail,
    isBusy,
    onStart,
}: StartButtonProps) {
    return (
        <div className={styles.action}>
            <Button isBusy={isBusy} onClick={() => onStart(isConnected)}>
                {isConnected
                    ? "Analyze last week's emails"
                    : "Connect Gmail and analyze"}
            </Button>
            <p className={styles.connection}>
                {isConnected
                    ? `Connected as ${googleEmail ?? "your Google account"}`
                    : "Gmail is not connected yet"}
            </p>
        </div>
    );
}
