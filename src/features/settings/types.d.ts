import type { GmailAccount } from "@/features/analysis";

export type DeleteAccountDialogProps = { isOpen: boolean; onClose: () => void };
export type GmailAccountListProps = { accounts: GmailAccount[] };
