import { useState } from "react";
import {
    ButtonLink,
    EmptyState,
    ErrorState,
    PageHeader,
    SegmentedControl,
    Skeleton,
} from "@/shared/ui";
import { SPEND_RANGES } from "./insights.model";
import { RecentInvoices } from "./RecentInvoices";
import { SpendChart } from "./SpendChart";
import { SpendHeadline } from "./SpendHeadline";
import type { SpendRange, SpendSectionProps } from "./types";
import { useDashboardSummary, useSpendOverview } from "./useSpend";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
    const [range, setRange] = useState<SpendRange>("7d");

    return (
        <>
            <PageHeader
                title="Overview"
                description="What you've spent, from the invoices FinSift found in your inbox."
                actions={<ButtonLink to="/analyze">Analyze emails</ButtonLink>}
            />
            <section className={styles.spend} aria-labelledby="spend-title">
                <div className={styles.spendHeader}>
                    <h2 id="spend-title" className={styles.sectionTitle}>
                        Spending
                    </h2>
                    <SegmentedControl
                        label="Period"
                        options={SPEND_RANGES}
                        value={range}
                        onChange={setRange}
                    />
                </div>
                <SpendSection range={range} />
            </section>
            <section className={styles.recent} aria-labelledby="recent-title">
                <h2 id="recent-title" className={styles.sectionTitle}>
                    Latest invoices
                </h2>
                <RecentSection />
            </section>
        </>
    );
}

function SpendSection({ range }: SpendSectionProps) {
    const query = useSpendOverview(range);
    if (query.isPending) return <Skeleton lines={4} height="2rem" />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.status === "empty") {
        return (
            <EmptyState
                title="No spending in this period"
                action={
                    <ButtonLink to="/analyze">
                        Analyze last week&apos;s emails
                    </ButtonLink>
                }
            >
                Invoices appear here once FinSift extracts them from your inbox.
            </EmptyState>
        );
    }
    return (
        <>
            <SpendHeadline overview={query.data} />
            <SpendChart
                days={query.data.days}
                currency={query.data.currency}
                range={query.data.range}
            />
        </>
    );
}

function RecentSection() {
    const query = useDashboardSummary();
    if (query.isPending) return <Skeleton lines={5} />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.recentInvoices.length === 0)
        return <p className={styles.muted}>No invoices yet.</p>;
    return <RecentInvoices invoices={query.data.recentInvoices} />;
}
