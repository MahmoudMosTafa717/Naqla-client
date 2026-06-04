import { MoreVertical, Mail, Phone, Calendar, AlertTriangle, Eye, Star } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { AIScoreBadge } from '../../../components/ui/AIScoreBadge.jsx';
import { useNavigate } from 'react-router-dom';

function CandidateCard({candidateDate}) {
  const {name, role , id, email, phone, appliedAt, score, skills,  location, experience , isStarred, redFlags, initials} = candidateDate || {};
  const navigate = useNavigate();
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
    {...attributes}
    {...listeners}
    className='bg-white rounded-lg border border-gray-100 p-4  shadow-sm hover:shadow-md transition-all relative'>
      {/* Header */}
      <div className='flex justify-between items-start mb-3 gap-2'>
        <div className='flex gap-3 items-center min-w-0'>
         <div className='w-10 h-10 shrink-0 bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal)  rounded-full text-white flex items-center justify-center font-medium text-sm '>
           {initials || 'AN'}
         </div>
         <div className='min-w-0'>
          <h4 className='font-semibold text-gray-900 flex items-center gap-1 text-sm'>
            {name || 'Ahmed Nabil'}
            {isStarred && <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0' />}
          </h4>
          <p className='font-medium text-gray-400 text-sm'>
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
      <div className='space-y-1.5 text-xs text-gray-500 font-medium mb-4 mt-2'>
        <div className='flex items-center gap-2'>
          <Mail className="w-3.5 h-3.5 text-gray-400" /> <span>{email || 'example@gmail.com'}</span>
        </div>
         <div className='flex items-center gap-2'>
          <Phone className="w-3.5 h-3.5 text-gray-400" /> <span>{phone || '+201034567890'}</span>
        </div>
         <div className='flex items-center gap-2'>
          <Calendar className="w-3.5 h-3.5 text-gray-400" /> <span>{appliedAt ? (isNaN(Date.parse(appliedAt)) ? appliedAt : `Applied ${new Date(appliedAt).toLocaleDateString()}`) : 'Applied 2026-05-01'}</span>
        </div>
      </div>
      {/*Skills */}
      <div className='flex gap-1.5 flex-wrap mb-4'>
        {skills && skills.slice(0,3).map((skill, idx) => (
          <span 
            key={idx} 
            className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200/50"
          >
            {skill}
          </span>
        ))}
      </div>

      {/*badges */}
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="bg-blue-50 text-blue-600 border border-blue-500 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {experience ? `${experience} years` : '2 years'}
        </span>
        <span className="bg-gray-100 text-gray-600 border border-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {location || 'Cairo'}
        </span>
      </div>

      {/*actions*/}
      <div className='flex justify-between items-center pt-2 gap-2'>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/CandidateDetails'); }} 
          className='flex-1 border border-[var(--color-brand-blue)] cursor-pointer text-[var(--color-brand-blue)] rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[var(--color-brand-blue)] hover:text-white transition-colors flex items-center justify-center gap-1.5'
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}
export default CandidateCard;