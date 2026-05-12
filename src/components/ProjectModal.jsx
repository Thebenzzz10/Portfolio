import React, { useEffect } from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="modalBackdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="modal glass"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="modalGrid">
          <div className="modalMedia">
            <img src={project.imageSrc} alt={project.title} />
          </div>
          <div className="modalBody">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3>{project.title}</h3>
                <p style={{ marginTop: 0 }}>{project.desc}</p>
              </div>
              <button className="btn" onClick={onClose} type="button">
                Close
              </button>
            </div>

            <p>{project.details}</p>

            <div className="modalActions">
              {project.links?.map((l) => (
                <a
                  className="btn btnPrimary"
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              ))}
              <button className="btn" onClick={onClose} type="button">
                Done
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

