import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus, Search, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '../utils/api';

// Subcomponents
import IssuanceStats from '../components/IssuanceStats';
import IssuanceCard from '../components/IssuanceCard';
import IssuanceUpsertModal from '../components/IssuanceUpsertModal';

const Issuances = () => {
  // Data States
  const [issuances, setIssuances] = useState([]);
  const [books, setBooks] = useState([]);
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
  const [showUpsertModal, setShowUpsertModal] = useState(false);
  const [editingIssuance, setEditingIssuance] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    book_id: '',
    issuance_member: '',
    target_return_date: '',
    issued_by: '',
    issuance_status: 'Issued',
    actual_return_date: ''
  });

  // Fetch initial data sources
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [issuancesRes, booksRes, membersRes] = await Promise.all([
        api.get('/issuance'),
        api.get('/book'),
        api.get('/member')
      ]);
      setIssuances(issuancesRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system data. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter issuances dynamically in-memory
  const filteredIssuances = issuances.filter((item) => {
    const matchesSearch = 
      item.book_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mem_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || String(item.issuance_status) === String(statusFilter);

    return matchesSearch && matchesStatus;
  });

  // Open Checkout form
  const handleOpenAdd = () => {
    // Get books currently checked out or lost
    const activeBookIds = new Set(
      issuances
        .filter(i => i.issuance_status === 'Issued' || i.issuance_status === 'Overdue' || i.issuance_status === 'Lost')
        .map(i => i.book_id)
    );
    const availableBooks = books.filter(b => !activeBookIds.has(b.book_id));
    const activeMembers = members.filter(m => m.membership_status === 'Active');

    setEditingIssuance(null);
    setFormData({
      book_id: availableBooks[0]?.book_id || '',
      issuance_member: activeMembers[0]?.mem_id || '',
      target_return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days loan
      issued_by: '',
      issuance_status: 'Issued',
      actual_return_date: ''
    });
    setShowUpsertModal(true);
  };

  // Open Edit Status form
  const handleOpenEdit = (item) => {
    setEditingIssuance(item);
    setFormData({
      book_id: item.book_id,
      issuance_member: item.issuance_member,
      target_return_date: item.target_return_date ? item.target_return_date.split('T')[0] : '',
      issued_by: item.issued_by,
      issuance_status: item.issuance_status,
      actual_return_date: item.actual_return_date ? item.actual_return_date.split('T')[0] : ''
    });
    setShowUpsertModal(true);
  };

  // Quick return handler directly from card
  const handleQuickReturn = async (item) => {
    setError(null);
    setAlertMsg(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.put(`/issuance/${item.issuance_id}`, {
        issuance_status: 'Returned',
        actual_return_date: today
      });
      
      // Update local state dynamically
      setIssuances(prev => prev.map(i => i.issuance_id === item.issuance_id ? res.data : i));
      showToast(`Book "${item.book_name}" returned by "${item.mem_name}" successfully!`);
    } catch (err) {
      console.error(err);
      setError('Failed to check in book. Please try again.');
    }
  };

  // Handle Form Submission (Add checkout or Edit status/return)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setAlertMsg(null);
    try {
      if (editingIssuance) {
        // Edit Mode: call PUT route to save status and return date
        const res = await api.put(`/issuance/${editingIssuance.issuance_id}`, {
          issuance_status: formData.issuance_status,
          actual_return_date: formData.issuance_status === 'Returned' ? formData.actual_return_date : null
        });
        
        setIssuances(prev => prev.map(i => i.issuance_id === editingIssuance.issuance_id ? res.data : i));
        showToast(`Transaction details updated successfully!`);
      } else {
        // Add Mode: checkout new book
        const res = await api.post('/issuance', {
          book_id: parseInt(formData.book_id),
          issuance_member: parseInt(formData.issuance_member),
          target_return_date: `${formData.target_return_date}T00:00:00.000Z`,
          issued_by: formData.issued_by
        });
        
        setIssuances(prev => [res.data, ...prev]);
        showToast(`Checkout successfully registered!`);
      }
      setShowUpsertModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to record checkout. Ensure book and member are selected.');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Stats Counters
  const totalCount = issuances.length;
  const activeCount = issuances.filter(i => i.issuance_status === 'Issued' || i.issuance_status === 'Overdue').length;
  const returnedCount = issuances.filter(i => i.issuance_status === 'Returned').length;

  return (
    <main className="min-h-screen bg-[#030712] pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Book Issuances
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Checkout books, track return timelines, and manage lending records.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Issue Book
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
        <IssuanceStats
          activeCount={activeCount}
          returnedCount={returnedCount}
          loading={loading}
        />

        {/* Search & Filter Controls */}
        <div className="bg-gray-900/20 border border-gray-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by book or member name..."
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
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
              <option value="Lost">Lost</option>
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
            <p className="text-gray-400 text-sm mt-3">Loading lending transactions...</p>
          </div>
        ) : filteredIssuances.length === 0 ? (
          <div className="bg-gray-900/10 border border-gray-800/40 rounded-3xl py-20 px-4 text-center">
            <ArrowLeftRight className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-300">No transactions found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              We couldn't find any issuances matching your criteria. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssuances.map((item) => (
              <IssuanceCard
                key={item.issuance_id}
                issuance={item}
                onReturn={handleQuickReturn}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        )}

        {/* Modal: Upsert Form (Create checkout or edit status) */}
        <IssuanceUpsertModal
          isOpen={showUpsertModal}
          onClose={() => setShowUpsertModal(false)}
          onSubmit={handleSubmit}
          editingIssuance={editingIssuance}
          formData={formData}
          setFormData={setFormData}
          books={books.filter(b => {
            const activeBookIds = new Set(
              issuances
                .filter(i => i.issuance_status === 'Issued' || i.issuance_status === 'Overdue' || i.issuance_status === 'Lost')
                .map(i => i.book_id)
            );
            return !activeBookIds.has(b.book_id);
          })}
          members={members.filter(m => m.membership_status === 'Active')}
          submitting={submitting}
        />

      </div>
    </main>
  );
};

export default Issuances;