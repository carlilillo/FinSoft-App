import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import styles from "./RouteErrorBoundary.module.css";

export function RouteErrorBoundary() {
    const error = useRouteError();
    const isNotFound = isRouteErrorResponse(error) && error.status === 404;
    return (
        <main className={styles.page}>
            <h1>
                {isNotFound
                    ? "This page doesn't exist"
                    : "Something went wrong"}
            </h1>
            <p>
                {isNotFound
                    ? "The link may be old or mistyped."
                    : "Reload the page, or go back to the overview."}
            </p>
            <Link to="/overview">Go to overview</Link>
        </main>
    );
}
