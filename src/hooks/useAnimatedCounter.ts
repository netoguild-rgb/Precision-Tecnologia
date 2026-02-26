"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated counter that counts up when the element becomes visible.
 * @param end - Target number
 * @param duration - Duration in ms (default 2000)
 * @param suffix - Optional suffix (e.g. "+", "x", "%", "h")
 */
export function useAnimatedCounter(end: number, duration = 2000, suffix = "") {
    const [value, setValue] = useState("0" + suffix);
    const ref = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    const startTime = performance.now();

                    function animate(currentTime: number) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * end);

                        setValue(current + suffix);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    }

                    requestAnimationFrame(animate);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration, suffix]);

    return { ref, value };
}
