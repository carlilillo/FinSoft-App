import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

describe("SegmentedControl", () => {
    it("exposes a radio group and reports the chosen value", async () => {
        const onChange = vi.fn();
        render(
            <SegmentedControl
                label="Period"
                value="7d"
                onChange={onChange}
                options={[
                    { value: "7d", label: "Last week" },
                    { value: "30d", label: "Last month" },
                ]}
            />,
        );
        expect(screen.getByRole("radio", { name: "Last week" })).toBeChecked();
        await userEvent.click(
            screen.getByRole("radio", { name: "Last month" }),
        );
        expect(onChange).toHaveBeenCalledWith("30d");
    });
});
