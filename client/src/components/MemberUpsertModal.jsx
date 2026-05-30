import React from 'react';
import { X, Loader2 } from 'lucide-react';

const MemberUpsertModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingMember,
  formData,
  setFormData,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl scale-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">
            {editingMember ? 'Edit Member Profile' : 'Register New Member'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Member Name (Always editable) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.mem_name}
              onChange={(e) => setFormData({ ...formData, mem_name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.mem_email}
              onChange={(e) => setFormData({ ...formData, mem_email: e.target.value })}
              placeholder="e.g. john@example.com"
              className="w-full bg-gray-950/60 border border-gray-800 text-white focus:border-violet-500 rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.mem_phone}
              onChange={(e) => setFormData({ ...formData, mem_phone: e.target.value })}
              placeholder="e.g. +1555123456"
              className="w-full bg-gray-950/60 border border-gray-800 text-white focus:border-violet-500 rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Membership Status (Active/Expired) */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Membership Status
            </label>
            <select
              value={formData.membership_status}
              onChange={(e) => setFormData({ ...formData, membership_status: e.target.value })}
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
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
              ) : editingMember ? (
                'Save Changes'
              ) : (
                'Register Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberUpsertModal;
