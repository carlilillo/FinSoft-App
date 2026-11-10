import { useState } from "react";
import { AccountContext } from "./AccountContext";
import type {
    Account,
    AccountActions,
    AccountProviderProps,
    AccountSession,
    AccountUser,
} from "./types";

const PREVIEW_USER: AccountUser = {
    id: "user_preview",
    firstName: "Lucía",
    lastName: "Moreno",
    fullName: "Lucía Moreno",
    email: "lucia.moreno@example.com",
    imageUrl: null,
};

const PREVIEW_SESSIONS: AccountSession[] = [
    {
        id: "sess_1",
        device: "Chrome on Computer",
        location: "Madrid, ES",
        lastActiveAt: new Date().toISOString(),
        isCurrent: true,
    },
    {
        id: "sess_2",
        device: "Safari on Mobile",
        location: "Madrid, ES",
        lastActiveAt: new Date(Date.now() - 86_400_000).toISOString(),
        isCurrent: false,
    },
];

/** Design-review stand-in for Clerk (development only, see shared/lib/env.ts). */
export function PreviewAccountProvider({ children }: AccountProviderProps) {
    const [user, setUser] = useState<AccountUser | null>(PREVIEW_USER);

    const actions: AccountActions = {
        signIn: () => Promise.resolve(setUser(PREVIEW_USER)),
        signOut: () => Promise.resolve(setUser(null)),
        updateName: (firstName, lastName) =>
            Promise.resolve(
                setUser(
                    (current) =>
                        current && {
                            ...current,
                            firstName,
                            lastName,
                            fullName: `${firstName} ${lastName}`.trim(),
                        },
                ),
            ),
        setPhoto: (file) =>
            Promise.resolve(
                setUser(
                    (current) =>
                        current && {
                            ...current,
                            imageUrl: file ? URL.createObjectURL(file) : null,
                        },
                ),
            ),
        listSessions: () => Promise.resolve(PREVIEW_SESSIONS),
        endSession: () => Promise.resolve(),
    };

    const account: Account = user
        ? { status: "signed-in", user, actions }
        : { status: "signed-out", actions };
    return <AccountContext value={account}>{children}</AccountContext>;
}
