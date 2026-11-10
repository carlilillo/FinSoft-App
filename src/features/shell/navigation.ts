import { NavigationType, type RouterSubscriber } from "react-router";
import type { NavDirection, NavItem } from "./types";

export const NAV_ITEMS: readonly NavItem[] = [
    { to: "/overview", label: "Overview", icon: "overview" },
    { to: "/invoices", label: "Invoices", icon: "invoices" },
    { to: "/products", label: "Products", icon: "products" },
    { to: "/analyze", label: "Analyze", icon: "analyze" },
    { to: "/settings", label: "Settings", icon: "settings" },
];

const ANALYZE_SECTION = 3;

/** Index of the nav section a path belongs to (detail pages belong to their list). */
export function sectionIndex(pathname: string): number {
    if (pathname.startsWith("/analyses")) return ANALYZE_SECTION;
    const index = NAV_ITEMS.findIndex((item) => pathname.startsWith(item.to));
    return index === -1 ? 0 : index;
}

function depth(pathname: string): number {
    return pathname.split("/").filter(Boolean).length;
}

/**
 * Which way a link moves: deeper pages (a list row's detail) go forward, shallower ones (a back link)
 * go back, and sections at the same depth follow their order in the nav.
 */
export function navDirection(fromPath: string, toPath: string): NavDirection {
    const fromDepth = depth(fromPath);
    const toDepth = depth(toPath);
    if (toDepth !== fromDepth) return toDepth > fromDepth ? "forward" : "back";
    if (toDepth > 1) return "forward";
    return sectionIndex(toPath) >= sectionIndex(fromPath) ? "forward" : "back";
}

/** Browser back/forward: React Router keeps the history position in `history.state.idx`. */
function historyIndex(): number | null {
    const state: unknown = window.history.state;
    if (typeof state !== "object" || state === null || !("idx" in state))
        return null;
    return typeof state.idx === "number" ? state.idx : null;
}

/**
 * Marks every navigation's direction on <html data-nav-direction>; the page slide
 * reads it during the view transition. Covers links, back links and the browser's own buttons.
 */
export function trackNavDirection(router: {
    subscribe: (subscriber: RouterSubscriber) => () => void;
    state: { location: { pathname: string } };
}): () => void {
    let lastPath = router.state.location.pathname;
    let lastIndex = historyIndex();
    return router.subscribe((state) => {
        const path = state.location.pathname;
        const index = historyIndex();
        if (path === lastPath) {
            lastIndex = index;
            return;
        }
        const direction =
            state.historyAction === NavigationType.Pop &&
            index !== null &&
            lastIndex !== null
                ? index < lastIndex
                    ? "back"
                    : "forward"
                : navDirection(lastPath, path);
        document.documentElement.dataset.navDirection = direction;
        lastPath = path;
        lastIndex = index;
    });
}
