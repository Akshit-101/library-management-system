import React from 'react';
import { User, Calendar, Edit2, Eye } from 'lucide-react';

const BookCard = ({ book, onEdit, onView }) => {
  // Helper to colorize category badges dynamically
  const getCategoryColor = (catId) => {
    const colors = [
      'from-blue-500/10 to-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'from-purple-500/10 to-indigo-500/10 text-indigo-400 border-indigo-500/20',
      'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20',
      'from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/20',
      'from-rose-500/10 to-pink-500/10 text-rose-400 border-rose-500/20'
    ];
    return colors[catId % colors.length] || colors[0];
  };

  const formattedDate = book.book_launch_date 
    ? new Date(book.book_launch_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
    : 'N/A';

  return (
    <div className="group relative bg-gray-900/20 hover:bg-gray-900/40 border border-gray-800/60 hover:border-violet-500/40 rounded-2xl p-5 shadow-lg hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Category and Collection Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(book.book_cat_id)}`}>
            {book.cat_name || `Category ${book.book_cat_id}`}
          </span>
          {book.collection_name && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800/60 text-gray-400 border border-gray-700/40">
              {book.collection_name}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2">
            {book.book_name}
          </h3>
        </div>

        {/* Meta details */}
        <div className="space-y-1.5 text-xs text-gray-400 pt-2">
          <div className="flex items-center">
            <User className="w-3.5 h-3.5 mr-2 text-gray-500" />
            <span>Publisher: <span className="text-gray-300 font-medium">{book.book_publisher || 'N/A'}</span></span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
            <span>Launched: <span className="text-gray-300 font-medium">{formattedDate}</span></span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-6">
        <span className="text-[10px] text-gray-500 font-mono">ID: #{book.book_id}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 bg-gray-950/60 hover:bg-violet-600/10 text-gray-400 hover:text-violet-400 rounded-xl border border-gray-800 hover:border-violet-500/30 transition-all cursor-pointer"
            title="Edit Title"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(book)}
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

export default BookCard;
