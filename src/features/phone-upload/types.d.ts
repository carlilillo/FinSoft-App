/** The two pickers on the phone: PDF documents from the files app, or photos from the gallery. */
export type PickKind = "document" | "photo";

/** A file attached on the phone, not sent yet. The id is derived from the file, so re-picking it is a no-op. */
export type PickedFile = { id: string; kind: PickKind; file: File };

/** Each pick (one or several files at once) is attached whole, or refused with a reason. */
export type PickResult =
    | { kind: "added"; picked: PickedFile[] }
    | { kind: "rejected"; message: string };

/** What the server says about an open link. */
export type UploadLinkInfo = { expiresAt: string };

/** Why the page can't take invoices. */
export type LinkProblem = "expired" | "used" | "invalid" | "unreachable";

export type NoticeCopy = { title: string; detail: string };

export type UploadFormProps = {
    expiresAt: string;
    isSending: boolean;
    /** The last send was refused (unsupported file, too many analyses running…); the files stay attached. */
    sendError: string | null;
    onSend: (files: File[]) => void;
};
export type AttachButtonProps = {
    kind: PickKind;
    remaining: number;
    isDisabled: boolean;
    onPick: (files: File[]) => void;
};
export type PickedFileListProps = {
    picked: PickedFile[];
    isDisabled: boolean;
    onRemove: (id: string) => void;
};
export type PickedFileRowProps = {
    item: PickedFile;
    isDisabled: boolean;
    onRemove: (id: string) => void;
};
export type PageNoticeProps = {
    tone: "success" | "problem";
    copy: NoticeCopy;
    onRetry?: () => void;
};
export type PhoneUploadContentProps = { token: string };
export type PhotoPreviewProps = { file: File };
