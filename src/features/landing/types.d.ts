import type { ReactNode } from "react";
import type { Amount } from "@/shared/lib/money";

export type SiftVerdict = "invoice" | "skipped";

export type SampleEmail = {
    id: string;
    sender: string;
    subject: string;
    attachment: string | null;
    verdict: SiftVerdict;
    /** Set when the email carries one of the sample invoices. */
    invoiceId?: string;
};

export type SampleLine = {
    description: string;
    quantity: number;
    unit: Amount;
    total: Amount;
};

export type SampleInvoice = {
    id: string;
    vendor: string;
    taxId: string | null;
    number: string | null;
    issuedOn: string;
    currency: "EUR" | "GBP";
    /** Locale the amounts are printed in on the original document. */
    locale: string;
    lines: SampleLine[];
    subtotal: Amount;
    vatRate: number;
    vat: Amount;
    withholdingRate: number | null;
    withholding: Amount | null;
    total: Amount;
};

/** Where the hero's inbox review stands: an email is "scanning" while FinSift reads it. */
export type EmailRowState = "waiting" | "scanning" | SiftVerdict;

export type SiftProgress = {
    reviewed: number;
    total: number;
    isDone: boolean;
    /** Invoices found so far, in the order they were found (the latest one is on top of the stack). */
    found: SampleInvoice[];
};

export type StackPose = { y: number; scale: number };

export type PricePoint = { month: string; monthName: string; net: Amount };

export type ChartPoint = PricePoint & {
    x: number;
    y: number;
    gross: Amount;
};

export type PriceChart = {
    width: number;
    height: number;
    points: ChartPoint[];
    /** Stepped line: a price holds until the next invoice changes it. */
    path: string;
    /** Edges of the plotting area inside the SVG box. */
    plot: { left: number; right: number; top: number; bottom: number };
    /** `value` is display math (an axis label), not an exact amount. */
    ticks: Array<{ y: number; value: number }>;
};

export type GlossaryTerm = { spanish: string; english: string };

export type HowStep = { title: string; body: string };

export type LandingSectionProps = { id: string };

export type LandingHeaderProps = { isSignedIn: boolean };

export type OverviewLinkProps = { children: ReactNode };

export type SectionLinkProps = {
    sectionId: string;
    className?: string;
    children: ReactNode;
};
