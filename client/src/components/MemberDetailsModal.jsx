import React from 'react';
import { User, X } from 'lucide-react';

const MemberDetailsModal = ({ member, onClose }) => {
  if (!member) return null;

  const getStatusColor = (status) => {
    if (status === 'Active') {
      return 'bg-emerald-950/40 border-emerald-800/30 text-emerald-300';
    }
    return 'bg-rose-950/40 border-rose-800/30 text-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl scale-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-violet-400">
            <User className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">Member Profile</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Full Name</span>
            <h2 className="text-xl font-bold text-white mt-1 leading-snug">{member.mem_name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-800/80 py-4">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Member ID</span>
              <span className="text-sm font-mono text-white">#{member.mem_id}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Membership</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${getStatusColor(member.membership_status)}`}>
                {member.membership_status || 'Active'}
              </span>
            </div>
            <div className="mt-2 col-span-2">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Email Address</span>
              <span className="text-sm font-medium text-white">{member.mem_email}</span>
            </div>
            <div className="mt-2 col-span-2">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Phone Number</span>
              <span className="text-sm font-medium text-white">{member.mem_phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
