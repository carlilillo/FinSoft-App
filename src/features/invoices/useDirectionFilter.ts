import { useSearchParams } from "react-router";
import { parseDirectionFilter } from "./invoices.model";
import type { DirectionFilter } from "./types";

const PARAM = "direction";

/**
 * The direction filter lives in the URL (`?direction=issued`), so it survives opening an invoice or a product and
 * coming back. The page's default is left out of the URL.
 */
export function useDirectionFilter(defaultFilter: DirectionFilter = "all") {
    const [params, setParams] = useSearchParams();
    const filter = parseDirectionFilter(params.get(PARAM), defaultFilter);

    const setFilter = (next: DirectionFilter) => {
        setParams(
            (current) => {
                const updated = new URLSearchParams(current);
                if (next === defaultFilter) updated.delete(PARAM);
                else updated.set(PARAM, next);
                return updated;
            },
            { replace: true },
        );
    };

    return [filter, setFilter] as const;
}
