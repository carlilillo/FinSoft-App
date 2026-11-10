import { useState } from "react";
import { Button, PageHeader } from "@/shared/ui";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { GmailSection } from "./GmailSection";
import { ProfileSection } from "./ProfileSection";
import { SessionsSection } from "./SessionsSection";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    return (
        <>
            <PageHeader title="Settings" />
            <div className={styles.sections}>
                <ProfileSection />
                <GmailSection />
                <SessionsSection />
                <section
                    aria-labelledby="danger-title"
                    className={styles.section}
                >
                    <h2 id="danger-title" className={styles.sectionTitle}>
                        Delete account
                    </h2>
                    <div className={styles.inline}>
                        <p>
                            Remove your account and everything FinSift has
                            stored for you.
                        </p>
                        <Button
                            variant="danger"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            Delete account
                        </Button>
                    </div>
                </section>
            </div>
            <DeleteAccountDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
            />
        </>
    );
}
