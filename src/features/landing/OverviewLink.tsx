import { ButtonLink } from "@/shared/ui";
import type { OverviewLinkProps } from "./types";

/** Every call to action on the home page leads to the overview (sign-in comes first when needed). */
export function OverviewLink({ children }: OverviewLinkProps) {
    return (
        <ButtonLink to="/overview" viewTransition>
            {children}
        </ButtonLink>
    );
}
