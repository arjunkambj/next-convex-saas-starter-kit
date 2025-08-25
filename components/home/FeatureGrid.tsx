"use client";

export default function FeatureGrid() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-content1 rounded-2xl p-4">
          <h2 className="text-2xl font-bold">Feature 1</h2>
        </div>
      </div>
    </section>
  );
}
