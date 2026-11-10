import { describe, expect, it } from "vitest";
import {
    connectionErrorMessage,
    describeStage,
    initialSelection,
    isRunActive,
    selectionChanged,
    sortEmailsForReview,
    toggleSelection,
} from "./analysis.model";
import type { EvaluatedEmail, RunDetail } from "./types";

const run = (overrides: Partial<RunDetail>): RunDetail => ({
    id: "R",
    status: "extracting",
    stageDetail: null,
    error: null,
    invocationCount: 1,
    createdAt: "2026-11-09T10:00:00Z",
    finishedAt: null,
    progress: { emailsTotal: 20, emailsReviewed: 10, invoicesFound: 3 },
    session: null,
    ...overrides,
});

const email = (
    id: string,
    verdict: EvaluatedEmail["verdict"],
    receivedAt = "2026-11-08T10:00:00Z",
): EvaluatedEmail => ({
    id,
    subject: id,
    senderName: null,
    senderEmail: `${id}@example.com`,
    receivedAt,
    attachmentCount: 0,
    verdict,
    reason: null,
    invoiceIds: [],
});

describe("run progress", () => {
    it("treats pending, ingesting and extracting as active", () => {
        expect(isRunActive("ingesting")).toBe(true);
        expect(isRunActive("awaiting_review")).toBe(false);
    });

    it("describes the stage in the person's terms with a monotonic percentage", () => {
        expect(describeStage(run({ status: "pending" })).title).toBe(
            "Getting ready",
        );
        const halfway = describeStage(run({}));
        expect(halfway).toEqual({
            title: "Reviewing 20 emails",
            detail: "10 of 20 reviewed · 3 invoices found",
            percent: 55,
        });
        const done = describeStage(
            run({
                progress: {
                    emailsTotal: 20,
                    emailsReviewed: 20,
                    invoicesFound: 1,
                },
            }),
        );
        expect(done.title).toBe("Extracting invoices");
        expect(done.detail).toContain("1 invoice found");
        expect(done.percent).toBeLessThan(100);
    });
});

describe("email review", () => {
    const emails = [
        email("news", "not_invoice"),
        email("inv", "extracted"),
        email("maybe", "likely_invoice"),
    ];

    it("lists invoices first and pre-selects what was extracted", () => {
        expect(sortEmailsForReview(emails).map((item) => item.id)).toEqual([
            "inv",
            "maybe",
            "news",
        ]);
        expect([...initialSelection(emails)]).toEqual(["inv"]);
    });

    it("detects when the person changed the selection", () => {
        const initial = initialSelection(emails);
        expect(selectionChanged(emails, initial)).toBe(false);
        expect(
            selectionChanged(emails, toggleSelection(initial, "maybe")),
        ).toBe(true);
    });

    it("explains Gmail connection errors", () => {
        expect(connectionErrorMessage("access_denied")).toMatch(/read access/);
        expect(connectionErrorMessage("weird")).toMatch(/Try again/);
        expect(connectionErrorMessage(null)).toBeNull();
    });
});
