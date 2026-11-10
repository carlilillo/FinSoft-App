import type { ProviderButtonProps, SsoProvider } from "./types";
import styles from "./SignInPage.module.css";

const LOGOS: Record<SsoProvider, string> = {
    google: "M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3zM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22zM6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9zM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z",
    apple: "M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9a4.8 4.8 0 0 0-3.8-2c-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9a5 5 0 0 0-4.2 2.6c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6s1.8-.8 3.3-.8 2 .8 3.4.8 2.2-1.3 3-2.5a10 10 0 0 0 1.4-2.8 4.3 4.3 0 0 1-2.5-4.2zM13.9 5a4.4 4.4 0 0 0 1-3.2 4.6 4.6 0 0 0-3 1.5 4.2 4.2 0 0 0-1 3.1A3.8 3.8 0 0 0 13.9 5z",
    github: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z",
};

export function ProviderButton({
    provider,
    isBusy,
    onSelect,
}: ProviderButtonProps) {
    return (
        <button
            type="button"
            className={styles.provider}
            onClick={() => onSelect(provider.id)}
            disabled={isBusy}
            aria-busy={isBusy}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d={LOGOS[provider.id]} fill="currentColor" />
            </svg>
            {provider.label}
        </button>
    );
}
