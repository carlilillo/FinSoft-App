import type { NavDirection, NavItem } from "./types";

export const NAV_ITEMS: readonly NavItem[] = [
    { to: "/", label: "Overview", icon: "overview", end: true },
    { to: "/invoices", label: "Invoices", icon: "invoices" },
    { to: "/products", label: "Products", icon: "products" },
    { to: "/analyze", label: "Analyze", icon: "analyze" },
    { to: "/settings", label: "Settings", icon: "settings" },
];

/** Index of the nav section a path belongs to (detail pages belong to their list). */
export function sectionIndex(pathname: string): number {
    const index = NAV_ITEMS.findIndex(
        (item) => item.to !== "/" && pathname.startsWith(item.to),
    );
    if (pathname.startsWith("/analyses")) return 3;
    return index === -1 ? 0 : index;
}

export function navDirection(fromPath: string, toPath: string): NavDirection {
    const from = sectionIndex(fromPath);
    const to = sectionIndex(toPath);
    if (from !== to) return to > from ? "forward" : "back";
    return toPath.length >= fromPath.length ? "forward" : "back";
}

/** The Flow design slides pages left or right; CSS reads this attribute during the view transition. */
export function markNavDirection(direction: NavDirection): void {
    document.documentElement.dataset.navDirection = direction;
}
