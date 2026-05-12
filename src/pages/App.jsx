import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { AnimatePresence } from "https://esm.sh/framer-motion@11.3.30";

import Navbar from "../components/Navbar.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Work from "./Work.jsx";
import Skills from "./Skills.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import ProjectModal from "../components/ProjectModal.jsx";
import CustomCursor from "../components/CustomCursor.jsx";

export default function App() {
  const projects = useMemo(
    () => [
      {
        id: "p1",
        title: "Glass Dashboard",
        desc: "Cinematic analytics UI with blur layers and micro-interactions.",
        tag: "UI / Motion",
        imageSrc: "./src/assets/project-1.svg",
        details:
          "A minimal, TikTok-smooth layout with glass surfaces, soft gradients, and subtle scroll reveals. Swap this text with your real project story.",
        links: [
          { label: "Live Demo", href: "#" },
          { label: "Source", href: "#" },
        ],
      },
      {
        id: "p2",
        title: "Landing Filmstrip",
        desc: "High-end hero with fluid transitions and bold typography.",
        tag: "Brand / Web",
        imageSrc: "./src/assets/project-2.svg",
        details:
          "Designed like a creative agency: tight spacing, premium type scale, and tasteful motion. Replace the image and links with your own.",
        links: [
          { label: "Case Study", href: "#" },
          { label: "Source", href: "#" },
        ],
      },
      {
        id: "p3",
        title: "Mobile App Concept",
        desc: "Dark-mode concept with parallax cards and soft glow.",
        tag: "Concept",
        imageSrc: "./src/assets/project-3.svg",
        details:
          "A calm, cinematic vibe: minimal UI, deep blacks, and gentle blur. Perfect for showcasing product thinking and polish.",
        links: [{ label: "Prototype", href: "#" }],
      },
      {
        id: "p4",
        title: "Portfolio System",
        desc: "Reusable components + animation primitives for fast builds.",
        tag: "React",
        imageSrc: "./src/assets/project-4.svg",
        details:
          "This very site is a starter system: Navbar, Sections, Cards, Modals, and scroll-triggered motion—all easy to customize.",
        links: [{ label: "Source", href: "#" }],
      },
    ],
    []
  );

  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="app">
      <div className="noise" />
      <CustomCursor />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Work projects={projects} onOpenProject={setActiveProject} />
        <Skills />
        <Contact />
        <Footer />
      </main>

      <AnimatePresence>
        {activeProject ? (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
