import { useState } from "react";
import { Dialog } from "@/shared/ui";
import { IMPORT_COPY } from "./analysis.model";
import { ComputerImportStep } from "./ComputerImportStep";
import { ImportSourceOptions } from "./ImportSourceOptions";
import { PhoneLinkStep } from "./PhoneImportPanel";
import type { ImportSourceDialogProps, ImportStep } from "./types";
import { useCreatePhoneUploadLink } from "./usePhoneImport";

/**
 * Asks where the invoices come from: this computer shows a tray to drop or pick files; the phone
 * gets a single-use link shown as a QR code. The steps are the same for the person's own invoices
 * and for provider invoices; only the words change.
 */
export function ImportSourceDialog({
    isOpen,
    direction,
    onClose,
    onFilesChosen,
}: ImportSourceDialogProps) {
    const [step, setStep] = useState<ImportStep>("choose");
    const phoneLink = useCreatePhoneUploadLink();

    const handleChoosePhone = () => {
        setStep("phone");
        phoneLink.mutate(direction);
    };

    const handleBack = () => {
        setStep("choose");
        phoneLink.reset();
    };

    const handleClose = () => {
        handleBack();
        onClose();
    };

    const handleFilesChosen = (files: File[]) => {
        handleBack();
        onFilesChosen(files);
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            {...IMPORT_COPY[direction].headings[step]}
        >
            {step === "choose" && (
                <ImportSourceOptions
                    onChooseComputer={() => setStep("computer")}
                    onChoosePhone={handleChoosePhone}
                />
            )}
            {step === "computer" && (
                <ComputerImportStep
                    direction={direction}
                    onFilesChosen={handleFilesChosen}
                    onBack={handleBack}
                />
            )}
            {step === "phone" && (
                <PhoneLinkStep
                    direction={direction}
                    link={phoneLink.data}
                    error={phoneLink.error}
                    onRenew={() => phoneLink.mutate(direction)}
                    onBack={handleBack}
                />
            )}
        </Dialog>
    );
}
