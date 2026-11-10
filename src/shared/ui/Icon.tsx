import type { IconName, IconProps } from "./types";

const PATHS: Record<IconName, string> = {
    overview: "M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z",
    invoices: "M6 2h9l5 5v15H6zM14 2v6h6M9 12h7M9 16h7",
    products: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10",
    analyze: "M4 5h16v14H4zM4 6l8 6 8-6",
    settings:
        "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4",
    download: "M12 3v12M7 10l5 5 5-5M4 20h16",
    upload: "M12 21V9M7 14l5-5 5 5M4 4h16",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
    mail: "M3 5h18v14H3zM3 6l9 7 9-7",
    check: "M5 12l5 5 9-10",
    back: "M15 5l-7 7 7 7",
    logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
    command:
        "M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z",
};

export function Icon({ name, size = 18 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={PATHS[name]} />
        </svg>
    );
}
