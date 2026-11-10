import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { DialogProps } from "./types";
import styles from "./Dialog.module.css";

const DISMISS_DISTANCE = 120;

/** Native <dialog>: focus trapping, Escape and focus return come from the browser. */
export function Dialog({
    isOpen,
    title,
    onClose,
    children,
    isDraggable = false,
}: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    const canDrag = isDraggable && !prefersReducedMotion;

    return (
        <dialog
            ref={ref}
            className={styles.dialog}
            onClose={onClose}
            aria-labelledby="dialog-title"
        >
            {isOpen && (
                <m.div
                    className={styles.panel}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    drag={canDrag ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0.05, bottom: 0.6 }}
                    onDragEnd={(_event, info) => {
                        if (info.offset.y > DISMISS_DISTANCE) onClose();
                    }}
                >
                    {canDrag && (
                        <span className={styles.grabber} aria-hidden="true" />
                    )}
                    <h2 id="dialog-title" className={styles.title}>
                        {title}
                    </h2>
                    {children}
                </m.div>
            )}
        </dialog>
    );
}
