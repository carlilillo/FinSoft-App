import type { CommandItem } from "./types";

export const COMMANDS: readonly CommandItem[] = [
    {
        id: "overview",
        label: "Overview",
        hint: "Spending at a glance",
        to: "/",
    },
    {
        id: "invoices",
        label: "Invoices",
        hint: "Every extracted invoice",
        to: "/invoices",
    },
    {
        id: "products",
        label: "Products",
        hint: "Price history per product",
        to: "/products",
    },
    {
        id: "analyze",
        label: "Analyze last week's emails",
        hint: "Find new invoices in Gmail",
        to: "/analyze",
    },
    {
        id: "settings",
        label: "Settings",
        hint: "Profile, Gmail and account",
        to: "/settings",
    },
];

export function filterCommands(query: string): CommandItem[] {
    const needle = query.trim().toLowerCase();
    if (!needle) return [...COMMANDS];
    return COMMANDS.filter((command) =>
        `${command.label} ${command.hint}`.toLowerCase().includes(needle),
    );
}
