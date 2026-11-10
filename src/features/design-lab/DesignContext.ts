import { createContext, useContext } from "react";
import type { DesignContextValue } from "./types";

export const DesignContext = createContext<DesignContextValue | null>(null);

export function useDesign(): DesignContextValue {
    const value = useContext(DesignContext);
    if (!value)
        throw new Error("useDesign must be used inside <DesignProvider>");
    return value;
}
