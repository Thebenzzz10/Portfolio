import React from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";
import useReveal from "./useReveal.js";

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}) {
  const { ref, controls } = useReveal({ once: true });

  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 18 }}
          animate={controls}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sectionTitle">
            <div>
              <h2>{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
