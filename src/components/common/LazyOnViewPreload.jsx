import React, { useEffect, useRef, useState } from "react";

export default function LazyOnViewPreload({
  children,
  fallback = null,
  rootMargin = "500px",
  threshold = 0.01,
  preload, // function: () => import(...)
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [preloaded, setPreloaded] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // preload trước
          if (preload && !preloaded) {
            try {
              await preload();
              setPreloaded(true);
            } catch {}
          }
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, preload, preloaded]);

  return <div ref={ref}>{show ? children : fallback}</div>;
}
