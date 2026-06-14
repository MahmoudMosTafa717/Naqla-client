import { useState } from 'react';
import { MoreVertical, Mail, Phone, Calendar, AlertTriangle, Eye, Star, GripVertical, Copy } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { AIScoreBadge } from '../../../components/ui/AIScoreBadge.jsx';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '../../../store/applicationStore.js';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

function CandidateCard({candidateDate}) {
  const {name, role , id, email, phone, appliedAt, score, skills,  location, experience , isStarred, redFlags, initials} = candidateDate || {};
  const navigate = useNavigate();
  const { addApplicationNote } = useApplicationStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleStar = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newRating = isStarred ? 1 : 5;
      await addApplicationNote(id, {
        content: isStarred ? "Removed star rating" : "Starred candidate",
        ratingScore: newRating
      });
    } catch (err) {
      toast.error("Failed to update candidate star status. Please check your connection.");
      console.error("Failed to toggle star rating:", err);
    }
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });
  
  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    zIndex: isDragging ? 50 : 1,
  } : undefined

  return (
    <div 
    ref={setNodeRef}
    style={dragStyle}
    className='bg-white rounded-xl border border-(--color-border) p-4.5 shadow-micro hover:shadow-hover hover:border-blue-200/50 transition-all duration-300 relative animate-settle'>
      {/* Header */}
      <div className='flex justify-between items-start mb-3 gap-2'>
        <div className='flex gap-2.5 items-center min-w-0'>
          {/* Grip drag handle */}
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-slate-350 hover:text-slate-500 p-1 hover:bg-slate-50 rounded transition-colors shrink-0"
            title="Drag candidate card"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <div className='w-10 h-10 shrink-0 bg-gradient-to-br from-[var(--color-primary-main)] to-[#3b82f6] rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm'>
           {initials || 'AN'}
         </div>
         <div className='min-w-0 flex-1'>
          <h4 className='font-extrabold text-(--color-secondary-main) flex items-center gap-1.5 text-sm tracking-tight'>
            <span className="truncate">{name || 'Ahmed Nabil'}</span>
            <button 
              onClick={handleToggleStar}
              className="focus:outline-none p-0.5 rounded hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              title={isStarred ? "Unstar candidate" : "Star candidate"}
            >
              <Star className={`w-3.5 h-3.5 shrink-0 transition-all ${
                isStarred 
                  ? 'fill-amber-400 text-amber-400 scale-110' 
                  : 'text-slate-300 hover:text-amber-500 hover:scale-110'
              }`} />
            </button>
          </h4>
          <p className='font-medium text-(--color-secondary-muted) text-xs mt-0.5'>
            {role || 'Software Engineer'}
            </p>
         </div>
        </div>

        {/*AI match Score */}
        <AIScoreBadge score={score || 79} size="sm" />
      </div>

      {redFlags && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-2.5 flex gap-2 items-start text-xs text-red-600 animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Red Flags</span>
            <span className="text-gray-600">{redFlags}</span>
          </div>
        </div>
      )}
      {/* Contact Info */}
      <div className='space-y-1.5 text-xs text-(--color-secondary-muted) font-medium mb-4 mt-3.5'>
        <div className='flex items-center gap-2'>
          <Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{email || 'example@gmail.com'}</span>
        </div>
         <div className='flex items-center gap-2'>
          <Phone className="w-3.5 h-3.5 text-slate-400" /> <span>{phone || '+201034567890'}</span>
         </div>
         <div className='flex items-center gap-2'>
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> <span>{appliedAt ? (isNaN(Date.parse(appliedAt)) ? appliedAt : `Applied ${new Date(appliedAt).toLocaleDateString()}`) : 'Applied 2026-05-01'}</span>
         </div>
      </div>
      {/*Skills */}
      <div className='flex gap-1.5 flex-wrap mb-4'>
        {skills && skills.slice(0,3).map((skill, idx) => (
          <span 
            key={idx} 
            className="bg-slate-100/60 text-(--color-secondary-muted) text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200/20"
          >
            {skill}
          </span>
        ))}
      </div>

      {/*badges */}
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="bg-[var(--color-bg-light-tint)] text-[var(--color-primary-main)] border border-blue-200/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {experience ? `${experience} years` : '2 years'}
        </span>
        <span className="bg-slate-50 text-(--color-secondary-muted) border border-(--color-border) text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {location || 'Cairo'}
        </span>
      </div>

      <div className='flex justify-between items-center pt-2 gap-2 relative'>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/candidateProfile/${id}`); }} 
          className='flex-1 border border-[var(--color-primary-main)] cursor-pointer text-[var(--color-primary-main)] rounded-[24px] px-3.5 py-1.5 text-xs font-bold hover:bg-[var(--color-primary-main)] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs'
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
          className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer shrink-0 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
            />
            <div className="absolute right-0 bottom-10 z-20 w-40 bg-white rounded-xl border border-gray-100 shadow-lg p-1 space-y-0.5 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  window.location.href = `mailto:${email}?subject=Regarding Your Job Application`;
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Send Email
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  window.location.href = `tel:${phone}`;
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-gray-400" /> Call Candidate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  navigator.clipboard.writeText(email);
                  toast.success("Email copied to clipboard!");
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" /> Copy Email
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

CandidateCard.propTypes = {
  candidateDate: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    initials: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    appliedAt: PropTypes.string,
    hiredAt: PropTypes.string,
    score: PropTypes.number,
    skills: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    experience: PropTypes.number,
    redFlags: PropTypes.string,
    isStarred: PropTypes.bool,
  }).isRequired,
};

export default CandidateCard;