import { useState } from "react";
import {
    type DirectionFilter,
    DirectionFilterControl,
    useDirectionFilter,
} from "@/features/invoices";
import {
    ButtonLink,
    EmptyState,
    ErrorState,
    PageHeader,
    SegmentedControl,
    Skeleton,
} from "@/shared/ui";
import { CashFlowChart } from "./CashFlowChart";
import { CashFlowHeadline } from "./CashFlowHeadline";
import { CASH_FLOW_RANGES, CASH_FLOW_TITLES } from "./insights.model";
import { RecentInvoices } from "./RecentInvoices";
import type {
    CashFlowRange,
    CashFlowSectionProps,
    RecentSectionProps,
} from "./types";
import { useCashFlowOverview, useDashboardSummary } from "./useCashFlow";
import styles from "./DashboardPage.module.css";

/** One filter drives the chart, its headline and the latest invoices. */
export function DashboardPage() {
    const [range, setRange] = useState<CashFlowRange>("7d");
    const [filter, setFilter] = useDirectionFilter();

    return (
        <>
            <PageHeader
                title="Overview"
                description="What you've invoiced and what you've been billed, from the invoices FinSift found or you imported."
                actions={<ButtonLink to="/analyze">Analyze emails</ButtonLink>}
            />
            <section className={styles.spend} aria-labelledby="spend-title">
                <div className={styles.spendHeader}>
                    <h2 id="spend-title" className={styles.sectionTitle}>
                        {CASH_FLOW_TITLES[filter]}
                    </h2>
                    <div className={styles.controls}>
                        <DirectionFilterControl
                            value={filter}
                            onChange={setFilter}
                        />
                        <SegmentedControl
                            label="Period"
                            options={CASH_FLOW_RANGES}
                            value={range}
                            onChange={setRange}
                        />
                    </div>
                </div>
                <CashFlowSection range={range} filter={filter} />
            </section>
            <section className={styles.recent} aria-labelledby="recent-title">
                <h2 id="recent-title" className={styles.sectionTitle}>
                    Latest invoices
                </h2>
                <RecentSection filter={filter} />
            </section>
        </>
    );
}

const EMPTY_TITLES: Record<DirectionFilter, string> = {
    all: "No invoices in this period",
    issued: "No invoices issued in this period",
    received: "No spending in this period",
};

function CashFlowSection({ range, filter }: CashFlowSectionProps) {
    const query = useCashFlowOverview(range, filter);
    if (query.isPending) return <Skeleton lines={4} height="2rem" />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.status === "empty") {
        return filter === "issued" ? (
            <EmptyState
                title={EMPTY_TITLES.issued}
                action={
                    <ButtonLink to="/invoices">Import your invoices</ButtonLink>
                }
            >
                The invoices you send to your customers appear here once you
                import them.
            </EmptyState>
        ) : (
            <EmptyState
                title={EMPTY_TITLES[filter]}
                action={
                    <ButtonLink to="/analyze">
                        Analyze last week&apos;s emails
                    </ButtonLink>
                }
            >
                Invoices appear here once FinSift extracts them from your inbox
                or you import them.
            </EmptyState>
        );
    }
    return (
        <>
            <CashFlowHeadline overview={query.data} />
            <CashFlowChart
                points={query.data.points}
                currency={query.data.currency}
                range={query.data.range}
                filter={query.data.filter}
            />
        </>
    );
}

const NO_RECENT: Record<DirectionFilter, string> = {
    all: "No invoices yet.",
    issued: "No invoices issued by you yet.",
    received: "No invoices from providers yet.",
};

function RecentSection({ filter }: RecentSectionProps) {
    const query = useDashboardSummary(filter);
    if (query.isPending) return <Skeleton lines={5} />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.recentInvoices.length === 0)
        return <p className={styles.muted}>{NO_RECENT[filter]}</p>;
    return <RecentInvoices invoices={query.data.recentInvoices} />;
}
