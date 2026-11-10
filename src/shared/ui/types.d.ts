import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonProps = ComponentProps<"button"> & {
    variant?: ButtonVariant;
    isBusy?: boolean;
};

export type ButtonLinkProps = {
    to: string;
    variant?: ButtonVariant;
    children: ReactNode;
    viewTransition?: boolean;
};

export type SegmentOption<T extends string> = { value: T; label: string };

export type SegmentedControlProps<T extends string> = {
    label: string;
    options: ReadonlyArray<SegmentOption<T>>;
    value: T;
    onChange: (value: T) => void;
};

export type DialogProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export type AnimatedNumberProps = {
    value: number;
    format: (value: number) => string;
};

export type EmptyStateProps = {
    title: string;
    children?: ReactNode;
    action?: ReactNode;
};

export type ErrorStateProps = { error: unknown; onRetry?: () => void };

export type SkeletonProps = { lines?: number; height?: string };

export type BadgeTone = "accent" | "neutral" | "success" | "warning";

export type BadgeProps = { tone?: BadgeTone; children: ReactNode };

export type IconName =
    | "overview"
    | "invoices"
    | "products"
    | "analyze"
    | "settings"
    | "download"
    | "upload"
    | "search"
    | "mail"
    | "check"
    | "back"
    | "logout";

export type IconProps = { name: IconName; size?: number };

export type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    back?: { to: string; label: string };
};

export type Toast = {
    id: number;
    message: string;
    action?: { label: string; to: string };
};

export type ToastContextValue = {
    showToast: (toast: Omit<Toast, "id">) => void;
};

export type ToastProviderProps = { children: ReactNode };
