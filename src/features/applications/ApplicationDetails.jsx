export default function ApplicationDetails({meta}) {
  const {appliedDate, status} = meta || {};
  return(
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
      <h3 className="font-bold text-sm text-slate-900 border-b border-gray-100 pb-3">Application Details</h3>
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Applied</span>
          <span className="text-slate-800 font-bold text-sm">{appliedDate}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-semibold block mb-2">Current Status</span>
          <span className="bg-blue-50 text-blue-600 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-100/50 inline-block">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}