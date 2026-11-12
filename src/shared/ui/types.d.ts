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

/** A labelled native select: keyboard, screen reader and mobile pickers come for free. */
export type SelectProps<T extends string> = Omit<
    ComponentProps<"select">,
    "value" | "onChange" | "children"
> & {
    label: string;
    options: ReadonlyArray<SegmentOption<T>>;
    value: T;
    onChange: (value: T) => void;
};

export type SwitchProps = Omit<
    ComponentProps<"button">,
    "onChange" | "role" | "aria-checked"
> & {
    label: string;
    /** Secondary line under the label. */
    description?: string;
    isOn: boolean;
    onChange: (isOn: boolean) => void;
};

export type DialogProps = {
    isOpen: boolean;
    title: string;
    /** One short line under the title. */
    description?: string;
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
    | "logout"
    | "copy"
    | "external"
    | "phone"
    | "laptop"
    | "image"
    | "document"
    | "close"
    | "chevron";

export type IconProps = { name: IconName; size?: number };

export type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    /** Where the back link leads when there is no previous page in the app to return to. */
    back?: BackLinkProps;
};

export type BackLinkProps = { to: string; label: string };

export type Toast = {
    id: number;
    message: string;
    action?: { label: string; to: string };
};

export type ToastContextValue = {
    showToast: (toast: Omit<Toast, "id">) => void;
};

export type ToastProviderProps = { children: ReactNode };
