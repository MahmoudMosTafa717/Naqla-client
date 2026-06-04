import { useState, useEffect } from "react";
import ApplicationsHeader from "../features/applications/components/shared/ApplicationsHeader.jsx";
import ApplicationsStats from "../features/applications/components/shared/ApplicationsStats.jsx";
import ApplicationTimelineCard from "../features/applications/components/timeline/ApplicationTimelineCard.jsx";
import ApplicationKanbanColumn from "../features/applications/components/kanban/ApplicationKanbanColumn.jsx";
import ApplicationsSkeleton from "../features/applications/components/shared/ApplicationsSkeleton.jsx";

const mockApplications = [
  { id: '1', role: 'Senior Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', appliedDate: '5/15/2024', aiScore: 92, status: 'Interview Scheduled', alertMessage: 'Wednesday, May 22', currentStageIndex: 1, stageDates: { applied: 'May 15', reviewed: 'May 16' }, kanbanBucket: 'inProgress' },
  { id: '2', role: 'React Engineer', company: 'StartupXYZ', location: 'Remote', appliedDate: '5/12/2024', aiScore: 88, status: 'In Review', currentStageIndex: 0, stageDates: { applied: 'May 12' }, kanbanBucket: 'inProgress' },
  { id: '3', role: 'Full Stack Developer', company: 'Innovation Labs', location: 'New York, NY', appliedDate: '5/10/2024', aiScore: 85, status: 'In Review', currentStageIndex: 0, stageDates: { applied: 'May 10' }, kanbanBucket: 'inProgress' },
  { id: '4', role: 'Software Engineer', company: 'Meta', location: 'Menlo Park, CA', appliedDate: '5/8/2024', aiScore: 78, status: 'Rejected', alertMessage: 'Position filled', currentStageIndex: 3, stageDates: { applied: 'May 8', reviewed: 'May 9', rejected: 'May 11' }, kanbanBucket: 'rejected' },
  { id: '5', role: 'Frontend Developer', company: 'Google', location: 'Mountain View, CA', appliedDate: '5/5/2024', aiScore: 95, status: 'Offer Received', alertMessage: 'Competitive package', currentStageIndex: 3, stageDates: { applied: 'May 5', reviewed: 'May 6', interview: 'May 10', offer: 'May 14' }, kanbanBucket: 'offers' }
];

export default function CandidateApplications() {
  const [viewMode, setViewMode] = useState("timeline");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ApplicationsHeader viewMode={viewMode} setViewMode={setViewMode} />
        <ApplicationsStats />
        {isLoading ? (
          <ApplicationsSkeleton viewMode={viewMode} />
        ) : viewMode === 'timeline' ? (
          <div className='mt-8 space-y-4 w-full'>
            {mockApplications.map(app => (
              <ApplicationTimelineCard key={app.id} app={app}/>
            )) }
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <ApplicationKanbanColumn 
              title="In Progress" 
              apps={mockApplications.filter(app => app.kanbanBucket === 'inProgress')} 
            />
            <ApplicationKanbanColumn 
              title="Offers" 
              apps={mockApplications.filter(app => app.kanbanBucket === 'offers')} 
            />
            <ApplicationKanbanColumn 
              title="Rejected" 
              apps={mockApplications.filter(app => app.kanbanBucket === 'rejected')} 
            />
          </div>
        )}
      </div>
    </div>
  );
}