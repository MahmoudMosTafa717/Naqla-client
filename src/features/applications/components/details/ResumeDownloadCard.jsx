import { FileText, Download } from 'lucide-react';
import PropTypes from 'prop-types';

export default function ResumeDownloadCard({ resumeName, uploadedTime, resumeUrl }) {
  const handleDownload = () => {
    if (!resumeUrl) {
      alert("No resume URL available for download.");
      return;
    }
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_12px_rgba(15,23,42,0.03)] space-y-4">
      <h3 className="font-extrabold text-sm text-(--color-secondary-main) border-b border-slate-100 pb-3">Resume</h3>
      
      {/* Interactive download container with hover background shift */}
      <div className="border border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-4 text-center space-y-3 bg-slate-100/30 hover:bg-slate-150/40 transition-all duration-200 ease-in-out group">
        <FileText className="w-8 h-8 text-slate-400 group-hover:text-slate-500 transition-colors mx-auto" />
        <div>
          <p className="text-xs font-bold text-(--color-secondary-main) max-w-[180px] mx-auto truncate">{resumeName || "resume.pdf"}</p>
          <p className="text-[10px] text-(--color-secondary-muted) font-medium">{uploadedTime}</p>
        </div>
        <button 
          onClick={handleDownload}
          className="w-full border-2 border-[var(--color-primary-main)] text-[var(--color-primary-main)] font-bold text-xs py-2.5 rounded-[24px] hover:bg-[var(--color-primary-main)] hover:text-white transition-all duration-200 ease-in-out flex items-center justify-center gap-1.5 bg-white cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <Download className="w-3.5 h-3.5" /> Download Resume
        </button>
      </div>
    </div>
  );
}

ResumeDownloadCard.propTypes = {
  resumeName: PropTypes.string,
  uploadedTime: PropTypes.string,
  resumeUrl: PropTypes.string,
};