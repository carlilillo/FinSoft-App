import type {
    GlossaryTerm,
    HowStep,
    PricePoint,
    SampleEmail,
    SampleInvoice,
} from "./types";

/** The sample week the hero sifts through. Invoice emails are ordered so the detailed one is found last. */
export const SAMPLE_EMAILS: readonly SampleEmail[] = [
    {
        id: "newsletter",
        sender: "Tienda Verde",
        subject: "Novedades de noviembre",
        attachment: null,
        verdict: "skipped",
    },
    {
        id: "brew",
        sender: "Brew & Bean",
        subject: "Your receipt from Brew & Bean",
        attachment: "receipt.png",
        verdict: "invoice",
        invoiceId: "brew",
    },
    {
        id: "shipping",
        sender: "Envíos Rápidos",
        subject: "Tu pedido está en camino",
        attachment: null,
        verdict: "skipped",
    },
    {
        id: "power",
        sender: "Luz Norte Energía",
        subject: "Tu factura de octubre",
        attachment: "factura-octubre.pdf",
        verdict: "invoice",
        invoiceId: "power",
    },
    {
        id: "digest",
        sender: "Studio Weekly",
        subject: "Five links worth your Friday",
        attachment: null,
        verdict: "skipped",
    },
    {
        id: "stationery",
        sender: "Papelería Martínez",
        subject: "Factura FV-2026/118",
        attachment: "FV-2026-118.pdf",
        verdict: "invoice",
        invoiceId: "stationery",
    },
];

export const SAMPLE_INVOICES: readonly SampleInvoice[] = [
    {
        id: "brew",
        vendor: "Brew & Bean",
        taxId: null,
        number: null,
        issuedOn: "4 Nov 2026",
        currency: "GBP",
        locale: "en-GB",
        lines: [
            {
                description: "Flat white",
                quantity: 2,
                unitCents: 300,
                totalCents: 600,
            },
            {
                description: "Banana bread",
                quantity: 1,
                unitCents: 400,
                totalCents: 400,
            },
        ],
        subtotalCents: 1000,
        vatRate: 20,
        vatCents: 200,
        withholdingRate: null,
        withholdingCents: null,
        totalCents: 1200,
    },
    {
        id: "power",
        vendor: "Luz Norte Energía",
        taxId: "A87654321",
        number: "LN-2026-10-4471",
        issuedOn: "2 Nov 2026",
        currency: "EUR",
        locale: "es-ES",
        lines: [
            {
                description: "Energía consumida (212 kWh)",
                quantity: 1,
                unitCents: 5952,
                totalCents: 5952,
            },
            {
                description: "Término de potencia",
                quantity: 1,
                unitCents: 1000,
                totalCents: 1000,
            },
        ],
        subtotalCents: 6952,
        vatRate: 21,
        vatCents: 1460,
        withholdingRate: null,
        withholdingCents: null,
        totalCents: 8412,
    },
    {
        id: "stationery",
        vendor: "Papelería Martínez",
        taxId: "B12345678",
        number: "FV-2026/118",
        issuedOn: "3 Nov 2026",
        currency: "EUR",
        locale: "es-ES",
        lines: [
            {
                description: "Papel A4 80 g (caja)",
                quantity: 4,
                unitCents: 1500,
                totalCents: 6000,
            },
            {
                description: "Bolígrafo azul (pack 10)",
                quantity: 2,
                unitCents: 2000,
                totalCents: 4000,
            },
        ],
        subtotalCents: 10000,
        vatRate: 21,
        vatCents: 2100,
        withholdingRate: 15,
        withholdingCents: 1500,
        totalCents: 10600,
    },
];

export const HOW_STEPS: readonly HowStep[] = [
    {
        title: "Connect Gmail",
        body: "Sign in with Google, Apple or GitHub, then give FinSift read-only access to your inbox.",
    },
    {
        title: "FinSift reads last week",
        body: "It reviews every email from the past seven days in the background, attachments included. You can close the tab.",
    },
    {
        title: "Check and correct",
        body: "See which emails held invoices. Tick any it missed and run it again on the same session.",
    },
];

export const GLOSSARY: readonly GlossaryTerm[] = [
    { spanish: "Base imponible", english: "Subtotal before VAT" },
    { spanish: "IVA", english: "VAT" },
    { spanish: "Retención IRPF", english: "Income tax withheld" },
    { spanish: "Recargo de equivalencia", english: "Equivalence surcharge" },
    { spanish: "Fecha de emisión", english: "Issue date" },
    { spanish: "Vencimiento", english: "Due date" },
];

/** Net price per box of the stationery invoice's paper, one point per monthly invoice. */
export const PAPER_PRICES: readonly PricePoint[] = [
    { month: "Aug", monthName: "August", netCents: 1350 },
    { month: "Sep", monthName: "September", netCents: 1350 },
    { month: "Oct", monthName: "October", netCents: 1420 },
    { month: "Nov", monthName: "November", netCents: 1500 },
];

export const PAPER_VAT_RATE = 21;

export const PRIVACY_FACTS: readonly string[] = [
    "Gmail access is read-only. FinSift never sends, moves or deletes an email.",
    "Invoice files are stored privately, and only you can download them.",
    "Deleting your account removes your invoices, documents and Gmail access with it.",
];
