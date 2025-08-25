"use client";

export default function FeatureGrid() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 space-y-20">
        {/* Header */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium bg-content1 px-4 py-1 rounded-full  border border-divider text-default-500 tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-default-900">
            Built For Modern Teams
          </h2>
          <p className="text-lg text-default-600 max-w-2xl">
            Everything you need to scale your business, nothing you don&apos;t.
          </p>
        </div>

        {/* Sophisticated Bento Grid */}
        <div className="flex flex-row gap-6">
          <div className="h-160 w-8/12 flex flex-col gap-6">
            <div className="flex flex-row gap-6">
              <div className="h-80 w-1/2 bg-content1 border border-divider rounded-2xl"></div>
              <div className="h-80 w-1/2 bg-content1 border border-divider rounded-2xl"></div>
            </div>
            <div className="h-80 bg-content1 border border-divider rounded-2xl"></div>
          </div>
          <div className="h-160 w-4/12 bg-content1 border border-divider rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
}
