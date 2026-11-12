import { Button, Icon } from "@/shared/ui";
import type { BackButtonProps } from "./types";
import styles from "./BackButton.module.css";

/** Returns from a source step (computer or phone) to the choice of source. */
export function BackButton({ onBack }: BackButtonProps) {
    return (
        <Button variant="ghost" className={styles.back} onClick={onBack}>
            <Icon name="back" size={16} />
            Back
        </Button>
    );
}
