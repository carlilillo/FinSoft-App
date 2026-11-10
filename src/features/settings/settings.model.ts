export const DELETE_CONFIRMATION = "delete my account";

export function isDeleteConfirmed(input: string): boolean {
    return input.trim().toLowerCase() === DELETE_CONFIRMATION;
}

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export function photoProblem(file: File): string | null {
    if (!file.type.startsWith("image/"))
        return "Choose an image file (PNG, JPG or WebP).";
    if (file.size > MAX_PHOTO_BYTES)
        return "Choose an image smaller than 10 MB.";
    return null;
}
