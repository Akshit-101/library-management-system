import React from 'react';
import { ArrowLeftRight, BookOpen, CheckCircle } from 'lucide-react';

const IssuanceStats = ({ activeCount, returnedCount, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Active Loans */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-fuchsia-600/10 rounded-xl text-fuchsia-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Loans</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : activeCount}</h2>
        </div>
      </div>

      {/* Returned Items */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Returned Items</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : returnedCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default IssuanceStats;
