import { useState } from "react";
import { Navigate } from "react-router";
import { useAccount } from "./AccountContext";
import { SSO_PROVIDERS } from "./auth.model";
import { ProviderButton } from "./ProviderButton";
import type { SsoProvider } from "./types";
import styles from "./SignInPage.module.css";

export function SignInPage() {
    const account = useAccount();
    const [pending, setPending] = useState<SsoProvider | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (account.status === "signed-in") return <Navigate to="/" replace />;

    const handleSelect = async (provider: SsoProvider) => {
        setPending(provider);
        setError(null);
        try {
            await account.actions.signIn(provider);
        } catch {
            setError(
                "We couldn't start the sign-in. Try again or use another provider.",
            );
            setPending(null);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.panel} aria-labelledby="sign-in-title">
                <p className={styles.brand}>FinSift</p>
                <h1 id="sign-in-title" className={styles.title}>
                    Every invoice in your inbox, sorted.
                </h1>
                <p className={styles.lead}>
                    Sign in, connect Gmail, and FinSift reads last week&apos;s
                    emails to pull out each invoice, its products and their
                    prices.
                </p>
                <div className={styles.providers}>
                    {SSO_PROVIDERS.map((provider) => (
                        <ProviderButton
                            key={provider.id}
                            provider={provider}
                            isBusy={pending === provider.id}
                            onSelect={(id) => void handleSelect(id)}
                        />
                    ))}
                </div>
                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}
                <p className={styles.fineprint}>
                    New here? Choosing a provider creates your account.
                </p>
            </section>
            <figure className={styles.sample} aria-hidden="true">
                <div className={styles.receipt}>
                    <span>Papelería Martínez</span>
                    <span className="numeric">106,00 €</span>
                    <span>Iberdrola · Factura</span>
                    <span className="numeric">84,12 €</span>
                    <span>Brew &amp; Bean receipt</span>
                    <span className="numeric">£12.00</span>
                </div>
            </figure>
        </main>
    );
}
