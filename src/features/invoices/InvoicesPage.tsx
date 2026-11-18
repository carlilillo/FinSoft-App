import { useDeferredValue, useState } from "react";
import { ImportActions } from "@/features/analysis";
import {
    ButtonLink,
    EmptyState,
    ErrorState,
    Icon,
    PageHeader,
    Skeleton,
} from "@/shared/ui";
import { DirectionFilterControl } from "./DirectionFilterControl";
import { InvoiceTable } from "./InvoiceTable";
import { Pagination } from "./Pagination";
import type { DirectionFilter, InvoiceResultsProps } from "./types";
import { useDirectionFilter } from "./useDirectionFilter";
import { useInvoices } from "./useInvoices";
import styles from "./InvoicesPage.module.css";

export function InvoicesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useDirectionFilter();
    const deferredSearch = useDeferredValue(search);
    const query = useInvoices({
        search: deferredSearch,
        page,
        direction: filter,
    });

    const handleFilterChange = (next: DirectionFilter) => {
        setFilter(next);
        setPage(1);
    };

    return (
        <>
            <PageHeader
                title="Invoices"
                description="Every invoice you issued or received, extracted from your inbox or imported by hand, newest first."
                actions={<ImportActions />}
            />
            <div className={styles.toolbar}>
                <label className={styles.search}>
                    <Icon name="search" />
                    <span className="visually-hidden">Search invoices</span>
                    <input
                        type="search"
                        placeholder="Search by company or invoice number"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                </label>
                <DirectionFilterControl
                    value={filter}
                    onChange={handleFilterChange}
                />
            </div>
            <InvoiceResults
                query={query}
                search={deferredSearch}
                filter={filter}
                onPageChange={setPage}
            />
        </>
    );
}

const EMPTY_TITLES: Record<DirectionFilter, string> = {
    all: "No invoices yet",
    issued: "No invoices issued by you yet",
    received: "No invoices from providers yet",
};

const EMPTY_DETAILS: Record<DirectionFilter, string> = {
    all: "Run an analysis or import invoices (PDFs or photos), and everything FinSift extracts will be listed here.",
    issued: "Import the invoices you sent to your customers with “Import your invoices”, and they’ll be listed here.",
    received:
        "Run an analysis or import the invoices your providers sent you, and they’ll be listed here.",
};

function InvoiceResults({
    query,
    search,
    filter,
    onPageChange,
}: InvoiceResultsProps) {
    if (query.isPending) return <Skeleton lines={8} height="2.25rem" />;
    if (query.isError)
        return (
            <ErrorState
                error={query.error}
                onRetry={() => void query.refetch()}
            />
        );
    if (query.data.total === 0 && search)
        return <EmptyState title={`No invoices match “${search}”`} />;
    if (query.data.total === 0) {
        return (
            <EmptyState
                title={EMPTY_TITLES[filter]}
                action={
                    filter === "issued" ? undefined : (
                        <ButtonLink to="/analyze">
                            Analyze last week&apos;s emails
                        </ButtonLink>
                    )
                }
            >
                {EMPTY_DETAILS[filter]}
            </EmptyState>
        );
    }
    return (
        <>
            <InvoiceTable invoices={query.data.items} />
            <Pagination
                page={query.data.page}
                pageSize={query.data.pageSize}
                total={query.data.total}
                onChange={onPageChange}
            />
        </>
    );
}
