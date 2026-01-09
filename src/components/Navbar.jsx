import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, Rocket, User,
    LogOut, BookOpen, ArrowRight,
    Home, Compass, Heart, MessageSquare, Moon, Sun, Command
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAssetUrl } from '../utils/assets';
import api from '../utils/api';
import { navConfigs } from '../utils/navigation';

const Navbar = ({ onOpenCommandPalette }) => {
    const { user, token } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);

    const userRole = user?.role || 'student';
    // Links from shared config
    const allLinks = navConfigs[userRole] || navConfigs.student;

    // Filter out dividers for mobile
    const cleanLinks = allLinks.filter(item => item.type !== 'divider');

    // Custom Desktop Links matching the screenshot
    // Screenshot shows: Home, Browse, My Learning, Wishlist, Messages
    const specificDesktopLinks = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Browse', path: '/courses', icon: Compass },
        { label: 'My Learning', path: '/my-learning', icon: BookOpen },
        { label: 'Wishlist', path: '/wishlist', icon: Heart },
        { label: 'Messages', path: '/messages', icon: MessageSquare },
    ];

    // Mobile: All links
    const mobileLinks = cleanLinks;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch and filter search suggestions
    useEffect(() => {
        const fetchSearchData = async () => {
            if (searchQuery.length > 0) {
                try {
                    // Use backend search endpoint
                    const response = await api.get(`/courses?search=${encodeURIComponent(searchQuery)}`);
                    setSuggestions(response.data.slice(0, 5));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Failed to load search data", error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSearchData, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (query) => {
        if (!query.trim()) return;
        navigate(`/courses?search=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
        setShowMobileSearch(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 py-2' : 'bg-transparent py-4'}`}>
                <div className="w-full max-w-[98%] mx-auto px-4 flex items-center justify-between gap-4">

                    {/* LEFT: Logo + Nav Links */}
                    <div className="flex items-center gap-8">
                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center transition-all duration-300 border border-brand-primary/20 shadow-sm relative overflow-hidden">
                                <Rocket size={20} className="text-dark-bg fill-current relative z-10" />
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-lg font-bold uppercase tracking-tight leading-none text-white">
                                    Orbit<span className="text-brand-primary">Quest</span>
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest leading-none">Transmission Stable</span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links (Text + Icon) */}
                        <div className="hidden xl:flex items-center gap-6">
                            {specificDesktopLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 text-[13px] font-medium transition-colors ${location.pathname === link.path
                                        ? 'text-white'
                                        : 'text-dark-muted hover:text-white'
                                        }`}
                                >
                                    <link.icon size={16} className={location.pathname === link.path ? 'text-brand-primary' : ''} />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Search + Actions */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                            className="md:hidden p-2 text-dark-muted hover:text-white transition-colors"
                        >
                            <Search size={22} />
                        </button>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:block relative w-[300px]" ref={searchRef}>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-white transition-colors">
                                    <Search size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-xs text-white placeholder:text-dark-muted focus:outline-none focus:border-white/10 focus:bg-[#202020] transition-all"
                                />
                                {/* Command Shortcut Hint */}
                                <div
                                    onClick={onOpenCommandPalette}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-dark-muted font-mono cursor-pointer hover:bg-white/10"
                                >
                                    <Command size={10} /> <span>K</span>
                                </div>
                            </div>

                            {/* Search Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        {suggestions.map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => handleSearch(item.title)}
                                                className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs text-dark-muted hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Search size={12} />
                                                <span className="truncate">{item.title}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-6 bg-white/10 hidden md:block" />

                        {/* Theme Toggle (Visual Only) */}
                        <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-dark-muted hover:text-white hover:bg-white/5 transition-all">
                            <Moon size={18} />
                        </button>

                        {/* Notification Bell (Orange Button) */}
                        <Link
                            to="/notifications"
                            className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl bg-brand-primary text-black hover:bg-brand-hover transition-all relative shadow-[0_0_15px_rgba(255,161,22,0.3)]"
                        >
                            <Bell size={20} className="fill-current" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-black rounded-full border border-brand-primary" />
                        </Link>

                        {/* Profile Menu */}
                        {token ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-brand-primary/50 transition-all"
                                >
                                    <img src={getAssetUrl(user.avatar) || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-full right-0 mt-4 w-72 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden border border-white/10">
                                                        <img src={getAssetUrl(user.avatar) || `https://ui-avatars.com/api/?name=${user.name}&background=ffcc00&color=000`} className="w-full h-full rounded-lg object-cover" alt="" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate uppercase tracking-tight">{user.name}</p>
                                                        <p className="text-[10px] text-brand-primary font-bold truncate uppercase tracking-wider mt-0.5">{user.role}</p>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={user.role === 'instructor' ? `/instructor/profile/${user.id || user._id}` : `/u/${user.id || user._id}`}
                                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-dark-bg rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-hover transition-all"
                                                >
                                                    View Profile <ArrowRight size={14} />
                                                </Link>
                                            </div>

                                            <div className="p-3 space-y-1">
                                                {[
                                                    { label: 'Account Settings', icon: User, path: '/profile' },
                                                    { label: 'My Learning', icon: BookOpen, path: '/my-learning', role: 'student' }
                                                ].filter(item => !item.role || item.role === user.role).map((item, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={item.path}
                                                        onClick={() => setShowProfileMenu(false)}
                                                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-dark-muted hover:text-white transition-all group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                                                            <item.icon size={16} />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                                                    </Link>
                                                ))}

                                                <button
                                                    onClick={() => {
                                                        localStorage.clear();
                                                        navigate('/login');
                                                        setShowProfileMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-all mt-4 border border-transparent hover:border-red-500/20"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                        <LogOut size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Sign Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-dark-muted hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden md:inline-flex px-6 py-2.5 bg-brand-primary text-dark-bg font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-brand-hover transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                <AnimatePresence>
                    {showMobileSearch && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="xl:hidden absolute top-full left-0 right-0 p-4 bg-[#0a0a0a] border-b border-white/10 shadow-2xl z-[900]"
                        >
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch(searchQuery);
                                }}
                                className="relative"
                            >
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-brand-primary/50"
                                    autoFocus
                                />
                            </form>
                            {/* Mobile Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="mt-2 bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
                                    {suggestions.map((item) => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleSearch(item.title)}
                                            className="w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 text-sm text-dark-muted hover:text-white flex items-center gap-3"
                                        >
                                            <Search size={14} />
                                            <span className="truncate">{item.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Bottom Navigation */}
            {token && (
                <div className="xl:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-[#0a0a0a] border-t border-white/10 z-[1000] pb-safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center h-full overflow-x-auto px-2 gap-2 w-full no-scrollbar">
                        {mobileLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex flex-col items-center justify-center flex-shrink-0 min-w-[70px] h-full px-1 transition-all relative ${location.pathname === link.path
                                    ? 'text-brand-primary'
                                    : 'text-dark-muted hover:text-white'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-xl mb-1 transition-all ${location.pathname === link.path ? 'bg-brand-primary/10 scale-110' : 'bg-transparent'
                                    }`}>
                                    <link.icon size={22} className={location.pathname === link.path ? 'fill-current' : ''} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap leading-none">
                                    {link.label}
                                </span>
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute top-0 w-12 h-0.5 bg-brand-primary shadow-[0_0_10px_rgba(255,161,22,0.8)]"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
                </div>
            )}
        </>
    );
};

export default Navbar;
