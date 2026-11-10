import { describe, expect, it } from "vitest";
import { describeDevice, initials } from "./auth.model";

describe("auth model", () => {
    it("builds initials from the name, falling back to the email", () => {
        expect(initials({ fullName: "Lucía Moreno", email: null })).toBe("LM");
        expect(initials({ fullName: "", email: "x@y.com" })).toBe("X");
    });

    it("describes devices", () => {
        expect(describeDevice("Chrome", undefined, false)).toBe(
            "Chrome on Computer",
        );
    });
});
