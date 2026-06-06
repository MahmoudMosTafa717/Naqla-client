import React from "react";

export default function CandidateDetailsSkeleton() {
  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-4 bg-slate-200 animate-pulse rounded w-28 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse shrink-0" />
                <div className="space-y-2 flex-1 min-w-0 w-full">
                  <div className="h-6 bg-slate-200 animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-1/4" />
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-1/2 pt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-gray-100 pt-4">
                <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-10 bg-slate-100 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* AI Screening Summary Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="h-5 bg-slate-200 animate-pulse rounded w-1/4 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-1/3" />
                    <div className="h-2 bg-slate-100 animate-pulse rounded-full w-full" />
                    <div className="h-3 bg-slate-100 animate-pulse rounded w-5/6" />
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="h-5 bg-slate-200 animate-pulse rounded w-1/4 mb-4" />
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 animate-pulse rounded w-1/4" />
                      <div className="h-3 bg-slate-100 animate-pulse rounded w-1/6" />
                      <div className="h-3 bg-slate-100 animate-pulse rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Match Score Circle Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center space-y-4">
              <div className="h-4 bg-slate-200 animate-pulse rounded w-1/3 self-start" />
              <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center">
                <div className="w-16 h-8 bg-slate-200 animate-pulse rounded" />
              </div>
            </div>

            {/* Application Details Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="h-4 bg-slate-200 animate-pulse rounded w-1/3 border-b border-gray-50 pb-2" />
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-1/4" />
                  <div className="h-4 bg-slate-100 animate-pulse rounded w-1/3" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 animate-pulse rounded w-1/4" />
                  <div className="h-5 bg-slate-100 animate-pulse rounded-full w-20" />
                </div>
              </div>
            </div>

            {/* Recommendation Skeleton */}
            <div className="bg-slate-100 rounded-2xl p-5 space-y-4">
              <div className="h-4 bg-slate-200 animate-pulse rounded w-1/3" />
              <div className="h-3 bg-slate-200 animate-pulse rounded w-full" />
              <div className="h-10 bg-slate-200 animate-pulse rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
