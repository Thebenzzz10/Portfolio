import React from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";
import useReveal from "../components/useReveal.js";

export default function Footer() {
  const { ref, controls } = useReveal({ once: true, threshold: 0.2 });

  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 14 }}
          animate={controls}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footerRow">
            <div>© {new Date().getFullYear()} Ben Portfolio</div>
            <div style={{ color: "rgba(255,255,255,.55)" }}>
              Built with React + Motion
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

