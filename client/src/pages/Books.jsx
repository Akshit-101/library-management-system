import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '../utils/api';

// Subcomponents
import BookStats from '../components/BookStats';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';
import BookUpsertModal from '../components/BookUpsertModal';

const Books = () => {
  // Data States
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  // UI Control States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  
  // Modals States
  const [activeBookDetails, setActiveBookDetails] = useState(null);
  const [showUpsertModal, setShowUpsertModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    book_name: '',
    book_author: '',
    book_cat_id: '',
    book_collection_id: '',
    book_launch_date: '',
    book_publisher: ''
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksRes, catsRes, colsRes] = await Promise.all([
        api.get('/book'),
        api.get('/book/categories'),
        api.get('/book/collections')
      ]);
      setBooks(booksRes.data);
      setCategories(catsRes.data);
      setCollections(colsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch library resources. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter books dynamically in-memory
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.book_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.book_author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.book_publisher?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || String(book.book_cat_id) === String(selectedCategory);
    const matchesCollection = selectedCollection === '' || String(book.book_collection_id) === String(selectedCollection);

    return matchesSearch && matchesCategory && matchesCollection;
  });

  // Open Add Book form
  const handleOpenAdd = () => {
    setFormData({
      book_name: '',
      book_author: '',
      book_cat_id: categories[0]?.cat_id || '',
      book_collection_id: collections[0]?.collection_id || '',
      book_launch_date: new Date().toISOString().split('T')[0],
      book_publisher: ''
    });
    setShowUpsertModal(true);
  };

  // Handle Form Submission (Add only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.book_name.trim() || !formData.book_author.trim()) return;

    setSubmitting(true);
    setAlertMsg(null);
    try {
      // Add Mode: insert new book
      const res = await api.post('/book', {
        book_name: formData.book_name,
        book_author: formData.book_author,
        book_cat_id: parseInt(formData.book_cat_id),
        book_collection_id: formData.book_collection_id ? parseInt(formData.book_collection_id) : null,
        book_launch_date: formData.book_launch_date ? formData.book_launch_date : null,
        book_publisher: formData.book_publisher
      });
      
      setBooks(prev => [res.data, ...prev]);
      showToast(`Book "${res.data.book_name}" successfully added!`);
      setShowUpsertModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save the book. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Statistic details
  const uniquePublishersCount = new Set(books.map(b => b.book_publisher).filter(Boolean)).size;

  return (
    <main className="min-h-screen bg-[#030712] pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Library Catalog
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Search, filter, view details, and manage the system's literary catalog.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
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
        <BookStats
          totalBooks={books.length}
          categoriesCount={categories.length}
          publishersCount={uniquePublishersCount}
          loading={loading}
        />

        {/* Search & Filter Controls */}
        <div className="bg-gray-900/20 border border-gray-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by book name or publisher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950/60 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.cat_id} value={cat.cat_id}>
                  {cat.cat_name}
                </option>
              ))}
            </select>

            {/* Collection Select */}
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors w-full sm:w-auto"
            >
              <option value="">All Collections</option>
              {collections.map((col) => (
                <option key={col.collection_id} value={col.collection_id}>
                  {col.collection_name}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            {(searchTerm || selectedCategory || selectedCollection) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCollection('');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 py-2 px-3 border border-dashed border-gray-800 hover:border-gray-600 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Books Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-gray-400 text-sm mt-3">Loading catalog items...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-gray-900/10 border border-gray-800/40 rounded-3xl py-20 px-4 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-300">No books found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              We couldn't find any books matching your criteria. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.book_id}
                book={book}
                onView={setActiveBookDetails}
              />
            ))}
          </div>
        )}

        {/* Modal: View Details */}
        <BookDetailsModal
          book={activeBookDetails}
          onClose={() => setActiveBookDetails(null)}
        />

        {/* Modal: Upsert Form (Create) */}
        <BookUpsertModal
          isOpen={showUpsertModal}
          onClose={() => setShowUpsertModal(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          collections={collections}
          submitting={submitting}
        />

      </div>
    </main>
  );
};

export default Books;