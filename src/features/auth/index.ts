export { useAccount, useSignedInUser } from "./AccountContext";
export { initials, displayName } from "./auth.model";
export { ClerkAccountProvider } from "./ClerkAccountProvider";
export { PreviewAccountProvider } from "./PreviewAccountProvider";
export { RequireAuth } from "./RequireAuth";
export type { AccountSession, AccountUser } from "./types";

export const loadSignInPage = () =>
    import("./SignInPage").then((module) => module.SignInPage);
export const loadSsoCallbackPage = () =>
    import("./SsoCallbackPage").then((module) => module.SsoCallbackPage);
export const loadContinueSignUpPage = () =>
    import("./ContinueSignUpPage").then((module) => module.ContinueSignUpPage);
