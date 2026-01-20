// src/pages/LandingPage/LandingPage.jsx
import { lazy, Suspense, useCallback, useEffect, useRef, useState, memo } from "react";

import CTASkeleton from "./skeletons/CTASkeleton";
import FeaturesSkeleton from "./skeletons/FeaturesSkeleton";
import HeroSkeleton from "./skeletons/HeroSkeleton";

const HeroSection = lazy(() => import("./sections/HeroSection"));
const FeaturesSection = lazy(() => import("./sections/FeaturesSection"));
const CTASection = lazy(() => import("./sections/CTASection"));

const LoginModal = lazy(() => import("../LoginPage/LoginPage"));

const LazySection = memo(function LazySection({
  children,
  fallback,
  rootMargin = "400px",
  threshold = 0.01,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
});

export default function LandingPage() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, role: "student" });

  const openLogin = useCallback((role) => {
    setModalConfig({ isOpen: true, role });
  }, []);

  const closeLogin = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

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

      {modalConfig.isOpen && (
        <Suspense fallback={null}>
          <LoginModal isOpen={modalConfig.isOpen} onClose={closeLogin} role={modalConfig.role} />
        </Suspense>
      )}
    </div>
  );
}
