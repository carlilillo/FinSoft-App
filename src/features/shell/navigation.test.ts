import { describe, expect, it } from "vitest";
import { navDirection, sectionIndex } from "./navigation";

describe("sectionIndex", () => {
    it("puts detail pages in their list's section", () => {
        expect(sectionIndex("/invoices/01J")).toBe(1);
        expect(sectionIndex("/products/01J")).toBe(2);
    });

    it("puts analysis runs under Analyze", () => {
        expect(sectionIndex("/analyses/01J")).toBe(3);
        expect(sectionIndex("/analyze")).toBe(3);
    });
});

describe("navDirection", () => {
    it("goes forward into a detail page and back out of it", () => {
        expect(navDirection("/invoices", "/invoices/01J")).toBe("forward");
        expect(navDirection("/invoices/01J", "/invoices")).toBe("back");
        expect(navDirection("/analyze", "/analyses/01J")).toBe("forward");
        expect(navDirection("/analyses/01J", "/analyze")).toBe("back");
    });

    it("follows the nav order between sections", () => {
        expect(navDirection("/overview", "/products")).toBe("forward");
        expect(navDirection("/settings", "/invoices")).toBe("back");
    });

    it("treats a jump from one detail page to another as forward", () => {
        expect(navDirection("/analyses/01J", "/invoices/01K")).toBe("forward");
    });

    it("treats the home page as the start of the track", () => {
        expect(navDirection("/", "/overview")).toBe("forward");
        expect(navDirection("/overview", "/")).toBe("back");
    });
});
