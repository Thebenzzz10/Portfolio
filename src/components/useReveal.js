import { useEffect, useMemo, useRef } from "https://esm.sh/react@18.3.1";
import { useAnimation } from "https://esm.sh/framer-motion@11.3.30";

export default function useReveal({ once = true, threshold = 0.2 } = {}) {
  const ref = useRef(null);
  const controls = useAnimation();

  const opts = useMemo(
    () => ({
      once,
      threshold,
    }),
    [once, threshold]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasRevealed = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (opts.once && hasRevealed) return;
        hasRevealed = true;

        controls.start({ opacity: 1, y: 0 });
      },
      { threshold: opts.threshold }
    );

    controls.set({ opacity: 0, y: 18 });
    io.observe(el);

    return () => io.disconnect();
  }, [controls, opts]);

  return { ref, controls };
}
