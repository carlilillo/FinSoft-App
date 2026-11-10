import type {
    MotionValue,
    TargetAndTransition,
    Transition,
} from "motion/react";
import type { ReactNode } from "react";
import type { IconName } from "@/shared/ui/types";

export type NavItem = {
    to: string;
    label: string;
    icon: IconName;
    end?: boolean;
};

export type NavDirection = "forward" | "back";

export type MainNavProps = { hasActiveRun: boolean };
export type NavItemLinkProps = {
    item: NavItem;
    hasActiveRun: boolean;
    isFluid: boolean;
    layoutGroup: string;
};
export type DockItemProps = {
    item: NavItem;
    mouseX: MotionValue<number>;
    hasActiveRun: boolean;
};
export type UserMenuProps = { isCompact?: boolean };
export type AvatarProps = {
    name: string;
    email: string | null;
    imageUrl: string | null;
    size?: number;
};
export type RouteTransitionProps = { children: ReactNode };
export type CommandItem = {
    id: string;
    label: string;
    hint: string;
    to: string;
};
export type CommandPaletteProps = { isOpen: boolean; onClose: () => void };
export type PageVariant = {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    exit: TargetAndTransition;
    transition: Transition;
};
