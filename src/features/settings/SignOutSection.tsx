import { Button } from "@/shared/ui";
import { useSignOut } from "./useSettings";
import styles from "./SettingsPage.module.css";

export function SignOutSection() {
    const signOut = useSignOut();
    return (
        <section aria-labelledby="sign-out-title" className={styles.section}>
            <h2 id="sign-out-title" className={styles.sectionTitle}>
                Log out
            </h2>
            <div className={styles.inline}>
                <p>End your session on this device.</p>
                <Button
                    variant="secondary"
                    onClick={() => signOut.mutate()}
                    isBusy={signOut.isPending}
                >
                    Log out
                </Button>
            </div>
            {signOut.isError && (
                <p role="alert" className={styles.error}>
                    Couldn't log you out. Please try again.
                </p>
            )}
        </section>
    );
}
