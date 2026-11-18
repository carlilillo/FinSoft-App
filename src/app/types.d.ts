import type { ReactNode } from "react";

export type ProvidersProps = { children: ReactNode };

export type FixtureInvoice = {
    id: string;
    /** Invoices the person issued to a customer; omitted, a provider's invoice. */
    direction?: "issued";
    vendorId: string;
    invoiceNumber: string | null;
    daysAgo: number;
    currency: string;
    language: "en" | "es";
    paymentMethod: string | null;
    lines: Array<{
        productKey: string;
        quantity: number;
        /** Decimal string, like every amount the API returns. */
        unitNet: string;
        vatRate: number;
    }>;
    withholdingRate?: number;
};

export type FixtureVendor = {
    id: string;
    name: string;
    taxId: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    country: string | null;
};

export type FixtureProduct = {
    key: string;
    /** Something the person sells; omitted, something they buy. */
    direction?: "issued";
    id: string;
    vendorId: string;
    name: string;
    sku: string | null;
    unit: string | null;
};
