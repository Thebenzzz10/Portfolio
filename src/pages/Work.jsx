import React from "https://esm.sh/react@18.3.1";
import Section from "../components/Section.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Work({ projects, onOpenProject }) {
  return (
    <Section
      id="work"
      title="Work"
      subtitle="A few highlights. Replace images, titles, descriptions, and links with your real projects."
    >
      <div className="grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />
        ))}
      </div>
    </Section>
  );
}

