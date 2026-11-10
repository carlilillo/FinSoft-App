import { formatRelative } from "@/shared/lib/dates";
import { Badge, Button, ErrorState, Skeleton } from "@/shared/ui";
import { useSessions } from "./useSettings";
import styles from "./SettingsPage.module.css";

export function SessionsSection() {
    const { sessions, endSession } = useSessions();
    return (
        <section aria-labelledby="sessions-title" className={styles.section}>
            <h2 id="sessions-title" className={styles.sectionTitle}>
                Signed-in devices
            </h2>
            {sessions.isPending && <Skeleton lines={2} />}
            {sessions.isError && (
                <ErrorState
                    error={sessions.error}
                    onRetry={() => void sessions.refetch()}
                />
            )}
            {sessions.data && (
                <ul className={styles.sessions}>
                    {sessions.data.map((session) => (
                        <li key={session.id} className={styles.session}>
                            <div>
                                <p className={styles.device}>
                                    {session.device}{" "}
                                    {session.isCurrent && (
                                        <Badge tone="accent">This device</Badge>
                                    )}
                                </p>
                                <p className={styles.muted}>
                                    {[
                                        session.location,
                                        `active ${formatRelative(session.lastActiveAt)}`,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                            </div>
                            {!session.isCurrent && (
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        endSession.mutate(session.id)
                                    }
                                    isBusy={endSession.isPending}
                                >
                                    Sign out
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
