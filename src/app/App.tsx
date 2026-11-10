import { QueryClientProvider } from "@tanstack/react-query";
import { domMax, LazyMotion, MotionConfig } from "motion/react";
import { RouterProvider } from "react-router/dom";
import { queryClient } from "@/shared/lib/query-client";
import { router } from "./router";

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <LazyMotion features={domMax} strict>
                <MotionConfig reducedMotion="user">
                    <RouterProvider router={router} />
                </MotionConfig>
            </LazyMotion>
        </QueryClientProvider>
    );
}
