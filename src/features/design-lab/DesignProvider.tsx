import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { DesignContext } from "./DesignContext";
import { findDesign, readStoredDesign, storeDesign } from "./designs";
import type { DesignId, DesignProviderProps } from "./types";
import "./designs.css";

/** Holds the design being reviewed and mirrors it onto <html data-design>, where the token sheets apply. */
export function DesignProvider({ children }: DesignProviderProps) {
    const [designId, setDesignId] = useState<DesignId>(readStoredDesign);

    useLayoutEffect(() => {
        document.documentElement.dataset.design = designId;
    }, [designId]);

    const selectDesign = (id: DesignId) => {
        storeDesign(id);
        if (!document.startViewTransition) {
            setDesignId(id);
            return;
        }
        document.startViewTransition(() => flushSync(() => setDesignId(id)));
    };

    return (
        <DesignContext value={{ design: findDesign(designId), selectDesign }}>
            {children}
        </DesignContext>
    );
}
