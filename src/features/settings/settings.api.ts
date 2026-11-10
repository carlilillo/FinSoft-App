import { apiDelete } from "@/shared/lib/http";

/** Removes the account server-side: invoices, documents, agent history and the Clerk user. */
export function deleteAccount(): Promise<void> {
    return apiDelete("/me");
}
