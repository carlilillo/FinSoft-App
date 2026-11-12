import { formatCountdown } from "./analysis.model";
import type { LinkCountdownProps } from "./types";
import { useNow } from "./usePhoneImport";

/** Its own component so only this text re-renders every second, not the QR code. */
export function LinkCountdown({ expiresAt }: LinkCountdownProps) {
    const msLeft = new Date(expiresAt).getTime() - useNow();
    return <time dateTime={expiresAt}>{formatCountdown(msLeft)}</time>;
}
