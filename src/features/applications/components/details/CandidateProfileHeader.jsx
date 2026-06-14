import { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Star, CheckCircle2, Calendar, XCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button.jsx';
import { useApplicationStore } from '../../../../store/applicationStore.js';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { createInterview } from '../../../../services/interviewApi.js';
import { InterviewModal } from '../../../../components/interviews/InterviewModal.jsx';

export default function CandidateProfileHeader({ candidate = {}, hideActions = false }) {
  const { id, name, role, email, phone, skills, location, experienceYears, isStarred, initials } = candidate || {};
  const { updateApplicationStage, addApplicationNote } = useApplicationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleScheduleSubmit = async (payload) => {
    setIsSaving(true);
    try {
      await createInterview({ ...payload, applicationId: id });
      toast.success("Interview scheduled successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Failed to schedule interview");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStages = async (stageKey) => {
    try {
      await updateApplicationStage(id, {
        stage: { key: stageKey },
      });
    } catch (error) {
      console.error("Failed :", error);
    }
  };

  const handleToggleStar = async () => {
    try {
      const newRating = isStarred ? 1 : 5;
      await addApplicationNote(id, {
        content: isStarred ? "Removed star rating" : "Starred candidate",
        ratingScore: newRating
      });
    } catch (err) {
      toast.error("Failed to update candidate star status. Please check your connection.");
      console.error("Failed to toggle star:", err);
    }
  };

  const currentStatus = candidate?.meta?.status || "applied";

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.03)] p-6'>
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6'>
        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-main)] to-[#3b82f6] text-white font-bold text-2xl shrink-0 flex items-center justify-center shadow-sm'>
          {initials}
        </div>
        <div className='space-y-1 flex-1 min-w-0 w-full'>
          <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-extrabold text-(--color-secondary-main) truncate tracking-tight">{name}</h1>
            {!hideActions && (
              <Star 
                onClick={handleToggleStar}
                className={`w-5 h-5 cursor-pointer shrink-0 ml-2 transition-all duration-200 ease-in-out hover:scale-110 ${isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-500 hover:fill-amber-500/50'}`} 
              />
            )}
          </div>
          <p className='text-sm font-medium text-(--color-secondary-muted) truncate'>{role}</p>
  
          <div className='flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs text-(--color-secondary-muted) font-medium'>
            <span className='flex items-center gap-1.5'><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {phone}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {location}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {experienceYears}</span>
          </div>
  
          <div className='flex gap-1.5 flex-wrap mt-4'>
            {skills && skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="bg-[var(--color-bg-light-tint)] text-[var(--color-primary-main)] border border-blue-200/50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-all duration-200 ease-in-out hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
  
      {!hideActions && (
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 border-t border-slate-100 pt-4'>
          {currentStatus === 'interview' ? (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-[24px] bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed transition-all duration-200 ease-in-out">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stage: Interview
            </div>
          ) : (
            <Button 
              onClick={() => handleStages('interview')}
              className="hover:bg-blue-700 w-full transition-all duration-200 ease-in-out"
            >
              <CheckCircle2 className="w-4 h-4" /> Move to Interview
            </Button>
          )}
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full transition-all duration-200 ease-in-out" 
            variant='outline'
          >
            <Calendar className="w-4 h-4" /> Schedule Interview
          </Button>
          
          {currentStatus === 'rejected' ? (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-[24px] bg-rose-50 text-rose-700 border border-rose-200 cursor-not-allowed transition-all duration-200 ease-in-out">
              <XCircle className="w-4 h-4 text-rose-600" /> Rejected
            </div>
          ) : (
            <button
              onClick={() => handleStages('rejected')}
              className="w-full font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 py-2.5 px-4 text-sm rounded-[24px] cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <InterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleScheduleSubmit}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}

CandidateProfileHeader.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    initials: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    experienceYears: PropTypes.string,
    isStarred: PropTypes.bool,
    meta: PropTypes.shape({
      status: PropTypes.string,
    }),
  }).isRequired,
  hideActions: PropTypes.bool,
};