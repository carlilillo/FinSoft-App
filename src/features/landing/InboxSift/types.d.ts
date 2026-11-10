import type {
    EmailRowState,
    SampleEmail,
    SampleInvoice,
} from "@/features/landing/types";

export type EmailRowProps = { email: SampleEmail; state: EmailRowState };

export type InvoiceStackProps = { invoices: SampleInvoice[] };

export type InvoiceCardProps = {
    invoice: SampleInvoice;
    /** 0 is the card on top of the stack. */
    depth: number;
};
