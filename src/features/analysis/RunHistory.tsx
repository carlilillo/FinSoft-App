import { Link } from "react-router";
import { formatDateTime } from "@/shared/lib/dates";
import { Badge } from "@/shared/ui";
import { runTone } from "./analysis.model";
import type { RunHistoryProps, RunStatus } from "./types";
import styles from "./RunHistory.module.css";

const STATUS_LABEL: Record<RunStatus, string> = {
    pending: "Starting",
    ingesting: "Fetching emails",
    extracting: "In progress",
    awaiting_review: "Ready to review",
    failed: "Stopped",
};

export function RunHistory({ runs }: RunHistoryProps) {
    if (runs.length === 0)
        return (
            <p className={styles.muted}>Your analyses will be listed here.</p>
        );
    return (
        <ul className={styles.list}>
            {runs.map((run) => (
                <li key={run.id}>
                    <Link to={`/analyses/${run.id}`} className={styles.row}>
                        <time dateTime={run.createdAt}>
                            {formatDateTime(run.createdAt)}
                        </time>
                        <span className={styles.muted}>
                            {run.emailsTotal} emails
                        </span>
                        <Badge tone={runTone(run.status)}>
                            {STATUS_LABEL[run.status]}
                        </Badge>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
