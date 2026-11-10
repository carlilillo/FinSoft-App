import { initials } from "@/features/auth";
import type { AvatarProps } from "./types";
import styles from "./Avatar.module.css";

export function Avatar({ name, email, imageUrl, size = 32 }: AvatarProps) {
    if (imageUrl) {
        return (
            <img
                className={styles.avatar}
                src={imageUrl}
                alt=""
                width={size}
                height={size}
            />
        );
    }
    return (
        <span
            className={styles.avatar}
            style={{ width: size, height: size, fontSize: size * 0.38 }}
            aria-hidden="true"
        >
            {initials({ fullName: name, email })}
        </span>
    );
}
