import React, { useEffect, useState } from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

function scrollToHash(href) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="nav">
      <div className="container">
        <motion.div
          className={`navInner glass ${scrolled ? "" : ""}`}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            className="brand"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#home");
            }}
          >
            <span className="brandMark" aria-hidden="true" />
            <span>Renier Ben Almario</span>
          </a>

          <div className="navLinks" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(l.href);
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="navCta">
            <button
              className="btn btnPrimary"
              onClick={() => scrollToHash("#work")}
              type="button"
            >
              View Work
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
