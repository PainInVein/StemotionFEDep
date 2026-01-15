// src/pages/LandingPage/skeletons/CTASkeleton.jsx
export default function CTASkeleton() {
  return (
    <section className="py-20 px-6 bg-gray-200">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="h-12 w-3/4 mx-auto bg-gray-300 rounded animate-skeleton" />
        <div className="h-6 w-full bg-gray-300 rounded animate-skeleton" />

        <div className="flex justify-center gap-4 pt-4">
          <div className="h-12 w-48 bg-gray-300 rounded-full animate-skeleton" />
          <div className="h-12 w-48 bg-gray-300 rounded-full animate-skeleton" />
        </div>
      </div>
    </section>
  );
}
