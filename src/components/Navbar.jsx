import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, Rocket, User,
    LogOut, BookOpen, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAssetUrl } from '../utils/assets';
import api from '../utils/api';
import { navConfigs } from '../utils/navigation';

const Navbar = () => {
    const { user, token } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const searchRef = useRef(null);

    const userRole = user?.role || 'student';
    // Links from shared config
    const allLinks = navConfigs[userRole] || navConfigs.student;

    // Filter out dividers for Navbar usage
    const cleanLinks = allLinks.filter(item => item.type !== 'divider');

    // Desktop: First 4 links only
    const desktopLinks = cleanLinks.slice(0, 4);

    // Mobile: All links (user requested "all pages should be there on the bottombar")
    const mobileLinks = cleanLinks;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch courses for search
    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                const response = await api.get('/courses');
                setAllCourses(response.data);
                setSuggestions(response.data); // Initial populate
            } catch (error) {
                console.error("Failed to load search data", error);
            }
        };

        if (showSearch && allCourses.length === 0) {
            fetchSearchData();
        }
    }, [showSearch]);

    // Filter suggestions
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions(allCourses.slice(0, 5));
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = allCourses.filter(course =>
                course.title.toLowerCase().includes(lowerQuery) ||
                course.category?.toLowerCase().includes(lowerQuery)
            );
            setSuggestions(filtered.slice(0, 5));
        }
    }, [searchQuery, allCourses]);

    const handleSearch = (query) => {
        if (!query.trim()) return;
        navigate(`/courses?search=${encodeURIComponent(query)}`);
        setShowSearch(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
                }`}>
                <div className="w-full max-w-[95%] md:max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4">
                    {/* Brand Module */}
                    <div className="flex items-center gap-3 md:gap-10">

                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-primary rounded-lg flex items-center justify-center transition-all duration-300 border border-brand-primary/20 shadow-sm relative overflow-hidden">
                                <Rocket size={20} className="text-dark-bg fill-current relative z-10 md:w-[24px] md:h-[24px]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm md:text-xl font-bold uppercase tracking-tight leading-none text-white">
                                    Orbit<span className="text-brand-primary">Quest</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest leading-none">Transmission Stable</span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden xl:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                            {desktopLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${location.pathname === link.path
                                        ? 'text-dark-bg'
                                        : 'text-dark-muted hover:text-white'
                                        }`}
                                >
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="navPill"
                                            className="absolute inset-0 bg-brand-primary rounded-full shadow-[0_0_20px_rgba(255,161,22,0.4)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <link.icon size={14} className={location.pathname === link.path ? 'fill-current' : ''} />
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Module */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Search Trigger */}
                        <div className="relative group" ref={searchRef}>
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={`h-10 rounded-full flex items-center justify-center transition-all ${showSearch
                                        ? 'bg-brand-primary text-dark-bg shadow-[0_0_20px_rgba(255,161,22,0.4)] w-10'
                                        : 'bg-white/5 text-dark-muted hover:text-white hover:bg-white/10 w-10 md:w-auto md:px-4 md:gap-3'
                                    }`}
                            >
                                <Search size={18} />
                                {!showSearch && <span className="hidden md:block text-xs font-bold uppercase tracking-wider">Search</span>}
                            </button>

                            {/* Search Overlay */}
                            <AnimatePresence>
                                {showSearch && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        // WIDENED SEARCH BAR to 600px
                                        className="absolute top-full right-0 mt-4 w-[90vw] md:w-[600px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden z-50 backdrop-blur-3xl"
                                    >
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                                            <input
                                                autoFocus
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                                placeholder="Search courses, mentors, paths..."
                                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-brand-primary/50 outline-none placeholder:text-dark-muted font-medium"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <button
                                                    onClick={() => handleSearch(searchQuery)}
                                                    className="px-3 py-1.5 rounded-lg bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-dark-bg transition-all text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20"
                                                >
                                                    Enter
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-[10px] font-bold text-dark-muted uppercase tracking-widest mb-2 px-1">
                                                {searchQuery ? 'Best Matches' : 'Trending in Database'}
                                            </div>
                                            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {suggestions.length > 0 ? (
                                                    suggestions.map((item) => (
                                                        <button
                                                            key={item._id}
                                                            onClick={() => {
                                                                navigate(`/course/${item._id}`);
                                                                setShowSearch(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-sm text-dark-muted hover:text-white transition-colors flex items-center justify-between group"
                                                        >
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="truncate font-semibold text-white/90">{item.title}</span>
                                                                <span className="text-[10px] uppercase tracking-wider text-dark-muted">{item.category}</span>
                                                            </div>
                                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-brand-primary flex-shrink-0" />
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-8 text-center border-t border-white/5 mt-2">
                                                        <Search size={24} className="mx-auto text-dark-muted mb-2 opacity-50" />
                                                        <p className="text-xs text-dark-muted font-medium">No results found in the archives.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                        {token ? (
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Notifications */}
                                <button className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group hidden md:flex">
                                    <Bell size={18} className="text-dark-muted group-hover:text-white transition-colors" />
                                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                                </button>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-brand-primary/50 transition-all">
                                            <img src={getAssetUrl(user.avatar) || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="hidden md:block text-left mr-2">
                                            <div className="text-xs font-bold text-white leading-none mb-0.5">{user.name?.split(' ')[0]}</div>
                                            <div className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">{user.role}</div>
                                        </div>
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
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
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
            </nav>

            {/* PROFESSIONAL COMPACT BOTTOM NAVIGATION */}
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
                    {/* Gradient Fade to indicate scrolling */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
                </div>
            )}
        </>
    );
};

export default Navbar;
