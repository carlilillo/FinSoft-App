import { describe, expect, it } from "vitest";
import { DESIGNS, findDesign, neighbourDesign } from "./designs";

describe("design lab", () => {
    it("offers seven directions and cycles through them", () => {
        expect(DESIGNS).toHaveLength(7);
        expect(neighbourDesign("tangerine", 1)).toBe("ledger");
        expect(neighbourDesign("ledger", -1)).toBe("tangerine");
    });

    it("falls back to the first design for unknown ids", () => {
        expect(findDesign("nope").id).toBe("ledger");
    });
});
