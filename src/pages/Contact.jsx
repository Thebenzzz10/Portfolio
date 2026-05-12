import React, { useState } from "https://esm.sh/react@18.3.1";
import { motion } from "https://esm.sh/framer-motion@11.3.30";
import Section from "../components/Section.jsx";

function SocialLink({ href, label, handle }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <span style={{ color: "rgba(255,255,255,.84)" }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,.60)" }}>{handle}</span>
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    // Beginner-friendly: no backend. Replace with Formspree/Netlify forms later.
    alert("Thanks! Connect a form backend to receive messages.");
  };

  return (
    <Section
      id="contact"
      title="Contact"
      subtitle="Send a message, or find me on socials."
    >
      <div className="contactGrid">
        <motion.form
          className="form glass"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="field">
            <div className="label">Name</div>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              required
            />
          </div>
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <div className="label">Message</div>
            <textarea
              className="textarea"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Tell me what you're building..."
              required
            />
          </div>

          <button className="btn btnPrimary" type="submit">
            Send Message
          </button>
        </motion.form>

        <motion.div
          className="social glass"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pill" style={{ alignSelf: "flex-start" }}>
            <span style={{ color: "rgba(255,255,255,.72)" }}>
              Social links
            </span>
          </div>

          {/* Replace these with your real profiles */}
          <SocialLink href="#" label="TikTok" handle="@yourhandle" />
          <SocialLink href="#" label="Instagram" handle="@yourhandle" />
          <SocialLink href="#" label="GitHub" handle="@yourhandle" />
          <SocialLink href="#" label="LinkedIn" handle="/in/yourhandle" />
        </motion.div>
      </div>
    </Section>
  );
}

