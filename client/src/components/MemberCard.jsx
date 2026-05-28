import React from 'react';
import { Mail, Phone, Edit2, Eye } from 'lucide-react';

const MemberCard = ({ member, onEdit, onView }) => {
  const getAvatarBgColor = (name) => {
    const charCode = name ? name.charCodeAt(0) : 0;
    const colors = [
      'bg-violet-600/20 text-violet-400 border-violet-500/30',
      'bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/30',
      'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
      'bg-amber-600/20 text-amber-400 border-amber-500/30',
      'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
    ];
    return colors[charCode % colors.length];
  };

  const getStatusColor = (status) => {
    if (status === 'Active') {
      return 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20';
    }
    return 'from-rose-500/10 to-pink-500/10 text-rose-400 border-rose-500/20';
  };

  const nameInitials = member.mem_name
    ? member.mem_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="group relative bg-gray-900/20 hover:bg-gray-900/40 border border-gray-800/60 hover:border-violet-500/40 rounded-2xl p-5 shadow-lg hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header: Avatar + Status */}
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${getAvatarBgColor(member.mem_name)}`}>
            {nameInitials}
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(member.membership_status)}`}>
            {member.membership_status || 'Active'}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
            {member.mem_name}
          </h3>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-gray-400 pt-1">
          <div className="flex items-center">
            <Mail className="w-3.5 h-3.5 mr-2 text-gray-500" />
            <span className="truncate">{member.mem_email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
            <span>{member.mem_phone}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-6">
        <span className="text-[10px] text-gray-500 font-mono">ID: #{member.mem_id}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(member)}
            className="p-2 bg-gray-950/60 hover:bg-violet-600/10 text-gray-400 hover:text-violet-400 rounded-xl border border-gray-800 hover:border-violet-500/30 transition-all cursor-pointer"
            title="Edit Member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(member)}
            className="p-2 bg-gray-950/60 hover:bg-fuchsia-600/10 text-gray-400 hover:text-fuchsia-400 rounded-xl border border-gray-800 hover:border-fuchsia-500/30 transition-all cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
