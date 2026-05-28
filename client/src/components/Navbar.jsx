import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Library } from 'lucide-react';
import api from '../utils/api';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Books', to: '/books' },
  { label: 'Members', to: '/members' },
  { label: 'Issuances', to: '/issuances' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple ping to check if backend is reachable
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get('/app');
        setServerOnline(true);
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-gray-950/75 backdrop-blur-md border-b border-gray-800/80 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left: Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-0.5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 group-hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center w-full h-full bg-gray-950 rounded-[10px] transition-colors duration-300 group-hover:bg-transparent">
                <Library className="w-5 h-5 text-violet-400 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Library<span className="text-violet-400 font-extrabold">Management</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'} `}></span>
                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                  {serverOnline ? 'System Live' : 'System Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-1 bg-gray-900/40 p-1.5 rounded-full border border-gray-800/50 backdrop-blur-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 border border-transparent'
                  }
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>


          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900/50 border border-gray-800/60 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all duration-200 active:scale-90"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-sm md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-sm bg-gray-950/95 border-l border-gray-800/80 backdrop-blur-xl p-6 shadow-2xl md:hidden transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Library className="w-5 h-5 text-violet-500" />
            <span className="text-lg font-bold text-white tracking-tight">BiblioTech</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                ${isActive
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[inset_0_0_10px_rgba(139,92,246,0.05)]'
                  : 'text-gray-400 hover:bg-gray-900/60 hover:text-white border border-transparent'
                }
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
