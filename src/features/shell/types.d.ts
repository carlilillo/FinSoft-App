import type { IconName } from "@/shared/ui/types";

export type NavItem = {
    to: string;
    label: string;
    icon: IconName;
};

export type NavDirection = "forward" | "back";

export type MainNavProps = { hasActiveRun: boolean };
export type NavItemLinkProps = {
    item: NavItem;
    isActive: boolean;
    hasActiveRun: boolean;
};
export type AvatarProps = {
    name: string;
    email: string | null;
    imageUrl: string | null;
    size?: number;
};
