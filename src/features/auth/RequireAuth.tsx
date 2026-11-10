import { Navigate, useLocation } from "react-router";
import { useAccount } from "./AccountContext";
import type { RequireAuthProps } from "./types";
import styles from "./RequireAuth.module.css";

export function RequireAuth({ children }: RequireAuthProps) {
    const account = useAccount();
    const location = useLocation();

    if (account.status === "loading")
        return (
            <div
                className={styles.loading}
                aria-busy="true"
                aria-label="Loading your account"
            />
        );
    if (account.status === "signed-out")
        return (
            <Navigate
                to="/sign-in"
                replace
                state={{ from: location.pathname }}
            />
        );
    return children;
}
