import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '../utils/api';

// Subcomponents
import MemberStats from '../components/MemberStats';
import MemberCard from '../components/MemberCard';
import MemberDetailsModal from '../components/MemberDetailsModal';
import MemberUpsertModal from '../components/MemberUpsertModal';

const Members = () => {
  // Data States
  const [members, setMembers] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  // UI Control States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals States
  const [activeMemberDetails, setActiveMemberDetails] = useState(null);
  const [showUpsertModal, setShowUpsertModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    mem_name: '',
    mem_email: '',
    mem_phone: '',
    membership_status: 'Active'
  });

  // Fetch initial members
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/member');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch library members. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members dynamically in-memory
  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.mem_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mem_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mem_phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || String(member.membership_status) === String(statusFilter);

    return matchesSearch && matchesStatus;
  });

  // Open Add Member form
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      mem_name: '',
      mem_email: '',
      mem_phone: '',
      membership_status: 'Active'
    });
    setShowUpsertModal(true);
  };

  // Open Edit Member form
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      mem_name: member.mem_name,
      mem_email: member.mem_email,
      mem_phone: member.mem_phone,
      membership_status: member.membership_status || 'Active'
    });
    setShowUpsertModal(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mem_name.trim()) return;

    setSubmitting(true);
    setError(null);
    setAlertMsg(null);
    try {
      if (editingMember) {
        // Edit Mode: call PATCH route (updating all fields)
        const res = await api.patch(`/member/${editingMember.mem_id}`, {
          mem_name: formData.mem_name,
          mem_email: formData.mem_email,
          mem_phone: formData.mem_phone,
          membership_status: formData.membership_status
        });
        
        // Update local list state
        setMembers(prev => prev.map(m => m.mem_id === editingMember.mem_id ? res.data : m));
        showToast(`Member profile successfully updated for "${res.data.mem_name}"`);
      } else {
        // Add Mode: insert new member
        const res = await api.post('/member', {
          mem_name: formData.mem_name,
          mem_email: formData.mem_email,
          mem_phone: formData.mem_phone,
          membership_status: formData.membership_status
        });
        
        setMembers(prev => [res.data, ...prev]);
        showToast(`Member "${res.data.mem_name}" successfully registered!`);
      }
      setShowUpsertModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save the member. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Statistics
  const totalCount = members.length;
  const activeCount = members.filter(m => m.membership_status === 'Active').length;
  const expiredCount = members.filter(m => m.membership_status === 'Expired').length;

  return (
    <main className="min-h-screen bg-[#030712] pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Library Members
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage member registration profiles, subscription validity, and check details.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Member
          </button>
        </div>

        {/* Global Notifications */}
        {alertMsg && (
          <div className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="flex-1">{alertMsg}</span>
            <button onClick={() => setAlertMsg(null)} className="text-emerald-400/60 hover:text-emerald-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-rose-400/60 hover:text-rose-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <MemberStats
          totalMembers={totalCount}
          activeMembers={activeCount}
          expiredMembers={expiredCount}
          loading={loading}
        />

        {/* Search & Filter Controls */}
        <div className="bg-gray-900/20 border border-gray-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>

            {/* Reset Button */}
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 py-2 px-3 border border-dashed border-gray-800 hover:border-gray-600 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-gray-400 text-sm mt-3">Loading system members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-gray-900/10 border border-gray-800/40 rounded-3xl py-20 px-4 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-300">No members found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              We couldn't find any members matching your criteria. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.mem_id}
                member={member}
                onEdit={handleOpenEdit}
                onView={setActiveMemberDetails}
              />
            ))}
          </div>
        )}

        {/* Modal: View Details */}
        <MemberDetailsModal
          member={activeMemberDetails}
          onClose={() => setActiveMemberDetails(null)}
        />

        {/* Modal: Upsert Form (Create or Edit) */}
        <MemberUpsertModal
          isOpen={showUpsertModal}
          onClose={() => setShowUpsertModal(false)}
          onSubmit={handleSubmit}
          editingMember={editingMember}
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
        />

      </div>
    </main>
  );
};

export default Members;