import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IS_PREVIEW_MODE } from "@/shared/lib/env";
import { setRequestInterceptor } from "@/shared/lib/http";
import { App } from "./App";
import "./global.css";

async function bootstrap(): Promise<void> {
    if (IS_PREVIEW_MODE) {
        const { answerFromFixtures } = await import("./preview/fixture-server");
        setRequestInterceptor(answerFromFixtures);
    }
    const root = document.getElementById("root");
    if (!root) throw new Error("Missing #root element");
    createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}

void bootstrap();
