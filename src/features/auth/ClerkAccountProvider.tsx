import {
    ClerkProvider,
    useAuth,
    useClerk,
    useSignIn,
    useUser,
} from "@clerk/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setTokenGetter } from "@/shared/lib/http";
import { AccountContext } from "./AccountContext";
import { describeDevice } from "./auth.model";
import type { Account, AccountActions, AccountProviderProps } from "./types";

export function ClerkAccountProvider({
    publishableKey,
    children,
}: AccountProviderProps & { publishableKey: string }) {
    const navigate = useNavigate();
    return (
        <ClerkProvider
            publishableKey={publishableKey}
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
        >
            <ClerkAccountBridge>{children}</ClerkAccountBridge>
        </ClerkProvider>
    );
}

/** Translates Clerk's hooks into the app's Account union and registers the API token getter. */
function ClerkAccountBridge({ children }: AccountProviderProps) {
    const clerk = useClerk();
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { signIn } = useSignIn();

    useEffect(() => {
        setTokenGetter(async () => (await clerk.session?.getToken()) ?? null);
    }, [clerk]);

    const actions: AccountActions = {
        signIn: async (provider) => {
            const { error } = await signIn.sso({
                strategy: `oauth_${provider}`,
                redirectCallbackUrl: "/sso-callback",
                redirectUrl: "/",
            });
            if (error) throw error;
        },
        signOut: () => clerk.signOut({ redirectUrl: "/sign-in" }),
        updateName: async (firstName, lastName) => {
            await user?.update({ firstName, lastName });
        },
        setPhoto: async (file) => {
            await user?.setProfileImage({ file });
        },
        listSessions: async () => {
            const sessions = (await user?.getSessions()) ?? [];
            return sessions.map((session) => ({
                id: session.id,
                device: describeDevice(
                    session.latestActivity.browserName,
                    session.latestActivity.deviceType,
                    session.latestActivity.isMobile,
                ),
                location:
                    [
                        session.latestActivity.city,
                        session.latestActivity.country,
                    ]
                        .filter(Boolean)
                        .join(", ") || null,
                lastActiveAt: session.lastActiveAt.toISOString(),
                isCurrent: session.id === clerk.session?.id,
            }));
        },
        endSession: async (sessionId) => {
            const sessions = (await user?.getSessions()) ?? [];
            await sessions
                .find((session) => session.id === sessionId)
                ?.revoke();
        },
    };

    const account: Account = toAccount(isLoaded, isSignedIn, user, actions);
    return <AccountContext value={account}>{children}</AccountContext>;
}

function toAccount(
    isLoaded: boolean,
    isSignedIn: boolean | undefined,
    user: ReturnType<typeof useUser>["user"],
    actions: AccountActions,
): Account {
    if (!isLoaded) return { status: "loading", actions };
    if (!isSignedIn || !user) return { status: "signed-out", actions };
    return {
        status: "signed-in",
        actions,
        user: {
            id: user.id,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            fullName: user.fullName ?? "",
            email: user.primaryEmailAddress?.emailAddress ?? null,
            imageUrl: user.hasImage ? user.imageUrl : null,
        },
    };
}
