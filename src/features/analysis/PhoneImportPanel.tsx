import { Button, ErrorState, Icon } from "@/shared/ui";
import { MAX_IMPORT_FILES } from "./analysis.model";
import { BackButton } from "./BackButton";
import { CopyableLink } from "./CopyableLink";
import { LinkCountdown } from "./LinkCountdown";
import { QrCode } from "./QrCode";
import type {
    LinkNoteProps,
    LinkStatusProps,
    PhoneImportFrameProps,
    PhoneImportPanelProps,
    PhoneLinkStepProps,
} from "./types";
import {
    useFollowPhoneUpload,
    usePhoneUploadLinkState,
} from "./usePhoneImport";
import styles from "./PhoneImportPanel.module.css";

/** A new link (after "New code") gets a fresh panel, with its own polling and countdown. */
export function PhoneLinkStep({
    link,
    error,
    onRenew,
    onBack,
}: PhoneLinkStepProps) {
    if (error)
        return (
            <div className={styles.panel}>
                <ErrorState error={error} onRetry={onRenew} />
                <BackButton onBack={onBack} />
            </div>
        );
    if (!link)
        return (
            <PhoneImportFrame
                code={
                    <span
                        className={styles.placeholder}
                        aria-busy="true"
                        aria-label="Creating your QR code"
                    />
                }
                status={
                    <p className={styles.status}>Creating a secure link…</p>
                }
                link={<span className={styles.linkPlaceholder} />}
                note={null}
                onBack={onBack}
            />
        );
    return (
        <PhoneImportPanel
            key={link.id}
            link={link}
            onRenew={onRenew}
            onBack={onBack}
        />
    );
}

/** Shows the QR code and waits: once the phone sends its invoices, the computer opens their session. */
function PhoneImportPanel({ link, onRenew, onBack }: PhoneImportPanelProps) {
    const { data: state } = usePhoneUploadLinkState(link.id);
    useFollowPhoneUpload(state);
    const status = state?.status ?? "open";

    return (
        <PhoneImportFrame
            code={
                <>
                    <QrCode
                        value={link.url}
                        label="QR code that opens FinSift's upload page on your phone"
                    />
                    {status === "expired" && (
                        <span className={styles.overlay}>
                            <Button onClick={onRenew}>New code</Button>
                        </span>
                    )}
                    {status === "used" && (
                        <span className={styles.overlay}>
                            <span className={styles.received}>
                                <Icon name="check" size={26} />
                            </span>
                        </span>
                    )}
                </>
            }
            status={<LinkStatus status={status} />}
            link={status === "open" ? <CopyableLink url={link.url} /> : null}
            note={<LinkNote status={status} expiresAt={link.expiresAt} />}
            onBack={onBack}
        />
    );
}

function PhoneImportFrame({
    code,
    status,
    link,
    note,
    onBack,
}: PhoneImportFrameProps) {
    return (
        <div className={styles.panel}>
            <div className={styles.card}>
                <div className={styles.code}>{code}</div>
                <div className={styles.side}>
                    <ol className={styles.steps}>
                        <li>Scan the code with your phone&apos;s camera</li>
                        <li>Attach up to {MAX_IMPORT_FILES} PDFs or photos</li>
                        <li>Send them; this window opens the extraction</li>
                    </ol>
                    {status}
                </div>
            </div>
            {link}
            <footer className={styles.footer}>
                <BackButton onBack={onBack} />
                {note}
            </footer>
        </div>
    );
}

function LinkStatus({ status }: LinkStatusProps) {
    if (status === "used")
        return (
            <p className={styles.status} data-tone="success" role="status">
                <Icon name="check" size={14} />
                Invoices received
            </p>
        );
    if (status === "expired")
        return (
            <p className={styles.status} data-tone="danger" role="alert">
                This code expired
            </p>
        );
    return (
        <p className={styles.status} role="status">
            <span className={styles.pulse} aria-hidden="true" />
            Waiting for your phone
        </p>
    );
}

function LinkNote({ status, expiresAt }: LinkNoteProps) {
    if (status === "used")
        return <p className={styles.note}>Opening the extraction…</p>;
    if (status === "expired")
        return <p className={styles.note}>Codes last 30 minutes</p>;
    return (
        <p className={styles.note}>
            One-time link, expires in <LinkCountdown expiresAt={expiresAt} />
        </p>
    );
}
