import { MAX_IMPORT_FILE_BYTES, MAX_IMPORT_FILES } from "@/features/analysis";
import { ApiError } from "@/shared/lib/http";
import type {
    LinkProblem,
    NoticeCopy,
    PickedFile,
    PickKind,
    PickResult,
} from "./types";

const IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".heic",
    ".heif",
    ".avif",
    ".tif",
    ".tiff",
    ".bmp",
];

/** For the pickers: the documents button opens the files app on PDFs, the photos button the gallery. */
export const PICK_ACCEPT: Record<PickKind, string> = {
    document: "application/pdf,.pdf",
    photo: "image/*",
};

export function remainingSlots(picked: PickedFile[]): number {
    return Math.max(0, MAX_IMPORT_FILES - picked.length);
}

/** Phones sometimes report an empty type, so the extension counts too. The server reads the real format. */
function matchesKind(file: File, kind: PickKind): boolean {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    if (kind === "document")
        return type === "application/pdf" || name.endsWith(".pdf");
    return (
        type.startsWith("image/") ||
        IMAGE_EXTENSIONS.some((extension) => name.endsWith(extension))
    );
}

function pickId(file: File, kind: PickKind): string {
    return `${kind}:${file.name}:${file.size}:${file.lastModified}`;
}

/**
 * Adds one pick to what is attached. A pick is all or nothing: it must fit in the slots left
 * (10 files in total, documents and photos together) and every file must be of its picker's kind.
 * A file attached twice is kept once.
 */
export function addPicked(
    picked: PickedFile[],
    files: File[],
    kind: PickKind,
): PickResult {
    const wrongKind = files.find((file) => !matchesKind(file, kind));
    if (wrongKind) {
        return {
            kind: "rejected",
            message:
                kind === "document"
                    ? `${wrongKind.name} is not a PDF. Attach images with “Photos”.`
                    : `${wrongKind.name} is not an image. Attach PDFs with “Documents”.`,
        };
    }
    const badSize = files.find(
        (file) => file.size === 0 || file.size > MAX_IMPORT_FILE_BYTES,
    );
    if (badSize)
        return {
            kind: "rejected",
            message: `${badSize.name} is empty or larger than ${MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB.`,
        };

    const known = new Set(picked.map((item) => item.id));
    const fresh = files
        .map((file) => ({ id: pickId(file, kind), kind, file }))
        .filter((item, index, all) => {
            if (known.has(item.id)) return false;
            return all.findIndex((other) => other.id === item.id) === index;
        });
    if (fresh.length === 0)
        return {
            kind: "rejected",
            message:
                files.length === 1
                    ? "That file is already attached."
                    : "Those files are already attached.",
        };

    const remaining = remainingSlots(picked);
    if (fresh.length > remaining)
        return {
            kind: "rejected",
            message: overLimitMessage(fresh.length, remaining),
        };
    return { kind: "added", picked: [...picked, ...fresh] };
}

function overLimitMessage(count: number, remaining: number): string {
    if (remaining === 0)
        return `You already attached ${MAX_IMPORT_FILES} files, the most you can send at once.`;
    const fits =
        remaining === 1 ? "only 1 more fits" : `only ${remaining} more fit`;
    return `You picked ${count} files but ${fits} (${MAX_IMPORT_FILES} at most). Pick up to ${remaining}.`;
}

export function removePicked(picked: PickedFile[], id: string): PickedFile[] {
    return picked.filter((item) => item.id !== id);
}

/** "3 of 10 attached" */
export function attachedLabel(count: number): string {
    return `${count} of ${MAX_IMPORT_FILES} attached`;
}

export function sendLabel(count: number): string {
    if (count === 0) return "Attach invoices to send";
    return count === 1 ? "Send 1 invoice" : `Send ${count} invoices`;
}

/** Expired and used links answer 410 with a code; a token nobody issued answers 404. */
export function linkProblem(error: unknown): LinkProblem {
    if (!(error instanceof ApiError)) return "unreachable";
    if (error.code === "PHONE_UPLOAD_LINK_EXPIRED") return "expired";
    if (error.code === "PHONE_UPLOAD_LINK_USED") return "used";
    if (error.status === 404) return "invalid";
    return "unreachable";
}

/** A refused send that disabled the page for good (as opposed to one the person can fix and retry). */
export function isLinkGone(error: unknown): boolean {
    const problem = linkProblem(error);
    return problem === "expired" || problem === "used" || problem === "invalid";
}

export const LINK_PROBLEM_COPY: Record<LinkProblem, NoticeCopy> = {
    expired: {
        title: "This link has expired",
        detail: "Upload links last 30 minutes. On your computer, choose Import invoices, then From your phone, to get a new QR code.",
    },
    used: {
        title: "These invoices were already sent",
        detail: "Each QR code works once. To send more invoices, create a new one on your computer.",
    },
    invalid: {
        title: "This link isn't valid",
        detail: "Scan the QR code shown on your computer again.",
    },
    unreachable: {
        title: "FinSift can't be reached",
        detail: "Check your connection and try again.",
    },
};

export const SENT_COPY: NoticeCopy = {
    title: "Invoices sent",
    detail: "FinSift is reading them now. Follow along on your computer; you can close this page.",
};

export function sendErrorMessage(error: unknown): string | null {
    if (!error) return null;
    return error instanceof ApiError
        ? error.message
        : "The invoices couldn't be sent. Check your connection and try again.";
}
