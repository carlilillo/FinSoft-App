import { Outlet } from "react-router";
import { ClerkAccountProvider, PreviewAccountProvider } from "@/features/auth";
import { CLERK_PUBLISHABLE_KEY, IS_PREVIEW_MODE } from "@/shared/lib/env";
import { ToastProvider } from "@/shared/ui";

/** Providers that need the router (Clerk navigation, toast links) live here. */
export function RootLayout() {
    const content = (
        <ToastProvider>
            <Outlet />
        </ToastProvider>
    );
    if (IS_PREVIEW_MODE || !CLERK_PUBLISHABLE_KEY)
        return <PreviewAccountProvider>{content}</PreviewAccountProvider>;
    return (
        <ClerkAccountProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            {content}
        </ClerkAccountProvider>
    );
}
