import { useDeferredValue, useState } from "react";
import {
    ButtonLink,
    EmptyState,
    ErrorState,
    Icon,
    PageHeader,
    Skeleton,
} from "@/shared/ui";
import { InvoiceTable } from "./InvoiceTable";
import { Pagination } from "./Pagination";
import { useInvoices } from "./useInvoices";
import type { InvoiceResultsProps } from "./types";
import styles from "./InvoicesPage.module.css";

export function InvoicesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const deferredSearch = useDeferredValue(search);
    const query = useInvoices({ search: deferredSearch, page });

    return (
        <>
            <PageHeader
                title="Invoices"
                description="Every invoice extracted from your inbox, newest first."
            />
            <label className={styles.search}>
                <Icon name="search" />
                <span className="visually-hidden">Search invoices</span>
                <input
                    type="search"
                    placeholder="Search by vendor or invoice number"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
            </label>
            <InvoiceResults
                query={query}
                search={deferredSearch}
                onPageChange={setPage}
            />
        </>
    );
}

function InvoiceResults({ query, search, onPageChange }: InvoiceResultsProps) {
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
                title="No invoices yet"
                action={
                    <ButtonLink to="/analyze">
                        Analyze last week&apos;s emails
                    </ButtonLink>
                }
            >
                Run an analysis and the invoices FinSift finds will be listed
                here.
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
