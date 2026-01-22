// src/pages/LandingPage/skeletons/FeaturesSkeleton.jsx
export default function FeaturesSkeleton() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header */}
        <div className="h-32 rounded-xl bg-gray-200 animate-skeleton" />

        {/* Block content */}
        {[1, 2].map((i) => (
          <div key={i} className="grid md:grid-cols-2 gap-10">
            <div className="h-64 bg-gray-200 rounded-xl animate-skeleton" />
            <div className="space-y-4">
              <div className="h-10 w-2/3 bg-gray-200 rounded animate-skeleton" />
              <div className="h-6 w-full bg-gray-200 rounded animate-skeleton" />
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-skeleton" />
            </div>
          </div>
        ))}

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[260px] bg-gray-200 rounded-xl animate-skeleton" />
          ))}
        </div>
      </div>
    </section>
  );
}
