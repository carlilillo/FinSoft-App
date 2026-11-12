import { useState } from "react";
import { Dialog } from "@/shared/ui";
import { MAX_IMPORT_FILES } from "./analysis.model";
import { ImportSourceOptions } from "./ImportSourceOptions";
import { PhoneLinkStep } from "./PhoneImportPanel";
import type { ImportSourceDialogProps, ImportStep } from "./types";
import { useCreatePhoneUploadLink } from "./usePhoneImport";

const HEADINGS: Record<ImportStep, { title: string; description: string }> = {
    choose: {
        title: "Import invoices",
        description: `PDFs or photos, up to ${MAX_IMPORT_FILES} at once.`,
    },
    phone: {
        title: "Import from your phone",
        description: "No app or sign-in needed on your phone.",
    },
};

/** Asks where the invoices come from; for the phone it creates a single-use link shown as a QR code. */
export function ImportSourceDialog({
    isOpen,
    onClose,
    onFilesChosen,
}: ImportSourceDialogProps) {
    const [step, setStep] = useState<ImportStep>("choose");
    const phoneLink = useCreatePhoneUploadLink();

    const handleChoosePhone = () => {
        setStep("phone");
        phoneLink.mutate();
    };

    const handleBack = () => {
        setStep("choose");
        phoneLink.reset();
    };

    const handleClose = () => {
        handleBack();
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} {...HEADINGS[step]}>
            {step === "choose" ? (
                <ImportSourceOptions
                    onFilesChosen={onFilesChosen}
                    onChoosePhone={handleChoosePhone}
                />
            ) : (
                <PhoneLinkStep
                    link={phoneLink.data}
                    error={phoneLink.error}
                    onRenew={() => phoneLink.mutate()}
                    onBack={handleBack}
                />
            )}
        </Dialog>
    );
}
