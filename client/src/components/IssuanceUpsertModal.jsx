import React from 'react';
import { X, Loader2 } from 'lucide-react';

const IssuanceUpsertModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingIssuance,
  formData,
  setFormData,
  books,
  members,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl scale-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">
            {editingIssuance ? 'Edit Transaction Status' : 'Issue New Book'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Create Mode: Select Book & Member */}
          {!editingIssuance ? (
            <>
              {/* Select Book */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Select Book
                </label>
                <select
                  required
                  value={formData.book_id}
                  onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="">-- Choose a Book --</option>
                  {books.map((b) => (
                    <option key={b.book_id} value={b.book_id}>
                      {b.book_name} (ID: #{b.book_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Member */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Borrowing Member
                </label>
                <select
                  required
                  value={formData.issuance_member}
                  onChange={(e) => setFormData({ ...formData, issuance_member: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="">-- Choose a Member --</option>
                  {members.map((m) => (
                    <option key={m.mem_id} value={m.mem_id}>
                      {m.mem_name} ({m.membership_status || 'Active'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Return Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Target Return Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.target_return_date}
                  onChange={(e) => setFormData({ ...formData, target_return_date: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Issued By */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Issued By (Staff Name)
                </label>
                <input
                  type="text"
                  required
                  value={formData.issued_by}
                  onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
                  placeholder="e.g. Staff_Sarah"
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode: Read-only Book and Member details */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Book Title</span>
                <p className="text-sm font-semibold text-white mt-1 bg-gray-950/30 border border-gray-900 rounded-xl px-3 py-2">
                  {editingIssuance.book_name}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Borrower</span>
                <p className="text-sm font-semibold text-white mt-1 bg-gray-950/30 border border-gray-900 rounded-xl px-3 py-2">
                  {editingIssuance.mem_name}
                </p>
              </div>

              {/* Select Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Issuance Status
                </label>
                <select
                  value={formData.issuance_status}
                  onChange={(e) => {
                    const status = e.target.value;
                    const returnDate = status === 'Returned' ? new Date().toISOString().split('T')[0] : '';
                    setFormData({
                      ...formData,
                      issuance_status: status,
                      actual_return_date: returnDate
                    });
                  }}
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="Issued">Issued</option>
                  <option value="Returned">Returned</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Actual Return Date (Only shown/required if status is Returned) */}
              {formData.issuance_status === 'Returned' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Actual Return Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.actual_return_date}
                    onChange={(e) => setFormData({ ...formData, actual_return_date: e.target.value })}
                    className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              )}
            </>
          )}

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
              ) : editingIssuance ? (
                'Update Status'
              ) : (
                'Issue Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuanceUpsertModal;
