import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";

const TITLES = ["Creative Designer", "Frontend Developer", "Motion-First Builder"];

function useTypeCycle(items, ms = 1800) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % items.length), ms);
    return () => clearInterval(t);
  }, [items.length, ms]);
  return items[idx];
}

export default function Hero() {
  const title = useTypeCycle(TITLES, 1850);

  const chips = useMemo(
    () => ["Cinematic UI", "Glassmorphism", "Scroll Motion", "Minimal Systems"],
    []
  );

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="heroGrid">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pill" style={{ marginBottom: 14 }}>
              <span style={{ color: "rgba(255,255,255,.72)" }}>
                Available for freelance
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, rgba(34,197,94,1), rgba(6,182,212,1))",
                  boxShadow: "0 0 0 6px rgba(34,197,94,.10)",
                }}
                aria-hidden="true"
              />
            </div>

            <h1>
              I craft <span className="gradientText">cinematic</span> digital
              experiences.
            </h1>

            <p>
              <span style={{ color: "rgba(255,255,255,.82)" }}>
                {title}
              </span>{" "}
              — clean systems, premium typography, and smooth motion inspired by
              minimal TikTok-style UI.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btnPrimary" href="#work">
                View Work
              </a>
              <a className="btn" href="#contact">
                Contact
              </a>
            </div>
          </motion.div>

          <motion.div
            className="heroCard glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="heroCardTop">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(255,255,255,.18)",
                  }}
                  aria-hidden="true"
                />
                <span style={{ color: "rgba(255,255,255,.72)" }}>
                  Selected vibes
                </span>
              </div>
              <span className="projectTag">2026</span>
            </div>

            <div className="chips" style={{ marginBottom: 14 }}>
              {chips.map((c) => (
                <span className="chip" key={c}>
                  {c}
                </span>
              ))}
            </div>

            <motion.div
              className="heroPreview"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="heroPreviewContent">
                <div className="heroMiniTop">
                  <span className="miniBadge">
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, rgba(124,58,237,1), rgba(6,182,212,1))",
                        boxShadow: "0 0 0 6px rgba(6,182,212,.10)",
                      }}
                      aria-hidden="true"
                    />
                    <span style={{ color: "rgba(255,255,255,.78)" }}>
                      Motion reel
                    </span>
                  </span>

                  <span className="miniBadge mono" style={{ opacity: 0.9 }}>
                    00:12
                  </span>
                </div>

                <div className="miniLines">
                  <p className="miniTitle">Smooth. Minimal. Cinematic.</p>
                  <p className="miniSub">
                    Scroll reveals + hover depth + glass layers — inspired by
                    TikTok’s clean, motion-first feel.
                  </p>

                  <div className="miniStatRow">
                    <span className="miniStat">60fps UI</span>
                    <span className="miniStat">Soft blur</span>
                    <span className="miniStat">Deep blacks</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

