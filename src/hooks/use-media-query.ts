import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQueryList = window.matchMedia(query);

        const updateMatches = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Initial match check
        setMatches(mediaQueryList.matches);

        // Event listener for changes
        mediaQueryList.addEventListener("change", updateMatches);

        return () => {
            mediaQueryList.removeEventListener("change", updateMatches);
        };
    }, [query]);

    return matches;
}
