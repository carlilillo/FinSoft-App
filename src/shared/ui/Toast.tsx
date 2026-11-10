import { AnimatePresence, m } from "motion/react";
import { createContext, useContext, useState } from "react";
import { Link } from "react-router";
import type { Toast, ToastContextValue, ToastProviderProps } from "./types";
import styles from "./Toast.module.css";

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_MS = 6_000;
let nextId = 1;

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (toast: Omit<Toast, "id">) => {
        const id = nextId++;
        setToasts((current) => [...current, { ...toast, id }]);
        window.setTimeout(
            () =>
                setToasts((current) =>
                    current.filter((item) => item.id !== id),
                ),
            TOAST_MS,
        );
    };

    return (
        <ToastContext value={{ showToast }}>
            {children}
            <div className={styles.region} role="status" aria-live="polite">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <m.div
                            key={toast.id}
                            className={styles.toast}
                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8 }}
                            layout
                        >
                            <span>{toast.message}</span>
                            {toast.action && (
                                <Link
                                    to={toast.action.to}
                                    className={styles.action}
                                >
                                    {toast.action.label}
                                </Link>
                            )}
                        </m.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext>
    );
}

export function useToast(): ToastContextValue {
    const value = useContext(ToastContext);
    if (!value) throw new Error("useToast must be used inside <ToastProvider>");
    return value;
}
