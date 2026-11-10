import { useSignUp } from "@clerk/react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { formText } from "@/shared/lib/forms";
import { Button } from "@/shared/ui";
import styles from "./SignInPage.module.css";

/** Only shown when a provider didn't share everything Clerk requires (e.g. Apple hiding the name). */
export function ContinueSignUpPage() {
    const { signUp } = useSignUp();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setIsSaving(true);
        setError(null);
        const update = await signUp.update({
            firstName: formText(form, "firstName"),
            lastName: formText(form, "lastName"),
        });
        const finalize = update.error
            ? update
            : await signUp.finalize({ navigate: () => void navigate("/") });
        if (finalize.error) {
            setError(
                "We couldn't finish creating your account. Check the fields and try again.",
            );
            setIsSaving(false);
        }
    };

    return (
        <main className={styles.page}>
            <form
                className={styles.panel}
                onSubmit={(event) => void handleSubmit(event)}
            >
                <h1 className={styles.title}>One more step</h1>
                <p className={styles.lead}>
                    Tell us your name to finish creating your account.
                </p>
                <label className={styles.field}>
                    First name
                    <input
                        name="firstName"
                        autoComplete="given-name"
                        required
                    />
                </label>
                <label className={styles.field}>
                    Last name
                    <input name="lastName" autoComplete="family-name" />
                </label>
                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}
                <Button type="submit" isBusy={isSaving}>
                    Create account
                </Button>
            </form>
        </main>
    );
}
