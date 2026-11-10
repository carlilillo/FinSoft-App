export { InvoiceTable } from "./InvoiceTable";
export { invoiceTitle } from "./invoices.model";
export type { InvoiceDetail, InvoicePage, InvoiceSummary } from "./types";

export const loadInvoicesPage = () =>
    import("./InvoicesPage").then((module) => module.InvoicesPage);
export const loadInvoiceDetailPage = () =>
    import("./InvoiceDetailPage").then((module) => module.InvoiceDetailPage);
