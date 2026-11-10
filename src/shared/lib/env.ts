export const API_URL: string =
    import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const CLERK_PUBLISHABLE_KEY: string | undefined = import.meta.env
    .VITE_CLERK_PUBLISHABLE_KEY;

/**
 * Preview mode (development only): no Clerk, no API. Every request is answered from local
 * fixtures so the design lab can be reviewed without any credentials.
 */
export const IS_PREVIEW_MODE: boolean =
    import.meta.env.DEV &&
    (import.meta.env.VITE_PREVIEW_MODE === "true" || !CLERK_PUBLISHABLE_KEY);
