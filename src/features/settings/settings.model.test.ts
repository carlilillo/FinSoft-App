import { describe, expect, it } from "vitest";
import { isDeleteConfirmed, photoProblem } from "./settings.model";

describe("settings rules", () => {
    it("requires the exact confirmation phrase to delete the account", () => {
        expect(isDeleteConfirmed(" Delete my account ")).toBe(true);
        expect(isDeleteConfirmed("delete")).toBe(false);
    });

    it("accepts reasonable images only", () => {
        expect(
            photoProblem(new File(["x"], "a.png", { type: "image/png" })),
        ).toBeNull();
        expect(
            photoProblem(new File(["x"], "a.pdf", { type: "application/pdf" })),
        ).toMatch(/image/);
    });
});
