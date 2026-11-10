import { AnimatePresence, m } from "motion/react";
import { ErrorState, Select, Skeleton, Switch } from "@/shared/ui";
import {
    applyScheduleChange,
    browserTimeZone,
    describeNextRun,
    HOUR_OPTIONS,
    scheduleGmailNote,
    WEEKDAY_OPTIONS,
} from "./schedule.model";
import {
    useAnalysisSchedule,
    useGmailConnection,
    useSaveAnalysisSchedule,
} from "./useAnalysis";
import type { ScheduleTimeProps, ScheduleUpdate } from "./types";
import styles from "./ScheduledAnalysis.module.css";

const REVEAL = { duration: 0.32, ease: [0.22, 1, 0.36, 1] } as const;

/** Weekly analysis the server runs on its own; every change is saved right away. */
export function ScheduledAnalysis() {
    const connection = useGmailConnection();
    const schedule = useAnalysisSchedule();
    const save = useSaveAnalysisSchedule();

    if (schedule.isPending || connection.isPending)
        return <Skeleton lines={1} height="4.5rem" />;
    if (schedule.isError)
        return (
            <ErrorState
                error={schedule.error}
                onRetry={() => void schedule.refetch()}
            />
        );

    const current = schedule.data;
    const isGmailConnected = connection.data?.connected ?? false;
    const change = (patch: Partial<ScheduleUpdate>) =>
        save.mutate(applyScheduleChange(current, patch, browserTimeZone()));
    const gmailNote = scheduleGmailNote(current, isGmailConnected);

    return (
        <section className={styles.schedule} aria-labelledby="schedule-title">
            <h2 id="schedule-title" className="visually-hidden">
                Scheduled analysis
            </h2>
            <Switch
                label="Analyze my inbox every week"
                description={
                    gmailNote ??
                    "FinSift reviews the last 7 days of email on its own and saves the invoices it finds."
                }
                isOn={current.enabled}
                disabled={!isGmailConnected && !current.enabled}
                onChange={(enabled) => change({ enabled })}
            />
            <AnimatePresence initial={false}>
                {current.enabled && (
                    <m.div
                        key="time"
                        className={styles.reveal}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={REVEAL}
                    >
                        <ScheduleTime
                            schedule={current}
                            isPaused={!isGmailConnected}
                            onChange={change}
                        />
                    </m.div>
                )}
            </AnimatePresence>
            {save.isError && <ErrorState error={save.error} />}
        </section>
    );
}

function ScheduleTime({ schedule, isPaused, onChange }: ScheduleTimeProps) {
    return (
        <m.div
            className={styles.time}
            initial={{ y: -8 }}
            animate={{ y: 0 }}
            transition={REVEAL}
        >
            <div className={styles.fields}>
                <Select
                    label="Day"
                    options={WEEKDAY_OPTIONS}
                    value={schedule.weekday}
                    disabled={isPaused}
                    onChange={(weekday) => onChange({ weekday })}
                />
                <Select
                    label="Hour"
                    options={HOUR_OPTIONS}
                    value={String(schedule.hour)}
                    disabled={isPaused}
                    onChange={(hour) => onChange({ hour: Number(hour) })}
                />
            </div>
            <p className={styles.next} aria-live="polite">
                {describeNextRun(schedule)}
                <span className={styles.zone}>
                    {" "}
                    · {schedule.timeZone.replaceAll("_", " ")} time
                </span>
            </p>
        </m.div>
    );
}
