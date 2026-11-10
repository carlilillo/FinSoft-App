import { useEffect, useState } from "react";

/** True once the page has scrolled past `threshold` pixels. */
export function useIsScrolled(threshold = 40): boolean {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > threshold);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);
    return isScrolled;
}
