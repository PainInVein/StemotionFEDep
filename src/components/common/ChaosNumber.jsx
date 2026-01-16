import { useEffect, useState } from "react";

export default function ChaosNumber({ target, duration = 1500 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= duration) {
        setValue(target);
        clearInterval(interval);
      } else {
        const random = Math.floor(Math.random() * target);
        setValue(random);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{value.toLocaleString()}</span>;
}
