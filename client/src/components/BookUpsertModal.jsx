import React from 'react';
import { X, Loader2 } from 'lucide-react';

const BookUpsertModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  collections,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl scale-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Register New Book</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Book Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Book Title
            </label>
            <input
              type="text"
              required
              value={formData.book_name}
              onChange={(e) => setFormData({ ...formData, book_name: e.target.value })}
              placeholder="e.g. Clean Code"
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Book Author Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Author
            </label>
            <input
              type="text"
              required
              value={formData.book_author}
              onChange={(e) => setFormData({ ...formData, book_author: e.target.value })}
              placeholder="e.g. Robert C. Martin"
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                required
                value={formData.book_cat_id}
                onChange={(e) => setFormData({ ...formData, book_cat_id: e.target.value })}
                className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat.cat_id} value={cat.cat_id}>
                    {cat.cat_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Collection
              </label>
              <select
                value={formData.book_collection_id}
                onChange={(e) => setFormData({ ...formData, book_collection_id: e.target.value })}
                className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">None (General)</option>
                {collections.map((col) => (
                  <option key={col.collection_id} value={col.collection_id}>
                    {col.collection_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Publisher Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Publisher
            </label>
            <input
              type="text"
              value={formData.book_publisher}
              onChange={(e) => setFormData({ ...formData, book_publisher: e.target.value })}
              placeholder="e.g. O'Reilly Media"
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Launch Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Launch Date
            </label>
            <input
              type="date"
              value={formData.book_launch_date}
              onChange={(e) => setFormData({ ...formData, book_launch_date: e.target.value })}
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Form Action buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-800/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Register Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookUpsertModal;
