import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, Loader2, ArrowRight, Award } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Safe helper to get local YYYY-MM-DD string
  const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // Data States
  const [stats, setStats] = useState({
    booksCount: 0,
    membersCount: 0,
    activeLoans: 0,
    overdueLoans: 0
  });

  const [outstandingList, setOutstandingList] = useState([]);
  const [topBorrowedList, setTopBorrowedList] = useState([]);
  const [neverBorrowedList, setNeverBorrowedList] = useState([]);
  
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksRes, membersRes, outstandingRes, topBorrowedRes, neverBorrowedRes] = await Promise.all([
        api.get('/book'),
        api.get('/member'),
        api.get(`/task/outstanding?date=${selectedDate}`),
        api.get('/task/top-borrowed'),
        api.get('/task/never-borrowed')
      ]);

      const outstanding = outstandingRes.data;
      const overdue = outstanding.filter(o => {
        const targetClean = o.target_return_date ? o.target_return_date.split('T')[0] : '';
        return targetClean < selectedDate;
      });

      setStats({
        booksCount: booksRes.data.length,
        membersCount: membersRes.data.length,
        activeLoans: outstanding.length,
        overdueLoans: overdue.length
      });

      setOutstandingList(outstanding);
      setTopBorrowedList(topBorrowedRes.data);
      setNeverBorrowedList(neverBorrowedRes.data);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please ensure system is live.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = (targetDateStr) => {
    const targetClean = targetDateStr ? targetDateStr.split('T')[0] : '';
    return targetClean < selectedDate;
  };

  const pendingList = outstandingList.filter(item => {
    const cleanTarget = item.target_return_date ? item.target_return_date.split('T')[0] : '';
    return cleanTarget === selectedDate;
  });

  return (
    <main className="min-h-screen bg-[#030712] pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              System Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time library statistics, catalog metrics, and lending insights.
            </p>
          </div>

          {/* Given Day Date Picker */}
          <div className="flex items-center space-x-3 bg-gray-900/60 border border-gray-800 rounded-2xl px-4 py-2 w-fit">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Given Day:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-950/60 border border-gray-800 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm animate-in fade-in duration-300">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-gray-400 text-sm mt-3">Loading dashboard insights...</p>
          </div>
        ) : (
          <>
            {/* Stats Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Books */}
              <div 
                onClick={() => navigate('/books')}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4 hover:border-violet-500/40 hover:bg-gray-900/60 cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Catalog Books</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{stats.booksCount}</h2>
                </div>
              </div>

              {/* Total Members */}
              <div 
                onClick={() => navigate('/members')}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4 hover:border-fuchsia-500/40 hover:bg-gray-900/60 cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-fuchsia-600/10 rounded-xl text-fuchsia-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Registered Members</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{stats.membersCount}</h2>
                </div>
              </div>

              {/* Active Loans */}
              <div 
                onClick={() => navigate('/issuances')}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4 hover:border-cyan-500/40 hover:bg-gray-900/60 cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-cyan-600/10 rounded-xl text-cyan-400">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Loans</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{stats.activeLoans}</h2>
                </div>
              </div>

              {/* Overdue Loans */}
              <div 
                onClick={() => navigate('/issuances')}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-5 shadow-xl flex items-center space-x-4 hover:border-rose-500/40 hover:bg-gray-900/60 cursor-pointer transition-all duration-200"
              >
                <div className="p-3 bg-rose-600/10 rounded-xl text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Overdue Items</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{stats.overdueLoans}</h2>
                </div>
              </div>
            </div>

            {/* Dashboard Sub-content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Tabbed Insight Panel */}
              <div className="lg:col-span-2 bg-gray-900/20 border border-gray-800/60 rounded-3xl p-6 flex flex-col justify-between min-h-[400px]">
                <div>
                  {/* Tab Selector Buttons */}
                  <div className="flex border-b border-gray-800/60 pb-3 mb-6 space-x-4 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`pb-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === 'pending'
                          ? 'border-cyan-500 text-cyan-400'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Pending Returns
                    </button>
                    <button
                      onClick={() => setActiveTab('outstanding')}
                      className={`pb-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === 'outstanding'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Outstanding (Point-in-Time)
                    </button>
                    <button
                      onClick={() => setActiveTab('top-borrowed')}
                      className={`pb-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === 'top-borrowed'
                          ? 'border-violet-500 text-violet-400'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Top 10 Most Borrowed
                    </button>
                    <button
                      onClick={() => setActiveTab('never-borrowed')}
                      className={`pb-2 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === 'never-borrowed'
                          ? 'border-fuchsia-500 text-fuchsia-400'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      Never Borrowed
                    </button>
                  </div>

                  {/* Tab content rendering */}
                  <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
                    {activeTab === 'pending' && (
                      pendingList.length === 0 ? (
                        <p className="text-sm text-gray-500 py-10 text-center">No books pending return on this day.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-800/60 pb-2">
                              <th className="pb-3 font-semibold uppercase tracking-wider">Book Name</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Author</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Borrower</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Issued Date</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Target Return</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingList.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-800/20 hover:bg-gray-800/10">
                                <td className="py-3 font-bold text-white max-w-xs truncate pr-3">{item.book_name}</td>
                                <td className="py-3 text-gray-300 pr-3">{item.author || 'N/A'}</td>
                                <td className="py-3 font-medium text-cyan-400 pr-3">{item.member_name}</td>
                                <td className="py-3 text-gray-400 font-mono pr-3">{formatDate(item.issued_date)}</td>
                                <td className={`py-3 font-mono ${isOverdue(item.target_return_date) ? 'text-rose-400 font-bold' : 'text-gray-400'}`}>
                                  {formatDate(item.target_return_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )}

                    {activeTab === 'outstanding' && (
                      outstandingList.length === 0 ? (
                        <p className="text-sm text-gray-500 py-10 text-center">No outstanding loans right now.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-800/60 pb-2">
                              <th className="pb-3 font-semibold uppercase tracking-wider">Book Name</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Author</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Borrower</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Issued Date</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Target Return</th>
                            </tr>
                          </thead>
                          <tbody>
                            {outstandingList.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-800/20 hover:bg-gray-800/10">
                                <td className="py-3 font-bold text-white max-w-xs truncate pr-3">{item.book_name}</td>
                                <td className="py-3 text-gray-300 pr-3">{item.author || 'N/A'}</td>
                                <td className="py-3 font-medium text-cyan-400 pr-3">{item.member_name}</td>
                                <td className="py-3 text-gray-400 font-mono pr-3">{formatDate(item.issued_date)}</td>
                                <td className={`py-3 font-mono ${isOverdue(item.target_return_date) ? 'text-rose-400 font-bold' : 'text-gray-400'}`}>
                                  {formatDate(item.target_return_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )}

                    {activeTab === 'top-borrowed' && (
                      topBorrowedList.length === 0 ? (
                        <p className="text-sm text-gray-500 py-10 text-center">No borrow stats recorded.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-800/60 pb-2">
                              <th className="pb-3 font-semibold uppercase tracking-wider w-16">Rank</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Book Name</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider text-center">Times Borrowed</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider text-center">Unique Borrowers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topBorrowedList.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-800/20 hover:bg-gray-800/10">
                                <td className="py-3 font-mono font-bold text-violet-400 flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5" /> #{idx + 1}
                                </td>
                                <td className="py-3 font-bold text-white max-w-xs truncate pr-3">{item.book_name}</td>
                                <td className="py-3 text-center pr-3">
                                  <span className="bg-violet-950/50 border border-violet-800/40 px-2 py-0.5 rounded-md font-bold text-violet-300">
                                    {item.borrow_count}
                                  </span>
                                </td>
                                <td className="py-3 text-center text-gray-300 pr-3">{item.unique_borrowers}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )}

                    {activeTab === 'never-borrowed' && (
                      neverBorrowedList.length === 0 ? (
                        <p className="text-sm text-gray-500 py-10 text-center">All catalog books have been borrowed at least once.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-800/60 pb-2">
                              <th className="pb-3 font-semibold uppercase tracking-wider">Book Name</th>
                              <th className="pb-3 font-semibold uppercase tracking-wider">Author</th>
                            </tr>
                          </thead>
                          <tbody>
                            {neverBorrowedList.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-800/20 hover:bg-gray-800/10">
                                <td className="py-3 font-bold text-white max-w-xs truncate pr-3">{item.book_name}</td>
                                <td className="py-3 text-gray-300 pr-3">{item.author || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-gray-900/20 border border-gray-800/60 rounded-3xl p-6 space-y-6">
                <div className="border-b border-gray-800/60 pb-4">
                  <h3 className="text-lg font-bold text-white">System Directory</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => navigate('/books')}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-950/60 border border-gray-800 hover:border-violet-500/30 hover:bg-gray-900/40 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <span>Browse Books</span>
                    <ArrowRight className="w-4 h-4 text-violet-400" />
                  </button>

                  <button
                    onClick={() => navigate('/members')}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-950/60 border border-gray-800 hover:border-fuchsia-500/30 hover:bg-gray-900/40 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <span>Manage Members</span>
                    <ArrowRight className="w-4 h-4 text-fuchsia-400" />
                  </button>

                  <button
                    onClick={() => navigate('/issuances')}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-950/60 border border-gray-800 hover:border-cyan-500/30 hover:bg-gray-900/40 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <span>Track Issuances</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Dashboard;