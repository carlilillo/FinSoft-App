import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/lib/http";
import {
    addPicked,
    isLinkGone,
    linkProblem,
    remainingSlots,
    removePicked,
    sendLabel,
} from "./phone-upload.model";
import type { PickedFile, PickResult } from "./types";

let fileCount = 0;
function makeFile(name: string, type: string, size = 1_000): File {
    fileCount += 1;
    const file = new File(["x"], name, { type, lastModified: fileCount });
    Object.defineProperty(file, "size", { value: size });
    return file;
}
const pdf = (name = "invoice.pdf") => makeFile(name, "application/pdf");
const photo = (name = "photo.jpg") => makeFile(name, "image/jpeg");

function added(result: PickResult): PickedFile[] {
    if (result.kind !== "added") throw new Error(result.message);
    return result.picked;
}

function attach(count: number): PickedFile[] {
    return added(
        addPicked(
            [],
            Array.from({ length: count }, (_, index) => photo(`p${index}.jpg`)),
            "photo",
        ),
    );
}

describe("addPicked", () => {
    it("mixes documents and photos, several at once", () => {
        const withDocuments = added(addPicked([], [pdf(), pdf()], "document"));
        const both = added(
            addPicked(withDocuments, [photo(), photo()], "photo"),
        );
        expect(both.map((item) => item.kind)).toEqual([
            "document",
            "document",
            "photo",
            "photo",
        ]);
        expect(remainingSlots(both)).toBe(6);
    });

    it("accepts a pick that exactly fills the remaining slots", () => {
        const picked = added(
            addPicked(attach(7), [pdf(), pdf(), pdf()], "document"),
        );
        expect(picked).toHaveLength(10);
        expect(remainingSlots(picked)).toBe(0);
    });

    it("refuses a pick larger than the slots left, as a whole", () => {
        const result = addPicked(
            attach(8),
            [photo(), photo(), photo()],
            "photo",
        );
        expect(result).toEqual({
            kind: "rejected",
            message:
                "You picked 3 files but only 2 more fit (10 at most). Pick up to 2.",
        });
    });

    it("refuses any pick once 10 files are attached", () => {
        const result = addPicked(attach(10), [pdf()], "document");
        expect(result.kind).toBe("rejected");
    });

    it("only takes PDFs from the documents picker", () => {
        const result = addPicked([], [pdf(), photo("scan.png")], "document");
        expect(result).toEqual({
            kind: "rejected",
            message: "scan.png is not a PDF. Attach images with “Photos”.",
        });
    });

    it("only takes images from the photos picker, trusting the extension when the type is missing", () => {
        expect(addPicked([], [pdf()], "photo").kind).toBe("rejected");
        expect(
            added(addPicked([], [makeFile("IMG_0001.HEIC", "")], "photo")),
        ).toHaveLength(1);
    });

    it("refuses empty files and files over 20 MB", () => {
        expect(
            addPicked([], [makeFile("a.pdf", "application/pdf", 0)], "document")
                .kind,
        ).toBe("rejected");
        expect(
            addPicked(
                [],
                [makeFile("b.pdf", "application/pdf", 21 * 1024 * 1024)],
                "document",
            ).kind,
        ).toBe("rejected");
    });

    it("keeps a file attached twice only once", () => {
        const file = pdf();
        const once = added(addPicked([], [file, file], "document"));
        expect(once).toHaveLength(1);
        expect(addPicked(once, [file], "document")).toEqual({
            kind: "rejected",
            message: "That file is already attached.",
        });
    });
});

describe("removePicked", () => {
    it("frees the slot of the removed file", () => {
        const picked = attach(10);
        const [first] = picked;
        const after = removePicked(picked, first?.id ?? "");
        expect(after).toHaveLength(9);
        expect(remainingSlots(after)).toBe(1);
    });
});

describe("sendLabel", () => {
    it("counts the invoices to send", () => {
        expect(sendLabel(0)).toBe("Attach invoices to send");
        expect(sendLabel(1)).toBe("Send 1 invoice");
        expect(sendLabel(4)).toBe("Send 4 invoices");
    });
});

describe("linkProblem", () => {
    it("tells expired, used and unknown links apart", () => {
        expect(
            linkProblem(new ApiError(410, "", "PHONE_UPLOAD_LINK_EXPIRED")),
        ).toBe("expired");
        expect(
            linkProblem(new ApiError(410, "", "PHONE_UPLOAD_LINK_USED")),
        ).toBe("used");
        expect(linkProblem(new ApiError(404, "", null))).toBe("invalid");
        expect(linkProblem(new TypeError("Failed to fetch"))).toBe(
            "unreachable",
        );
    });

    it("keeps the form when a send is refused for a reason the person can fix", () => {
        expect(isLinkGone(new ApiError(409, "", "RUN_LIMIT_REACHED"))).toBe(
            false,
        );
        expect(
            isLinkGone(new ApiError(415, "", "IMPORT_FILE_UNSUPPORTED")),
        ).toBe(false);
        expect(
            isLinkGone(new ApiError(410, "", "PHONE_UPLOAD_LINK_USED")),
        ).toBe(true);
    });
});
