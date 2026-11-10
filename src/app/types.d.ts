import type { ReactNode } from "react";

export type ProvidersProps = { children: ReactNode };

export type FixtureInvoice = {
    id: string;
    vendorId: string;
    invoiceNumber: string | null;
    daysAgo: number;
    currency: string;
    language: "en" | "es";
    paymentMethod: string | null;
    lines: Array<{
        productKey: string;
        quantity: number;
        unitNetCents: number;
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
    id: string;
    vendorId: string;
    name: string;
    sku: string | null;
    unit: string | null;
};
