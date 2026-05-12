import React from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";

export default function ProjectCard({ project, onOpen }) {
  return (
    <motion.article
      className="projectCard"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(project);
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <div className="projectMedia" aria-hidden="true">
        {/* Manually added image (no auto-fetch) */}
        <img src={project.imageSrc} alt="" loading="lazy" />
      </div>

      <div className="projectOverlay">
        <div className="projectMeta">
          <div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
          </div>
          <span className="projectTag">{project.tag}</span>
        </div>
      </div>
    </motion.article>
  );
}

