import type { IconName, IconProps } from "./types";

const PATHS: Record<IconName, string> = {
    overview: "M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z",
    invoices: "M6 2h9l5 5v15H6zM14 2v6h6M9 12h7M9 16h7",
    products: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10",
    analyze: "M4 5h16v14H4zM4 6l8 6 8-6",
    // An eight-tooth gear around an axle hole.
    settings:
        "M10.23 4.61L10.51 2.11L13.49 2.11L13.77 4.61A7.6 7.6 0 0 1 15.97 5.52L17.94 3.96L20.04 6.06L18.48 8.03A7.6 7.6 0 0 1 19.39 10.23L21.89 10.51L21.89 13.49L19.39 13.77A7.6 7.6 0 0 1 18.48 15.97L20.04 17.94L17.94 20.04L15.97 18.48A7.6 7.6 0 0 1 13.77 19.39L13.49 21.89L10.51 21.89L10.23 19.39A7.6 7.6 0 0 1 8.03 18.48L6.06 20.04L3.96 17.94L5.52 15.97A7.6 7.6 0 0 1 4.61 13.77L2.11 13.49L2.11 10.51L4.61 10.23A7.6 7.6 0 0 1 5.52 8.03L3.96 6.06L6.06 3.96L8.03 5.52A7.6 7.6 0 0 1 10.23 4.61zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    download: "M12 3v12M7 10l5 5 5-5M4 20h16",
    upload: "M12 21V9M7 14l5-5 5 5M4 4h16",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
    mail: "M3 5h18v14H3zM3 6l9 7 9-7",
    check: "M5 12l5 5 9-10",
    back: "M15 5l-7 7 7 7",
    logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
    phone: "M7 2h10v20H7zM11 18h2",
    laptop: "M5 5h14v10H5zM2 19h20",
    image: "M3 5h18v14H3zM3 17l5-5 4 4 3-3 6 6M15 9h.01",
    document: "M6 2h9l5 5v15H6zM14 2v6h6",
    close: "M6 6l12 12M18 6L6 18",
    chevron: "M9 5l7 7-7 7",
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
