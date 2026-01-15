// src/pages/LandingPage/skeletons/HeroSkeleton.jsx
export default function HeroSkeleton() {
  return (
    <section className="py-20 md:py-32 px-6 bg-gradient-hero">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-6">
          <div className="h-12 w-3/4 bg-gray-200 rounded animate-skeleton" />
          <div className="h-6 w-full bg-gray-200 rounded animate-skeleton" />
          <div className="h-6 w-5/6 bg-gray-200 rounded animate-skeleton" />

          <div className="flex gap-4 mt-6">
            <div className="flex-1 h-[150px] bg-gray-200 rounded-xl animate-skeleton" />
            <div className="flex-1 h-[150px] bg-gray-200 rounded-xl animate-skeleton" />
          </div>
        </div>

        {/* Right illustration */}
        <div className="h-[360px] bg-gray-200 rounded-3xl animate-skeleton" />
      </div>
    </section>
  );
}
