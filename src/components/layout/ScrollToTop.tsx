"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setVisible(window.scrollY > 400);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-to-top ${visible ? "visible" : ""}`}
            aria-label="Voltar ao topo"
        >
            <ArrowUp size={18} />
        </button>
    );
}
