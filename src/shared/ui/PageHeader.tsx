import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { canGoBack, previousPageName } from "@/shared/lib/history";
import { Icon } from "./Icon";
import type { BackLinkProps, PageHeaderProps } from "./types";
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
                {back && <BackLink to={back.to} label={back.label} />}
                <h1 className={styles.title}>{title}</h1>
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
    );
}

/**
 * Returns to the page the person came from and names the section it lands in. `to` and `label`
 * are the fallback for when there is no previous page in the app (a detail page opened directly
 * or in a new tab).
 */
function BackLink({ to, label }: BackLinkProps) {
    const navigate = useNavigate();
    // The history position changes with the location, so read it again on every navigation.
    useLocation();
    const text = canGoBack() ? (previousPageName() ?? "Back") : label;

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        const opensElsewhere =
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey;
        if (opensElsewhere || !canGoBack()) return;
        event.preventDefault();
        void navigate(-1);
    }

    return (
        <Link
            to={to}
            className={styles.back}
            viewTransition
            onClick={handleClick}
        >
            <Icon name="back" size={16} />
            {text}
        </Link>
    );
}
