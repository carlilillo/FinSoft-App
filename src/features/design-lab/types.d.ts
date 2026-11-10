import type { ReactNode } from "react";

export type DesignId =
    "ledger" | "signal" | "paper" | "apricot" | "grid" | "flow" | "tangerine";

/** Where the main navigation lives. */
export type NavVariant = "sidebar" | "topbar" | "pill" | "dock";

/** How much the interface moves: calm < soft < fluid < expressive. */
export type MotionProfile = "calm" | "soft" | "fluid" | "expressive";

export type DesignConfig = {
    id: DesignId;
    name: string;
    idea: string;
    nav: NavVariant;
    motion: MotionProfile;
};

export type DesignContextValue = {
    design: DesignConfig;
    selectDesign: (id: DesignId) => void;
};

export type DesignProviderProps = { children: ReactNode };
