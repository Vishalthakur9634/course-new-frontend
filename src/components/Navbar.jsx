import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAssetUrl } from '../utils/urlUtils';
import {
    LogOut, User, BookOpen, Award, Grid3x3,
    Users, DollarSign, Search, Bell, ShoppingCart,
    Rocket, Sparkles, Package, MessageSquare, LayoutGrid,
    Sun, Moon, ArrowRight, Zap, ChevronDown, Menu, X, Home, Compass, BarChart2, Video, Heart
} from 'lucide-react';
import api from '../utils/api';
import NotificationCenter from './NotificationCenter';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onOpenCommandPalette }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const [popularCourses, setPopularCourses] = useState([]);

    useEffect(() => {
        const syncUser = () => {
            setUser(JSON.parse(localStorage.getItem('user')) || {});
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('storage', syncUser);
        window.addEventListener('profileUpdate', syncUser);
        return () => {
            window.removeEventListener('storage', syncUser);
            window.removeEventListener('profileUpdate', syncUser);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchFocused(false);
            }
        };

        if (theme === 'light') document.documentElement.classList.add('light');
        else document.documentElement.classList.remove('light');

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [theme]);


    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const { data } = await api.get(`/courses?search=${searchQuery}`);
                setSearchResults(data.slice(0, 5));
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };
        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const { data } = await api.get('/courses');
                const popular = data
                    .filter(c => c.isPublished)
                    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
                    .slice(0, 3);
                setPopularCourses(popular);

                if (token) {
                    const notifyData = await api.get('/notifications');
                    setUnreadCount(notifyData.data.unreadCount);
                }
            } catch (error) {
                console.error('Nav Fetch Error:', error);
            }
        };
        fetchGlobalData();
    }, [token]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const navLinks = {
        student: [
            { name: 'Home', path: '/dashboard', icon: Home },
            { name: 'Browse', path: '/browse', icon: LayoutGrid },
            { name: 'My Learning', path: '/my-learning', icon: BookOpen },
            { name: 'Wishlist', path: '/wishlist', icon: Heart },
            { name: 'Messages', path: '/messages', icon: MessageSquare },
            { name: 'Social', path: '/social', icon: Users },
            { name: 'Reels', path: '/reels', icon: Video },
            { name: 'Bundles', path: '/bundles', icon: Package },
            { name: 'Leaderboard', path: '/leaderboard', icon: Award },
            { name: 'Community', path: '/community', icon: Grid3x3 },
            { name: 'Aura', path: '/aura-quest', icon: Zap },
            { name: 'Meta', path: '/meta-classroom', icon: Video },
            { name: 'Certificates', path: '/certificates', icon: Award },
            { name: 'Announcements', path: '/announcements', icon: Bell },
            { name: 'Profile', path: '/settings', icon: User }, // Added Profile access for mobile bottom nav
        ],
        instructor: [
            { name: 'Dashboard', path: '/instructor', icon: Grid3x3 },
            { name: 'Courses', path: '/instructor/courses', icon: BookOpen },
            { name: 'Students', path: '/instructor/students', icon: Users },
            { name: 'Earnings', path: '/instructor/earnings', icon: DollarSign },
            { name: 'Analytics', path: '/instructor/analytics', icon: BarChart2 },
            { name: 'Bundles', path: '/instructor/bundles', icon: Package },
            { name: 'Promotions', path: '/instructor/promotions', icon: Zap },
            { name: 'Live', path: '/instructor/live', icon: Video },
        ],
        admin: [
            { name: 'Overview', path: '/admin', icon: Grid3x3 },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Courses', path: '/admin/courses', icon: BookOpen },
            { name: 'Payments', path: '/admin/payments', icon: DollarSign },
        ],
        superadmin: [
            { name: 'Overview', path: '/admin', icon: Grid3x3 },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Courses', path: '/admin/courses', icon: BookOpen },
            { name: 'Content', path: '/admin/content', icon: LayoutGrid },
        ]
    };

    const currentLinks = user.role ? (navLinks[user.role] || []) : [];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'py-2 border-b border-white/5 bg-[#1a1a1a]/95' : 'py-3 bg-transparent border-transparent'
                }`}>
                <div className="max-w-[280px] md:max-w-7xl mx-auto px-1 md:px-8 flex justify-between items-center">
                    {/* Brand Module */}
                    <div className="flex items-center gap-4 md:gap-10">

                        <Link to="/" className="flex items-center gap-1 md:gap-3 group">
                            <div className="w-4 h-4 md:w-9 md:h-9 bg-brand-primary rounded-[2px] md:rounded-lg flex items-center justify-center transition-all duration-300 border border-brand-primary/20 shadow-sm relative overflow-hidden">
                                <Rocket size={24} className="text-dark-bg fill-current relative z-10 md:w-[24px] md:h-[24px]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] md:text-lg font-bold uppercase tracking-tight leading-none text-white">
                                    Orbit<span className="text-brand-primary">Quest</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[7px] md:text-[9px] font-black text-green-500 uppercase tracking-widest leading-none">Transmission Stable</span>
                                </div>
                            </div>
                        </Link>

                        {/* Navigation Matrix - Desktop */}
                        {token && (
                            <div className="hidden xl:flex items-center gap-1">
                                {currentLinks.slice(0, 5).map((link) => ( // Show first 5 on desktop nav
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 relative group ${location.pathname === link.path
                                            ? 'text-brand-primary bg-white/5'
                                            : 'text-dark-muted hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <link.icon size={14} className={location.pathname === link.path ? '' : 'group-hover:scale-105 transition-transform'} />
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Command & Control Center */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-2xl">
                        {/* Desktop Search */}
                        <div ref={searchRef} className={`hidden md:flex flex-1 max-w-sm relative group ${user.role === 'instructor' ? 'invisible pointer-events-none' : ''}`}>
                            <div className={`flex items-center w-full bg-white/[0.08] border transition-all h-9 relative z-[100000] ${isSearchFocused
                                ? 'border-brand-primary/50 bg-[#333] rounded-lg'
                                : 'border-transparent rounded-lg hover:bg-white/[0.12]'
                                }`}>
                                <Search className={`ml-3 transition-colors ${isSearchFocused ? 'text-brand-primary' : 'text-dark-muted'}`} size={14} />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="w-full bg-transparent border-none py-1 pl-2 pr-3 text-xs focus:outline-none placeholder:text-dark-muted/70 text-white font-medium h-full"
                                    value={searchQuery}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="mr-2 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-medium text-dark-muted select-none bg-white/10 cursor-pointer"
                                    onClick={() => onOpenCommandPalette && onOpenCommandPalette()}>
                                    <span>⌘</span> K
                                </div>
                            </div>
                            {/* Results Dropdown (Same as before) */}
                            <AnimatePresence>
                                {isSearchFocused && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 w-screen max-w-[calc(100vw-2rem)] md:w-full bg-[#1a1a1a] border border-white/10 rounded-b-xl shadow-2xl overflow-hidden z-[99999]"
                                    >
                                        {isSearching ? (
                                            <div className="p-6 text-center">
                                                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest animate-pulse">Searching...</p>
                                            </div>
                                        ) : searchQuery.length >= 2 ? (
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar relative z-10">
                                                <div className="px-5 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                                    <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">{searchResults.length} Results Found</p>
                                                </div>
                                                {searchResults.map(course => (
                                                    <button
                                                        key={course._id}
                                                        onClick={() => navigate(`/course/${course._id}`)}
                                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all group"
                                                    >
                                                        <div className="w-7 h-7 rounded-lg bg-dark-layer2 overflow-hidden flex-shrink-0 border border-white/10">
                                                            <img src={getAssetUrl(course.thumbnail)} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="text-left min-w-0 flex-1">
                                                            <p className="text-[11px] font-bold text-white group-hover:text-brand-primary transition-colors truncate uppercase">{course.title}</p>
                                                            <p className="text-[9px] text-dark-muted uppercase font-bold tracking-wider leading-none mt-0.5">{course.category}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                                {searchResults.length === 0 && <div className="p-10 text-center text-dark-muted text-[10px] font-bold uppercase tracking-widest">No courses found.</div>}
                                            </div>
                                        ) : (
                                            <div className="p-0 relative z-10">
                                                <div className="px-5 py-2.5 bg-white/5 border-b border-white/5">
                                                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Popular Courses</p>
                                                </div>
                                                <div className="py-2">
                                                    {popularCourses.map(course => (
                                                        <button
                                                            key={course._id}
                                                            onClick={() => navigate(`/course/${course._id}`)}
                                                            className="w-full flex items-center gap-4 px-5 py-2 hover:bg-white/5 transition-all text-left group"
                                                        >
                                                            <div className="w-6 h-6 rounded-md bg-dark-layer2 overflow-hidden border border-white/10 flex-shrink-0">
                                                                <img src={getAssetUrl(course.thumbnail)} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-dark-muted group-hover:text-white transition-colors truncate uppercase">{course.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Search Toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={() => onOpenCommandPalette && onOpenCommandPalette()}
                                className="p-1 rounded hover:bg-white/5 text-dark-muted hover:text-white transition-all"
                            >
                                <Search size={24} />
                            </button>
                        </div>

                        {/* Operational Modules */}
                        <div className="flex items-center gap-2 pr-2 md:pr-4 md:border-r border-white/10 mr-1 md:mr-2">
                            <button onClick={toggleTheme} className="hidden md:block p-3 rounded-2xl hover:bg-white/5 text-dark-muted hover:text-brand-primary transition-all relative overflow-hidden group">
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            {token && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className={`p-1 md:p-3 rounded md:rounded-xl transition-all relative group ${isNotificationsOpen ? 'bg-brand-primary text-dark-bg' : 'hover:bg-white/5 text-dark-muted hover:text-white'}`}
                                    >
                                        <Bell size={24} className="md:size-[24px]" />
                                        <AnimatePresence>
                                            {unreadCount > 0 && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className={`absolute top-1 right-1 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isNotificationsOpen ? 'bg-dark-bg' : 'bg-brand-primary'}`}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* Profile & Auth Module */}
                        {token ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-0.5 p-0.5 rounded hover:bg-white/5 transition-all group"
                                >
                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-dark-layer2 p-0.5 border border-white/10 group-hover:border-brand-primary transition-all overflow-hidden relative">
                                        <img
                                            src={getAssetUrl(user.profilePicture || user.avatar) || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <ChevronDown size={6} className={`text-dark-muted group-hover:text-white transition-all ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-full right-0 mt-4 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
                                        >
                                            <div className="p-6 border-b border-white/5 bg-white/5 relative">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-dark-layer2 p-1 border border-white/20 overflow-hidden">
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
                <div className="xl:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-[#141414]/95 backdrop-blur-xl border-t border-white/10 z-[1000] pb-safe-area-bottom">
                    <div className="flex items-center h-full overflow-x-auto no-scrollbar px-6 gap-8">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex flex-col items-center justify-center min-w-[80px] h-full px-2 transition-all relative ${location.pathname === link.path
                                    ? 'text-brand-primary'
                                    : 'text-dark-muted hover:text-white'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg mb-0.5 transition-all ${location.pathname === link.path ? 'bg-brand-primary/10' : 'bg-transparent'
                                    }`}>
                                    <link.icon size={24} className={location.pathname === link.path ? 'fill-current' : ''} />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-full -mt-0.5">
                                    {link.name}
                                </span>
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute top-0 w-8 h-0.5 bg-brand-primary shadow-[0_0_10px_rgba(255,161,22,0.8)]"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
