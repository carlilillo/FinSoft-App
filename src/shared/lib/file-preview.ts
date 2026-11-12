import { useCallback } from "react";

/**
 * Shows a local image file without loading it into memory twice: the object URL lives as long as
 * the <img> it is attached to. A ref callback (with its React 19 cleanup) instead of an effect, so
 * the URL is created only when there is an element to show it in.
 */
export function useFilePreview(file: File) {
    return useCallback(
        (image: HTMLImageElement | null) => {
            if (!image) return;
            const url = URL.createObjectURL(file);
            image.src = url;
            return () => URL.revokeObjectURL(url);
        },
        [file],
    );
}
