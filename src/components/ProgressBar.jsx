import React, { useEffect, useRef } from "https://esm.sh/react@18.3.1";
import { motion, useAnimation } from "https://esm.sh/framer-motion@11.3.30";

export default function ProgressBar({ label, value }) {
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        controls.start({ width: `${value}%` });
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [controls, value]);

  return (
    <div className="skillRow" ref={ref}>
      <span>{label}</span>
      <div className="bar" aria-hidden="true">
        <motion.i
          initial={{ width: "0%" }}
          animate={controls}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="pct">{value}%</div>
    </div>
  );
}

