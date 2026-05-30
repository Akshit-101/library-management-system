import React from 'react';
import { User, Calendar, CheckSquare, Edit3 } from 'lucide-react';

const IssuanceCard = ({ issuance, onReturn, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Returned':
        return 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20';
      case 'Issued':
        return 'from-blue-500/10 to-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Overdue':
        return 'from-rose-500/10 to-pink-500/10 text-rose-400 border-rose-500/20';
      case 'Lost':
        return 'from-gray-500/10 to-slate-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'from-gray-500/10 to-slate-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isPending = issuance.issuance_status === 'Issued' || issuance.issuance_status === 'Overdue';

  return (
    <div className="group relative bg-gray-900/20 hover:bg-gray-900/40 border border-gray-800/60 hover:border-violet-500/40 rounded-2xl p-5 shadow-lg hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header: ID + Status */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">ID: #{issuance.issuance_id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(issuance.issuance_status)}`}>
            {issuance.issuance_status}
          </span>
        </div>

        {/* Book Title */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2">
            {issuance.book_name}
          </h3>
        </div>

        {/* Member Name */}
        <div className="flex items-center text-sm text-gray-300">
          <User className="w-4 h-4 mr-2 text-violet-400" />
          <span className="font-medium">{issuance.mem_name}</span>
        </div>

        {/* Dates & Details */}
        <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5 text-gray-500" /> Issued:</span>
            <span className="text-gray-300 font-mono">{formatDate(issuance.issuance_date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5 text-gray-500" /> Target Return:</span>
            <span className="text-gray-300 font-mono">{formatDate(issuance.target_return_date)}</span>
          </div>
          {issuance.actual_return_date && (
            <div className="flex items-center justify-between">
              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5 text-emerald-500" /> Returned:</span>
              <span className="text-emerald-400 font-mono">{formatDate(issuance.actual_return_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-end space-x-2 pt-4 mt-6 border-t border-gray-800/60">
        {isPending && (
          <>
            <button
              onClick={() => onEdit(issuance)}
              className="p-2 bg-gray-950/60 hover:bg-violet-600/10 text-gray-400 hover:text-violet-400 rounded-xl border border-gray-800 hover:border-violet-500/30 transition-all cursor-pointer"
              title="Edit Status"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onReturn(issuance)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/20 hover:border-emerald-500 transition-all text-xs font-semibold cursor-pointer"
              title="Mark as Returned"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Return Book
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IssuanceCard;
