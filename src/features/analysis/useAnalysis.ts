import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
    continueAnalysis,
    disconnectGmail,
    fetchGmailConnection,
    fetchRun,
    fetchRuns,
    importInvoices,
    requestGmailConsentUrl,
    startAnalysis,
} from "./analysis.api";
import { isRunActive, runCapacity } from "./analysis.model";
import type { ContinueRequest, RunCapacity, RunStatus } from "./types";

const POLL_MS = 3_000;

export function useGmailConnection() {
    return useQuery({
        queryKey: ["gmail-connection"],
        queryFn: fetchGmailConnection,
    });
}

export function useDisconnectGmail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disconnectGmail,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["gmail-connection"] }),
    });
}

/** Connected: start right away. Not connected: go through Google consent; the server comes back to the run page. */
export function useStartAnalysis() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (isConnected: boolean) => {
            if (!isConnected) {
                window.location.assign(await requestGmailConsentUrl());
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
