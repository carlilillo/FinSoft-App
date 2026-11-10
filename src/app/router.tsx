import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { loadAnalyzePage, loadRunPage } from "@/features/analysis";
import {
    loadContinueSignUpPage,
    loadSignInPage,
    loadSsoCallbackPage,
    RequireAuth,
} from "@/features/auth";
import { loadDashboardPage } from "@/features/dashboard";
import { loadInvoiceDetailPage, loadInvoicesPage } from "@/features/invoices";
import { loadLandingPage } from "@/features/landing";
import { loadProductDetailPage, loadProductsPage } from "@/features/products";
import { loadSettingsPage } from "@/features/settings";
import { AppLayout, trackNavDirection } from "@/features/shell";
import { IS_PREVIEW_MODE } from "@/shared/lib/env";
import { RootLayout } from "./RootLayout";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

/** Turns a page loader into a react-router lazy route. */
function page(load: () => Promise<ComponentType>) {
    return async () => ({ Component: await load() });
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            { index: true, lazy: page(loadLandingPage) },
            { path: "/sign-in", lazy: page(loadSignInPage) },
            IS_PREVIEW_MODE
                ? {
                      path: "/sso-callback",
                      element: <Navigate to="/overview" replace />,
                  }
                : { path: "/sso-callback", lazy: page(loadSsoCallbackPage) },
            { path: "/sign-up/continue", lazy: page(loadContinueSignUpPage) },
            {
                element: (
                    <RequireAuth>
                        <AppLayout />
                    </RequireAuth>
                ),
                errorElement: <RouteErrorBoundary />,
                children: [
                    { path: "overview", lazy: page(loadDashboardPage) },
                    { path: "invoices", lazy: page(loadInvoicesPage) },
                    {
                        path: "invoices/:invoiceId",
                        lazy: page(loadInvoiceDetailPage),
                    },
                    { path: "products", lazy: page(loadProductsPage) },
                    {
                        path: "products/:productId",
                        lazy: page(loadProductDetailPage),
                    },
                    { path: "analyze", lazy: page(loadAnalyzePage) },
                    { path: "analyses/:runId", lazy: page(loadRunPage) },
                    { path: "settings", lazy: page(loadSettingsPage) },
                    { path: "*", element: <Navigate to="/overview" replace /> },
                ],
            },
        ],
    },
]);

trackNavDirection(router);
