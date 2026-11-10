import { displayName, useSignedInUser } from "@/features/auth";
import { Icon } from "@/shared/ui";
import { Avatar } from "./Avatar";
import type { UserMenuProps } from "./types";
import styles from "./UserMenu.module.css";

export function UserMenu({ isCompact = false }: UserMenuProps) {
    const { user, actions } = useSignedInUser();
    return (
        <div className={styles.menu}>
            <Avatar
                name={user.fullName}
                email={user.email}
                imageUrl={user.imageUrl}
            />
            {!isCompact && (
                <span className={styles.identity}>
                    <span className={styles.name}>{displayName(user)}</span>
                    {user.email && (
                        <span className={styles.email}>{user.email}</span>
                    )}
                </span>
            )}
            <button
                type="button"
                className={styles.signOut}
                onClick={() => void actions.signOut()}
                aria-label="Sign out"
            >
                <Icon name="logout" />
            </button>
        </div>
    );
}
