import React, { useEffect, useRef } from "https://esm.sh/react@18.3.1";
import { motion, useMotionValue, useSpring } from "https://esm.sh/framer-motion@11.3.30";

export default function CustomCursor() {
  const enabled = typeof window !== "undefined" && matchMedia?.("(pointer:fine)")?.matches;
  const mounted = useRef(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    mounted.current = true;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursorDot"
        style={{ left: x, top: y }}
        animate={{ opacity: mounted.current ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="cursorRing"
        style={{ left: ringX, top: ringY }}
        animate={{ opacity: mounted.current ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

