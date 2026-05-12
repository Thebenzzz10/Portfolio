import React from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";
import Section from "../components/Section.jsx";
import useReveal from "../components/useReveal.js";

export default function About() {
  const { ref, controls } = useReveal({ once: true, threshold: 0.25 });

  return (
    <Section
      id="about"
      title="About"
      subtitle="A short bio, a clean aesthetic, and a focus on motion-first UX."
    >
      <div className="aboutGrid">
        <motion.div
          className="aboutCard glass"
          ref={ref}
          initial={{ opacity: 0, y: 18 }}
          animate={controls}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pill" style={{ marginBottom: 14 }}>
            <span style={{ color: "rgba(255,255,255,.72)" }}>
              Based in your city
            </span>
            <span style={{ color: "rgba(255,255,255,.9)" }}>—</span>
            <span style={{ color: "rgba(255,255,255,.72)" }}>
              Remote worldwide
            </span>
          </div>

          <h3 style={{ margin: 0, letterSpacing: "-0.02em" }}>
            Minimal, premium, and built for real users.
          </h3>
          <p>
            I’m a designer/developer who loves deep blacks, soft gradients, and
            subtle blur. My work prioritizes clarity, rhythm, and tactile motion
            — so every scroll, hover, and transition feels intentional.
          </p>
          <p>
            Replace this text with your real bio. Keep it short and confident:
            what you do, who you help, and what makes your style unique.
          </p>
        </motion.div>

        <motion.div
          className="profileWrap glass"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Manually insert your profile image here */}
          <img
            className="profileImg"
            src="./src/assets/profile.svg"
            alt="Profile"
            loading="lazy"
          />
        </motion.div>
      </div>
    </Section>
  );
}

