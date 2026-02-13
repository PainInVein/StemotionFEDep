import { lazy, Suspense, useEffect, useRef, useState, memo } from "react";

import CTASkeleton from "./skeletons/CTASkeleton";
import FeaturesSkeleton from "./skeletons/FeaturesSkeleton";
import HeroSkeleton from "./skeletons/HeroSkeleton";
import { useAuthModalStore } from "../../../stores/authModalStore";

const HeroSection = lazy(() => import("./sections/HeroSection"));
const FeaturesSection = lazy(() => import("./sections/FeaturesSection"));
const CTASection = lazy(() => import("./sections/CTASection"));

const LazySection = memo(function LazySection({ children, fallback, rootMargin="400px", threshold=0.01 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin, threshold });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
});

export default function LandingPage() {
  const openLogin = useAuthModalStore((s) => s.openLogin);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection openLogin={openLogin} />
      </Suspense>

      <LazySection fallback={<FeaturesSkeleton />} rootMargin="250px">
        <Suspense fallback={<FeaturesSkeleton />}>
          <FeaturesSection />
        </Suspense>
      </LazySection>

      <LazySection fallback={<CTASkeleton />} rootMargin="250px">
        <Suspense fallback={<CTASkeleton />}>
          <CTASection />
        </Suspense>
      </LazySection>
    </div>
  );
}
