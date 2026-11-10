import { useParams } from "react-router";
import { ErrorState, PageHeader, Skeleton } from "@/shared/ui";
import { isRunActive } from "./analysis.model";
import { RunPending } from "./RunPending";
import { RunSessionView } from "./RunSessionView";
import { useRun } from "./useAnalysis";

export function RunPage() {
    const { runId = "" } = useParams();
    const query = useRun(runId);
    const back = {
        to: "/analyze",
        label: "Analyze emails",
    };

    if (query.isPending) {
        return (
            <>
                <PageHeader title="Analysis" back={back} />
                <Skeleton lines={6} height="2rem" />
            </>
        );
    }
    if (query.isError) {
        return (
            <>
                <PageHeader title="Analysis" back={back} />
                <ErrorState
                    error={query.error}
                    onRetry={() => void query.refetch()}
                />
            </>
        );
    }

    const run = query.data;
    if (isRunActive(run.status)) {
        return (
            <>
                <PageHeader title="Analyzing your inbox" back={back} />
                <RunPending run={run} />
            </>
        );
    }
    return (
        <>
            <PageHeader title="Extraction session" back={back} />
            <RunSessionView run={run} />
        </>
    );
}
