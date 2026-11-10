import { describe, expect, it } from "vitest";
import { describeDevice, initials, returnPath } from "./auth.model";

describe("auth model", () => {
    it("builds initials from the name, falling back to the email", () => {
        expect(initials({ fullName: "Lucía Moreno", email: null })).toBe("LM");
        expect(initials({ fullName: "", email: "x@y.com" })).toBe("X");
    });

    it("returns to the protected page that asked for sign-in", () => {
        expect(returnPath({ from: "/invoices" })).toBe("/invoices");
        expect(returnPath({ from: "/" })).toBe("/overview");
        expect(returnPath({ from: "https://evil.example" })).toBe("/overview");
        expect(returnPath({ from: "//evil.example" })).toBe("/overview");
        expect(returnPath(null)).toBe("/overview");
    });

    it("describes devices", () => {
        expect(describeDevice("Chrome", undefined, false)).toBe(
            "Chrome on Computer",
        );
    });
});
