import type { MouseEvent } from "react";
import type { SectionLinkProps } from "./types";

/**
 * Link to a section of the home page. The browser's own fragment navigation fires `popstate`, which
 * React Router treats as a navigation and re-renders the whole page for; scrolling here and only
 * rewriting the hash keeps the page, and its header, untouched while it glides to the section.
 */
export function SectionLink({
    sectionId,
    className,
    children,
}: SectionLinkProps) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const target = document.getElementById(sectionId);
        if (!target || event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
        window.history.replaceState(window.history.state, "", `#${sectionId}`);
    };
    return (
        <a href={`#${sectionId}`} className={className} onClick={handleClick}>
            {children}
        </a>
    );
}
