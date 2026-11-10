import type { ReactNode } from "react";

export type SsoProvider = "google" | "apple" | "github";

export type AccountUser = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string | null;
    imageUrl: string | null;
};

export type AccountSession = {
    id: string;
    device: string;
    location: string | null;
    lastActiveAt: string;
    isCurrent: boolean;
};

export type AccountActions = {
    signIn: (provider: SsoProvider) => Promise<void>;
    signOut: () => Promise<void>;
    updateName: (firstName: string, lastName: string) => Promise<void>;
    setPhoto: (file: File | null) => Promise<void>;
    listSessions: () => Promise<AccountSession[]>;
    endSession: (sessionId: string) => Promise<void>;
};

/** One union instead of isLoaded/isSignedIn booleans. */
export type Account =
    | { status: "loading"; actions: AccountActions }
    | { status: "signed-out"; actions: AccountActions }
    | { status: "signed-in"; user: AccountUser; actions: AccountActions };

export type ProviderOption = { id: SsoProvider; label: string };

export type AccountProviderProps = { children: ReactNode };
export type RequireAuthProps = { children: ReactNode };
export type ProviderButtonProps = {
    provider: ProviderOption;
    isBusy: boolean;
    onSelect: (provider: SsoProvider) => void;
};
