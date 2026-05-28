import React from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';

const MemberStats = ({ totalMembers, activeMembers, expiredMembers, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Members */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Members</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : totalMembers}</h2>
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Members</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : activeMembers}</h2>
        </div>
      </div>

      {/* Expired Members */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-rose-600/10 rounded-xl text-rose-400">
          <UserX className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Expired Members</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : expiredMembers}</h2>
        </div>
      </div>
    </div>
  );
};

export default MemberStats;
