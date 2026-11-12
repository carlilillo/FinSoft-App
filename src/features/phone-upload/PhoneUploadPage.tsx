import { useParams } from "react-router";
import { Skeleton } from "@/shared/ui";
import {
    isLinkGone,
    LINK_PROBLEM_COPY,
    linkProblem,
    SENT_COPY,
    sendErrorMessage,
} from "./phone-upload.model";
import { PageNotice } from "./PageNotice";
import type { PhoneUploadContentProps } from "./types";
import { UploadForm } from "./UploadForm";
import { useSendInvoices, useUploadLink } from "./usePhoneUpload";
import styles from "./PhoneUploadPage.module.css";

/** Opened from the QR code on the computer: attach up to 10 PDFs or photos and send them, once. */
export function PhoneUploadPage() {
    const { token = "" } = useParams();
    return (
        <main className={styles.page}>
            <header className={styles.brand}>
                <span className={styles.mark} aria-hidden="true">
                    F
                </span>
                FinSift
            </header>
            <PhoneUploadContent token={token} />
        </main>
    );
}

function PhoneUploadContent({ token }: PhoneUploadContentProps) {
    const link = useUploadLink(token);
    const sending = useSendInvoices(token);

    if (sending.isSuccess)
        return <PageNotice tone="success" copy={SENT_COPY} />;
    if (link.isError) {
        const problem = linkProblem(link.error);
        return (
            <PageNotice
                tone="problem"
                copy={LINK_PROBLEM_COPY[problem]}
                onRetry={
                    problem === "unreachable"
                        ? () => void link.refetch()
                        : undefined
                }
            />
        );
    }
    if (sending.isError && isLinkGone(sending.error))
        return (
            <PageNotice
                tone="problem"
                copy={LINK_PROBLEM_COPY[linkProblem(sending.error)]}
            />
        );
    if (!link.data) return <Skeleton lines={4} height="3rem" />;
    return (
        <UploadForm
            expiresAt={link.data.expiresAt}
            isSending={sending.isPending}
            sendError={sendErrorMessage(sending.error)}
            onSend={(files) => sending.mutate(files)}
        />
    );
}
