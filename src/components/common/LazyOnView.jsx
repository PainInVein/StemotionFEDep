import React, { useEffect, useRef, useState } from "react";

/**
 * LazyOnView:
 * - Chỉ render children khi phần tử đi vào viewport (hoặc gần viewport)
 * - rootMargin giúp "prefetch" sớm trước khi user scroll tới
 */
export default function LazyOnView({
  children,
  fallback = null,
  rootMargin = "200px",
  threshold = 0.01,
  once = true,
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Nếu trình duyệt không hỗ trợ IO -> render luôn
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShow(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShow(false);
        }
      },
      { rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return <div ref={ref}>{show ? children : fallback}</div>;
}
    