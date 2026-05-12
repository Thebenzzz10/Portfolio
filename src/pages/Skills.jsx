import React from "https://esm.sh/react@18.3.1";
import Section from "../components/Section.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function Skills() {
  const skills = [
    { label: "HTML", value: 92 },
    { label: "CSS", value: 90 },
    { label: "React", value: 86 },
    { label: "Framer Motion", value: 78 },
    { label: "UI/UX", value: 84 },
  ];

  return (
    <Section
      id="skills"
      title="Skills"
      subtitle="A quick snapshot of what I build with. Adjust the percentages to match your experience."
    >
      <div className="skillsCard glass">
        {skills.map((s) => (
          <ProgressBar key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </Section>
  );
}

