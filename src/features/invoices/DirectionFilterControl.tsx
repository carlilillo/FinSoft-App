import { SegmentedControl } from "@/shared/ui";
import { DIRECTION_FILTERS } from "./invoices.model";
import type { DirectionFilterControlProps } from "./types";

/** All invoices, the ones the person issued, or the ones providers sent them: the same choice on every page. */
export function DirectionFilterControl({
    value,
    onChange,
}: DirectionFilterControlProps) {
    return (
        <SegmentedControl
            label="Invoices to show"
            options={DIRECTION_FILTERS}
            value={value}
            onChange={onChange}
        />
    );
}
