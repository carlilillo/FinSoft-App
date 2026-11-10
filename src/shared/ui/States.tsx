import { ApiError } from "@/shared/lib/http";
import { Button } from "./Button";
import type {
    BadgeProps,
    EmptyStateProps,
    ErrorStateProps,
    SkeletonProps,
} from "./types";
import styles from "./States.module.css";

export function Skeleton({ lines = 3, height = "1rem" }: SkeletonProps) {
    return (
        <div className={styles.skeleton} aria-busy="true" aria-label="Loading">
            {Array.from({ length: lines }, (_, index) => (
                <span key={index} className={styles.bar} style={{ height }} />
            ))}
        </div>
    );
}

export function EmptyState({ title, children, action }: EmptyStateProps) {
    return (
        <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>{title}</h3>
            {children && <p className={styles.emptyText}>{children}</p>}
            {action}
        </div>
    );
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    const message =
        error instanceof ApiError
            ? error.message
            : "Something went wrong while loading this page.";
    return (
        <div className={styles.error} role="alert">
            <p>{message}</p>
            {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
    );
}
