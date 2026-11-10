import { createContext, useContext } from "react";
import type { Account } from "./types";

export const AccountContext = createContext<Account | null>(null);

/** The only way the app talks to authentication; Clerk stays behind this facade. */
export function useAccount(): Account {
    const account = useContext(AccountContext);
    if (!account)
        throw new Error("useAccount must be used inside an account provider");
    return account;
}

export function useSignedInUser() {
    const account = useAccount();
    if (account.status !== "signed-in")
        throw new Error("useSignedInUser requires a signed-in account");
    return { user: account.user, actions: account.actions };
}
