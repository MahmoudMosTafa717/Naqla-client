import React from 'react';
import ApplicationTImelineSkeleton from '../timeline/ApplicationTImelineSkeleton';
import ApplicationkanbanSkeleton from '../kanban/ApplicationkanbanSkeleton';

export default function ApplicationsSkeleton({ viewMode }) {
  if (viewMode === 'timeline') {
    return (
      <div className="mt-8 space-y-4 w-full">
        {[1, 2, 3].map(i => (
          <ApplicationTImelineSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <ApplicationkanbanSkeleton />;
}
