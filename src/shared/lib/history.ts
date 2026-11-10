import type { RouterSubscriber } from "react-router";

/**
 * Position of the current entry in this tab's in-app history; React Router keeps it in
 * `history.state.idx`. 0 means the app was opened on this page, so there is nothing to go back to.
 */
export function historyIndex(): number | null {
    const state: unknown = window.history.state;
    if (typeof state !== "object" || state === null || !("idx" in state))
        return null;
    return typeof state.idx === "number" ? state.idx : null;
}

/** True when the previous history entry is a page of this app. */
export function canGoBack(): boolean {
    return (historyIndex() ?? 0) > 0;
}

const TRAIL_KEY = "finsift.history-trail";

type Trail = Record<number, string | null>;

function readTrail(): Trail {
    try {
        return JSON.parse(sessionStorage.getItem(TRAIL_KEY) ?? "{}") as Trail;
    } catch {
        return {};
    }
}

/**
 * Remembers the name of the page at every history position, so a back link can say where it
 * lands. Kept in sessionStorage because, like the history itself, it must survive a reload.
 * `nameOf` returns null for pages that have no name worth showing.
 */
export function trackPageNames(
    router: {
        subscribe: (subscriber: RouterSubscriber) => () => void;
        state: { location: { pathname: string } };
    },
    nameOf: (pathname: string) => string | null,
): () => void {
    function remember(pathname: string) {
        const index = historyIndex();
        if (index === null) return;
        const trail = readTrail();
        trail[index] = nameOf(pathname);
        sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail));
    }
    remember(router.state.location.pathname);
    return router.subscribe((state) => remember(state.location.pathname));
}

/** Name of the page the browser's back button leads to, when it is a named page of this app. */
export function previousPageName(): string | null {
    const index = historyIndex();
    if (index === null || index === 0) return null;
    return readTrail()[index - 1] ?? null;
}
