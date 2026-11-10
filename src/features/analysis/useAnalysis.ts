import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
    continueAnalysis,
    disconnectGmailAccount,
    fetchAnalysisSchedule,
    fetchGmailAccounts,
    fetchRun,
    fetchRuns,
    importInvoices,
    requestGmailConsentUrl,
    saveAnalysisSchedule,
    startAnalysis,
} from "./analysis.api";
import { isRunActive, runCapacity } from "./analysis.model";
import type {
    AnalysisSchedule,
    ContinueRequest,
    RunCapacity,
    RunStatus,
    ScheduleUpdate,
} from "./types";

const POLL_MS = 3_000;
const SCHEDULE_KEY = ["analysis-schedule"];

const GMAIL_ACCOUNTS_KEY = ["gmail-accounts"];

export function useGmailAccounts() {
    return useQuery({
        queryKey: GMAIL_ACCOUNTS_KEY,
        queryFn: fetchGmailAccounts,
    });
}

export function useDisconnectGmailAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disconnectGmailAccount,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: GMAIL_ACCOUNTS_KEY }),
    });
}

/** Links one more Gmail account: goes through Google consent and the server comes back to Settings. */
export function useConnectGmailAccount() {
    return useMutation({
        mutationFn: async () => {
            window.location.assign(await requestGmailConsentUrl("connect"));
        },
    });
}

/** Connected: start right away. Not connected: go through Google consent; the server comes back to the run page. */
export function useStartAnalysis() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (isConnected: boolean) => {
            if (!isConnected) {
                window.location.assign(await requestGmailConsentUrl("analyze"));
                return null;
            }
            return startAnalysis();
        },
        onSuccess: async (result) => {
            if (!result) return;
            await queryClient.invalidateQueries({ queryKey: ["runs"] });
            await navigate(`/analyses/${result.runId}`, {
                viewTransition: true,
            });
        },
    });
}

/** Imported PDFs become a new extraction session; the person follows it on its run page. */
export function useImportInvoices() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: importInvoices,
        onSuccess: async (result) => {
            await queryClient.invalidateQueries({ queryKey: ["runs"] });
            await navigate(`/analyses/${result.runId}`, {
                viewTransition: true,
            });
        },
    });
}

/** Unknown until the run list loads: treated as available, the server still enforces the limit. */
export function useRunCapacity(): RunCapacity {
    const { data: runs } = useRuns();
    return runCapacity(runs ?? []);
}

export function useRun(runId: string) {
    return useQuery({
        queryKey: ["run", runId],
        queryFn: () => fetchRun(runId),
        refetchInterval: (query) =>
            query.state.data && !isRunActive(query.state.data.status)
                ? false
                : POLL_MS,
    });
}

export function useRuns() {
    return useQuery({
        queryKey: ["runs"],
        queryFn: fetchRuns,
        refetchInterval: (query) =>
            query.state.data?.some((run) => isRunActive(run.status))
                ? 5_000
                : false,
    });
}

export function useContinueAnalysis(runId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ContinueRequest) =>
            continueAnalysis(runId, request),
        onSuccess: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["run", runId] }),
                queryClient.invalidateQueries({ queryKey: ["runs"] }),
            ]),
    });
}

/** Calls `onFinished` once for every run that stops being active while the app is open. */
export function useRunWatcher(
    onFinished: (runId: string, status: RunStatus) => void,
) {
    const { data: runs } = useRuns();
    const activeIds = useRef<Set<string> | null>(null);
    const callback = useRef(onFinished);

    useEffect(() => {
        callback.current = onFinished;
    }, [onFinished]);

    useEffect(() => {
        if (!runs) return;
        const previous = activeIds.current;
        if (previous) {
            for (const run of runs) {
                if (previous.has(run.id) && !isRunActive(run.status))
                    callback.current(run.id, run.status);
            }
        }
        activeIds.current = new Set(
            runs.filter((run) => isRunActive(run.status)).map((run) => run.id),
        );
    }, [runs]);

    return {
        hasActiveRun: runs?.some((run) => isRunActive(run.status)) ?? false,
    };
}

export function useAnalysisSchedule() {
    return useQuery({
        queryKey: SCHEDULE_KEY,
        queryFn: fetchAnalysisSchedule,
    });
}

/**
 * Saves as soon as the person changes something. The switch and the selects move at once (optimistic),
 * saves run one after another so the last choice always wins, and a failed save reloads what is stored.
 */
export function useSaveAnalysisSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: SCHEDULE_KEY,
        mutationFn: saveAnalysisSchedule,
        scope: { id: "analysis-schedule" },
        onMutate: async (update: ScheduleUpdate) => {
            await queryClient.cancelQueries({ queryKey: SCHEDULE_KEY });
            queryClient.setQueryData<AnalysisSchedule>(SCHEDULE_KEY, {
                ...update,
                nextRunAt: null,
            });
        },
        // Only the last queued save writes its answer, so an earlier one can't flash an older choice.
        onSuccess: (saved) => {
            if (queryClient.isMutating({ mutationKey: SCHEDULE_KEY }) <= 1)
                queryClient.setQueryData(SCHEDULE_KEY, saved);
        },
        onError: () =>
            queryClient.invalidateQueries({ queryKey: SCHEDULE_KEY }),
    });
}
