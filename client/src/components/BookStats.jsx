import React from 'react';
import { BookOpen, Folder, User } from 'lucide-react';

const BookStats = ({ totalBooks, categoriesCount, publishersCount, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Books */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Books</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : totalBooks}</h2>
        </div>
      </div>

      {/* Active Categories */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-fuchsia-600/10 rounded-xl text-fuchsia-400">
          <Folder className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Categories</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : categoriesCount}</h2>
        </div>
      </div>

      {/* Publishers */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
        <div className="p-3 bg-cyan-600/10 rounded-xl text-cyan-400">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Publishers</p>
          <h2 className="text-2xl font-bold text-white mt-1">{loading ? '...' : publishersCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default BookStats;
