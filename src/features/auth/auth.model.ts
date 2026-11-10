import type { AccountUser, ProviderOption } from "./types";

export const SSO_PROVIDERS: readonly ProviderOption[] = [
    { id: "google", label: "Continue with Google" },
    { id: "apple", label: "Continue with Apple" },
    { id: "github", label: "Continue with GitHub" },
];

export function initials(
    user: Pick<AccountUser, "fullName" | "email">,
): string {
    const source = user.fullName.trim() || user.email || "?";
    const parts = source.split(/\s+/).filter(Boolean);
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function displayName(user: AccountUser): string {
    return user.fullName.trim() || user.email || "Your account";
}

export function describeDevice(
    browserName?: string,
    deviceType?: string,
    isMobile?: boolean,
): string {
    const device = deviceType ?? (isMobile ? "Mobile" : "Computer");
    return browserName ? `${browserName} on ${device}` : device;
}
