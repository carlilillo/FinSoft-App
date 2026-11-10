import { HandleSSOCallback } from "@clerk/react";
import { useNavigate } from "react-router";
import styles from "./RequireAuth.module.css";

/** Clerk finishes the OAuth round-trip here (new users are transferred to sign-up automatically). */
export function SsoCallbackPage() {
    const navigate = useNavigate();
    return (
        <div
            className={styles.loading}
            aria-busy="true"
            aria-label="Signing you in"
        >
            <HandleSSOCallback
                navigateToApp={({ decorateUrl }) => {
                    const destination = decorateUrl("/");
                    if (destination.startsWith("http"))
                        window.location.href = destination;
                    else void navigate(destination, { replace: true });
                }}
                navigateToSignIn={() =>
                    void navigate("/sign-in", { replace: true })
                }
                navigateToSignUp={() =>
                    void navigate("/sign-up/continue", { replace: true })
                }
            />
        </div>
    );
}
