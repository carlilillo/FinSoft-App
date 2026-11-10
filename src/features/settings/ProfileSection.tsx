import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Avatar } from "@/features/shell";
import { useSignedInUser } from "@/features/auth";
import { formText } from "@/shared/lib/forms";
import { Button } from "@/shared/ui";
import { photoProblem } from "./settings.model";
import { useProfileMutations } from "./useSettings";
import styles from "./SettingsPage.module.css";

export function ProfileSection() {
    const { user } = useSignedInUser();
    const { updateName, setPhoto } = useProfileMutations();
    const fileInput = useRef<HTMLInputElement>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        const problem = photoProblem(file);
        setPhotoError(problem);
        if (!problem) setPhoto.mutate(file);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        updateName.mutate({
            firstName: formText(form, "firstName"),
            lastName: formText(form, "lastName"),
        });
    };

    return (
        <section aria-labelledby="profile-title" className={styles.section}>
            <h2 id="profile-title" className={styles.sectionTitle}>
                Profile
            </h2>
            <div className={styles.photoRow}>
                <Avatar
                    name={user.fullName}
                    email={user.email}
                    imageUrl={user.imageUrl}
                    size={72}
                />
                <div className={styles.photoActions}>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhoto}
                    />
                    <Button
                        variant="secondary"
                        isBusy={setPhoto.isPending}
                        onClick={() => fileInput.current?.click()}
                    >
                        Change photo
                    </Button>
                    {user.imageUrl && (
                        <Button
                            variant="ghost"
                            onClick={() => setPhoto.mutate(null)}
                        >
                            Remove photo
                        </Button>
                    )}
                </div>
            </div>
            {(photoError ?? setPhoto.error) && (
                <p className={styles.error} role="alert">
                    {photoError ??
                        "The photo couldn't be updated. Try another image."}
                </p>
            )}
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    First name
                    <input
                        name="firstName"
                        defaultValue={user.firstName}
                        autoComplete="given-name"
                        required
                    />
                </label>
                <label className={styles.field}>
                    Last name
                    <input
                        name="lastName"
                        defaultValue={user.lastName}
                        autoComplete="family-name"
                    />
                </label>
                <div className={styles.formActions}>
                    <Button type="submit" isBusy={updateName.isPending}>
                        Save name
                    </Button>
                    {updateName.isSuccess && (
                        <span className={styles.saved}>Name saved</span>
                    )}
                    {updateName.isError && (
                        <span className={styles.error}>
                            The name couldn&apos;t be saved.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
