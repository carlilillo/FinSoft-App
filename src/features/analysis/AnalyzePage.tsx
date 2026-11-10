import { ErrorState, PageHeader, Skeleton } from "@/shared/ui";
import { RunHistory } from "./RunHistory";
import { StartAnalysis } from "./StartAnalysis";
import { useRuns } from "./useAnalysis";
import styles from "./AnalyzePage.module.css";

export function AnalyzePage() {
    const runs = useRuns();
    return (
        <>
            <PageHeader
                title="Analyze emails"
                description="Find the invoices in last week's inbox and extract every product and price."
            />
            <StartAnalysis />
            <section aria-labelledby="history-title">
                <h2 id="history-title" className={styles.sectionTitle}>
                    Previous analyses
                </h2>
                {runs.isPending && <Skeleton lines={3} />}
                {runs.isError && (
                    <ErrorState
                        error={runs.error}
                        onRetry={() => void runs.refetch()}
                    />
                )}
                {runs.data && <RunHistory runs={runs.data} />}
            </section>
        </>
    );
}
