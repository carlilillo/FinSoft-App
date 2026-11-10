import { Link } from "react-router";
import { Icon } from "./Icon";
import type { PageHeaderProps } from "./types";
import styles from "./PageHeader.module.css";

export function PageHeader({
    title,
    description,
    actions,
    back,
}: PageHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.text}>
                {back && (
                    <Link
                        to={back.to}
                        className={styles.back}
                        viewTransition={back.viewTransition ?? false}
                    >
                        <Icon name="back" size={16} />
                        {back.label}
                    </Link>
                )}
                <h1 className={styles.title}>{title}</h1>
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
    );
}
