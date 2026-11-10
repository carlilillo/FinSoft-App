import type { DesignConfig, DesignId } from "./types";

export const DESIGNS: readonly DesignConfig[] = [
    {
        id: "ledger",
        name: "Ledger",
        idea: "Quiet accounting tool; orange marks state only",
        nav: "sidebar",
        motion: "calm",
    },
    {
        id: "signal",
        name: "Signal",
        idea: "Confident console with a solid orange column",
        nav: "sidebar",
        motion: "calm",
    },
    {
        id: "paper",
        name: "Paper Trail",
        idea: "Invoices read like the documents they are",
        nav: "topbar",
        motion: "calm",
    },
    {
        id: "apricot",
        name: "Apricot",
        idea: "Soft, friendly, generous spacing",
        nav: "pill",
        motion: "soft",
    },
    {
        id: "grid",
        name: "Grid",
        idea: "Swiss rigor; type does the work",
        nav: "topbar",
        motion: "calm",
    },
    {
        id: "flow",
        name: "Flow",
        idea: "One continuous surface that morphs as you move",
        nav: "pill",
        motion: "fluid",
    },
    {
        id: "tangerine",
        name: "Tangerine",
        idea: "Expressive and tactile; everything answers back",
        nav: "dock",
        motion: "expressive",
    },
];

export const DEFAULT_DESIGN: DesignId = "ledger";

const STORAGE_KEY = "finsift.design";

export function findDesign(id: string | null): DesignConfig {
    return (
        DESIGNS.find((design) => design.id === id) ??
        (DESIGNS[0] as DesignConfig)
    );
}

export function neighbourDesign(current: DesignId, step: 1 | -1): DesignId {
    const index = DESIGNS.findIndex((design) => design.id === current);
    const next = DESIGNS[
        (index + step + DESIGNS.length) % DESIGNS.length
    ] as DesignConfig;
    return next.id;
}

export function readStoredDesign(): DesignId {
    return findDesign(localStorage.getItem(STORAGE_KEY)).id;
}

export function storeDesign(id: DesignId): void {
    localStorage.setItem(STORAGE_KEY, id);
}

export function designPosition(id: DesignId): number {
    return DESIGNS.findIndex((design) => design.id === id) + 1;
}
