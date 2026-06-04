import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../../../components/ui/Button.jsx';

export default function InternalNotesSection() {
   const [note, setNote] = useState('');
   const [rating, setRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);

   const handleSave = () => {
      console.log('Saved note:', note, 'with rating:', rating);
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
               <Button onClick={handleSave} className="w-full sm:w-auto">Save Notes</Button>
            </div>
         </div>
      </div>
   );
}