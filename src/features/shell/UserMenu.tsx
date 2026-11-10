import { useSignedInUser } from "@/features/auth";
import { Icon } from "@/shared/ui";
import { Avatar } from "./Avatar";
import styles from "./UserMenu.module.css";

export function UserMenu() {
    const { user, actions } = useSignedInUser();
    return (
        <div className={styles.menu}>
            <Avatar
                name={user.fullName}
                email={user.email}
                imageUrl={user.imageUrl}
            />
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
