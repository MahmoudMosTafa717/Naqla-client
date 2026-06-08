import React, { useState } from 'react';
import { Star, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button.jsx';
import { useApplicationStore } from '../../../../store/applicationStore.js';
import { useAuthStore } from '../../../../store/authStore.js';

export default function InternalNotesSection({applicationId}) {
   const [note, setNote] = useState('');
   const [rating, setRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);
   const { addApplicationNote, updateApplicationNote, deleteApplicationNote, currentApplication } = useApplicationStore();

   // Edit note states
   const [editingNoteId, setEditingNoteId] = useState(null);
   const [editingText, setEditingText] = useState('');
   const [editingRating, setEditingRating] = useState(0);
   const [editingHoverRating, setEditingHoverRating] = useState(0);

   const { user } = useAuthStore();
   const currentUserId = user?.id || user?._id;

   const handleAddNotes = async () => {
      if (!note.trim()) return;
      try {
         await addApplicationNote(applicationId, {
            content: note,
            ratingScore: rating
         });
         setNote('');
         setRating(0);
      } catch (error) {
         console.error("Failed to save note:", error);
      }
   };

   const handleUpdateNote = async (noteId) => {
      if (!editingText.trim()) return;
      try {
         await updateApplicationNote(applicationId, noteId, {
            content: editingText,
            ratingScore: editingRating
         });
         setEditingNoteId(null);
         setEditingText('');
         setEditingRating(0);
      } catch (error) {
         console.error("Failed to update note:", error);
      }
   };

   const handleDeleteNote = async (noteId) => {
      if (!window.confirm("Are you sure you want to delete this note?")) return;
      try {
         await deleteApplicationNote(applicationId, noteId);
      } catch (error) {
         console.error("Failed to delete note:", error);
      }
   };

   return (
      <div className='bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm'>
         <h3 className="font-bold text-base text-slate-900 border-b border-gray-100 pb-3">Internal Notes & Rating</h3>
         <div className='flex flex-col space-y-5'>
            <div>
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Candidate Rating</label>
               <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-hidden transition-colors cursor-pointer"
                     >
                        <Star
                           className={`w-6 h-6 transition-colors ${
                              star <= (hoverRating || rating)
                                 ? 'fill-amber-400 text-amber-400'
                                 : 'text-gray-300 hover:text-amber-400'
                           }`}
                        />
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex flex-col space-y-2">
               <label htmlFor="notes" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
               <textarea
                  name="notes"
                  id="notes"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder='Add your notes about this candidate...'
                  className="w-full min-h-[100px] p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder:text-gray-400 resize-y"
               ></textarea>
            </div>

            <div className='pt-1'>
               <Button onClick={handleAddNotes} className="w-full sm:w-auto">Save Notes</Button>
            </div>
            
            {currentApplication?.notes && currentApplication.notes.length > 0 && (
               <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Notes</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                     {currentApplication.notes.slice().reverse().map((n, idx) => {
                        const isAuthor = n.authorId?.toString() === currentUserId?.toString();
                        const isEditing = editingNoteId === n._id;

                        return (
                           <div key={n._id || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm relative group">
                              {isEditing ? (
                                 <div className="space-y-3">
                                    <div className="flex items-center gap-1">
                                       {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                             key={star}
                                             type="button"
                                             onClick={() => setEditingRating(star)}
                                             onMouseEnter={() => setEditingHoverRating(star)}
                                             onMouseLeave={() => setEditingHoverRating(0)}
                                             className="p-0.5 focus:outline-hidden transition-colors cursor-pointer"
                                          >
                                             <Star
                                                className={`w-4 h-4 transition-colors ${
                                                   star <= (editingHoverRating || editingRating)
                                                      ? 'fill-amber-400 text-amber-400'
                                                      : 'text-gray-300 hover:text-amber-400'
                                                }`}
                                             />
                                          </button>
                                       ))}
                                    </div>
                                    <textarea
                                       value={editingText}
                                       onChange={(e) => setEditingText(e.target.value)}
                                       className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500/20 resize-y min-h-[60px]"
                                    />
                                    <div className="flex gap-2 justify-end">
                                       <button 
                                          onClick={() => setEditingNoteId(null)} 
                                          className="px-2.5 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-250 transition-colors font-semibold"
                                       >
                                          Cancel
                                       </button>
                                       <button 
                                          onClick={() => handleUpdateNote(n._id)} 
                                          className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                                       >
                                          Save
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <>
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                       <div className="flex items-center gap-2">
                                          <span>Recruiter Note</span>
                                          {n.ratingScore > 0 && (
                                             <div className="flex items-center text-amber-500">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                                                <span>{n.ratingScore}/5</span>
                                             </div>
                                          )}
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}</span>
                                          {isAuthor && (
                                             <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 ml-2">
                                                <button 
                                                   onClick={() => {
                                                      setEditingNoteId(n._id);
                                                      setEditingText(n.content);
                                                      setEditingRating(n.ratingScore || 0);
                                                   }}
                                                   className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer"
                                                   title="Edit Note"
                                                >
                                                   <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                   onClick={() => handleDeleteNote(n._id)}
                                                   className="text-gray-400 hover:text-red-650 transition-colors p-0.5 cursor-pointer"
                                                   title="Delete Note"
                                                >
                                                   <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed">{n.content}</p>
                                 </>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}