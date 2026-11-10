import { Button } from "@/shared/ui";
import type { PaginationProps } from "./types";
import styles from "./Pagination.module.css";

export function Pagination({
    page,
    pageSize,
    total,
    onChange,
}: PaginationProps) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    if (pageCount === 1) return null;
    return (
        <nav className={styles.pagination} aria-label="Pages">
            <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >
                Previous
            </Button>
            <span className={styles.position}>
                Page {page} of {pageCount}
            </span>
            <Button
                variant="secondary"
                disabled={page >= pageCount}
                onClick={() => onChange(page + 1)}
            >
                Next
            </Button>
        </nav>
    );
}
