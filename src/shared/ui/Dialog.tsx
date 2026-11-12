import { AnimatePresence, m } from "motion/react";
import { type SyntheticEvent, useEffect, useId, useRef } from "react";
import { Icon } from "./Icon";
import type { DialogProps } from "./types";
import styles from "./Dialog.module.css";

/** The panel leaves the way it came in: the same spring, played backwards. */
const HIDDEN = { opacity: 0, y: 24, scale: 0.98 };
const SHOWN = { opacity: 1, y: 0, scale: 1 };
const SPRING = { type: "spring", stiffness: 380, damping: 30 } as const;
/** Same path out, without the spring's long invisible settle: the dialog stops blocking clicks sooner. */
const LEAVING = {
    ...HIDDEN,
    transition: { type: "spring", visualDuration: 0.22, bounce: 0 },
} as const;

/**
 * Native <dialog>: focus trapping and focus return come from the browser. Closing is animated: the
 * dialog stays in the top layer until the panel's exit animation ends, then closes for real.
 */
export function Dialog({
    isOpen,
    title,
    description,
    onClose,
    children,
}: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const dialog = ref.current;
        if (isOpen && dialog && !dialog.open) dialog.showModal();
    }, [isOpen]);

    // Escape would close the dialog at once; ask the owner to close it so the exit animation plays.
    const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault();
        onClose();
    };

    return (
        <dialog
            ref={ref}
            className={styles.dialog}
            data-state={isOpen ? "open" : "closing"}
            onCancel={handleCancel}
            onClose={onClose}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
        >
            <AnimatePresence onExitComplete={() => ref.current?.close()}>
                {isOpen && (
                    <m.div
                        key="panel"
                        className={styles.panel}
                        initial={HIDDEN}
                        animate={SHOWN}
                        exit={LEAVING}
                        transition={SPRING}
                    >
                        <header className={styles.header}>
                            <div className={styles.heading}>
                                <h2 id={titleId} className={styles.title}>
                                    {title}
                                </h2>
                                {description && (
                                    <p
                                        id={descriptionId}
                                        className={styles.description}
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                className={styles.close}
                                aria-label="Close"
                                onClick={onClose}
                            >
                                <Icon name="close" size={18} />
                            </button>
                        </header>
                        {children}
                    </m.div>
                )}
            </AnimatePresence>
        </dialog>
    );
}
