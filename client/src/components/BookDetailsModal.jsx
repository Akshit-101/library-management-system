import React from 'react';
import { BookOpen, X } from 'lucide-react';

const BookDetailsModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl scale-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-violet-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">Book Specifications</span>
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
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Title</span>
            <h2 className="text-xl font-bold text-white mt-1 leading-snug">{book.book_name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-800/80 py-4">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Book ID</span>
              <span className="text-sm font-mono text-white">#{book.book_id}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Category</span>
              <span className="text-sm font-semibold text-white">{book.cat_name || 'N/A'}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Author</span>
              <span className="text-sm font-medium text-white">{book.book_author || 'N/A'}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Publisher</span>
              <span className="text-sm font-medium text-white">{book.book_publisher || 'N/A'}</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Launch Date</span>
              <span className="text-sm font-medium text-white">
                {book.book_launch_date ? new Date(book.book_launch_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Storage Collection</span>
            <span className="text-sm font-semibold text-violet-300 inline-block bg-violet-950/40 border border-violet-800/30 px-3 py-1 rounded-xl mt-1">
              {book.collection_name || 'General Inventory'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
