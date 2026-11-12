import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createPhoneUploadLink, fetchPhoneUploadLink } from "./analysis.api";
import type { CopyStatus, PhoneUploadLinkState } from "./types";

const LINK_POLL_MS = 2_500;
const COPIED_MS = 2_000;

export function useCreatePhoneUploadLink() {
    return useMutation({ mutationFn: createPhoneUploadLink });
}

/** Asks the server while the QR code is shown; stops once the phone used the link or it expired. */
export function usePhoneUploadLinkState(linkId: string) {
    return useQuery({
        queryKey: ["phone-upload-link", linkId],
        queryFn: () => fetchPhoneUploadLink(linkId),
        staleTime: 0,
        refetchInterval: (query) =>
            query.state.data && query.state.data.status !== "open"
                ? false
                : LINK_POLL_MS,
    });
}

/** Once the phone sends its invoices, the computer follows it into the session they started. */
export function useFollowPhoneUpload(state: PhoneUploadLinkState | undefined) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const runId = state?.status === "used" ? state.runId : null;

    useEffect(() => {
        if (!runId) return;
        void queryClient.invalidateQueries({ queryKey: ["runs"] });
        void navigate(`/analyses/${runId}`, { viewTransition: true });
    }, [runId, navigate, queryClient]);
}

/** The current time, ticking every second: drives a visible countdown. */
export function useNow(): number {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 1_000);
        return () => window.clearInterval(timer);
    }, []);
    return now;
}

/** Copies text and reports the outcome for a couple of seconds, so the icon can confirm it. */
export function useCopyToClipboard() {
    const [status, setStatus] = useState<CopyStatus>("idle");
    const resetTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
        } catch {
            setStatus("failed");
        }
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(
            () => setStatus("idle"),
            COPIED_MS,
        );
    };

    return { status, copy };
}
