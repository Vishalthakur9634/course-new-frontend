import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getAssetUrl } from '../utils/urlUtils';
import {
    PlayCircle, Search, Clock, Zap, Award, BookOpen, CheckCircle,
    Flame, Share2, Users, MessageSquare, TrendingUp, Globe, Plus,
    Heart, Star, ArrowRight, Cpu, Sparkles, GraduationCap, Activity,
    Target, Trophy, Rocket, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyQuests from '../components/dashboard/DailyQuests';
import SkillRadar from '../components/dashboard/SkillRadar';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import PaymentModal from '../components/PaymentModal';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [following, setFollowing] = useState([]);
    const [socialPulse, setSocialPulse] = useState([]);
    const [gamification, setGamification] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            const userId = userObj.id || userObj._id;
            const [coursesRes, userRes, enrollmentsRes, followingRes, communityRes, gamificationRes] = await Promise.all([
                api.get('/courses'),
                api.get(`/users/profile/${userId}`),
                api.get('/enrollment/my-courses'),
                api.get(`/users/following/${userId}`),
                api.get('/community/posts?limit=5'),
                api.get('/gamification/xp')
            ]);
            setCourses(coursesRes.data);
            setUser(userRes.data);
            setEnrollments(enrollmentsRes.data || []);
            setFollowing(Array.isArray(followingRes.data) ? followingRes.data : []);
            setSocialPulse(communityRes.data.posts || []);
            setGamification(gamificationRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setCourses([]);
            setEnrollments([]);
            setFollowing([]);
            setSocialPulse([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px] bg-[#0a0a0a]">
            <div className="relative">
                <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 bg-brand-primary/10 blur-xl animate-pulse rounded-full"></div>
            </div>
        </div>
    );

    const totalTimeSpentSeconds = enrollments.reduce((acc, curr) => acc + (curr.totalTimeSpent || 0), 0);
    const totalHours = Math.round(totalTimeSpentSeconds / 3600);
    const completedCourses = enrollments.filter(e => e.progress === 100).length;

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(courses.map(c =>
        c.category.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    ))];

    const recentEnrollments = enrollments
        .filter(e => e.courseId && e.progress < 100)
        .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
        .slice(0, 3);

    return (
        <div className="w-full max-w-[1600px] mx-auto pb-32 px-4 md:px-8 font-inter text-gray-300">
            {showPaymentModal && selectedCourse && (
                <PaymentModal
                    course={selectedCourse}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        addToast('Course Access Granted', 'success');
                        fetchData();
                    }}
                />
            )}

            <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                {/* Main Content Column */}
                <div className="flex-1 space-y-8 md:space-y-12 min-w-0"> {/* min-w-0 prevents flex child overflow */}

                    {/* HERO SECTION */}
                    <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                            <div className="flex-1 space-y-6 text-center lg:text-left w-full">
                                <div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Command Center</p>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-black text-white px-2 lg:px-0">
                                        Welcome, <span className="text-brand-primary">{user?.name?.split(' ')[0]}</span>
                                    </h1>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link to="/my-learning" className="flex items-center justify-center gap-2 bg-brand-primary text-black px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-brand-hover transition-all w-full sm:w-auto">
                                        <PlayCircle size={18} /> Resume Mission
                                    </Link>
                                    <Link to="/browse" className="flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-white/10 transition-all border border-white/10 w-full sm:w-auto">
                                        <Search size={18} /> Browse Catalog
                                    </Link>
                                </div>
                            </div>

                            {/* Stats Card - Mobile Optimized */}
                            <div className="w-full lg:w-[350px] bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark-muted">Current Rank</span>
                                    <span className="text-xl font-black text-brand-primary">LEVEL {Math.floor((user?.gamification?.xp || 0) / 1000) + 1}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[9px] uppercase tracking-widest text-dark-muted mb-1">Courses</p>
                                        <p className="text-2xl font-black text-white">{completedCourses}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[9px] uppercase tracking-widest text-dark-muted mb-1">Hours</p>
                                        <p className="text-2xl font-black text-white">{totalHours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTINUE LEARNING - Vertical Stack on Mobile */}
                    {recentEnrollments.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                <Activity size={20} className="text-brand-primary" /> Active Missions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentEnrollments.map((enrollment) => (
                                    <Link
                                        key={enrollment._id}
                                        to={`/course/${enrollment.courseId._id}`}
                                        className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-brand-primary/30 transition-all group"
                                    >
                                        <div className="w-24 h-24 rounded-xl bg-black flex-shrink-0 overflow-hidden relative">
                                            <img src={getAssetUrl(enrollment.courseId.thumbnail)} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">
                                                {enrollment.courseId.category}
                                            </p>
                                            <h3 className="font-bold text-white leading-tight mb-3 line-clamp-2 uppercase">
                                                {enrollment.courseId.title}
                                            </h3>
                                            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-brand-primary"
                                                    style={{ width: `${enrollment.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS GRID - Mobile safe */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Wrap in overflow-hidden to prevent graph overflow */}
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 overflow-hidden">
                            <DailyQuests missions={gamification?.missions} />
                        </div>
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 overflow-hidden">
                            <SkillRadar courses={courses} enrollments={enrollments} />
                        </div>
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 overflow-hidden">
                            <ActivityHeatmap />
                        </div>
                    </div>

                    {/* EXPLORATION */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                <Globe size={20} className="text-brand-primary" /> Explore
                            </h2>
                            {/* Categories - Horizontal Scroll kept (safe) or wrap? Scroll is better for tags */}
                            <div className="w-full md:w-auto overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="flex gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${selectedCategory === cat
                                                    ? 'bg-brand-primary border-brand-primary text-black'
                                                    : 'bg-transparent border-white/10 text-dark-muted hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Courses Grid - Vertical on Mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.slice(0, 6).map((course) => (
                                <Link
                                    key={course._id}
                                    to={`/course/${course._id}`}
                                    className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary/30 transition-all group flex flex-col"
                                >
                                    <div className="aspect-video bg-black relative">
                                        <img src={getAssetUrl(course.thumbnail)} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{course.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-white mb-2 leading-tight uppercase line-clamp-2 group-hover:text-brand-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                            <div className="flex items-center gap-1.5 text-yellow-500">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-xs font-bold">4.9</span>
                                            </div>
                                            <span className="text-xl font-black text-white italic">${course.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar Column - Moves to bottom on mobile */}
                <div className="w-full xl:w-[350px] space-y-8 flex-shrink-0">
                    {/* Neural Pulse - Social Feed */}
                    <div className="bg-[#141414] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white uppercase tracking-wider">Network</h3>
                            <Link to="/community" className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:text-white">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {socialPulse.length > 0 ? socialPulse.map((post, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-black font-bold">
                                            {post.author?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase">{post.author?.name}</p>
                                            <p className="text-[9px] text-dark-muted uppercase tracking-wider">Active Now</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-dark-muted line-clamp-2 mb-3">{post.content}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-dark-muted uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Heart size={12} /> {post.likes?.length || 0}</span>
                                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 opacity-50">
                                    <Users size={32} className="mx-auto mb-2 text-dark-muted" />
                                    <p className="text-[10px] uppercase tracking-widest">No Signals</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI MENTOR CARD */}
                    <Link to="/neural-tutor" className="block bg-brand-primary rounded-3xl p-8 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center text-brand-primary shadow-xl">
                                <Rocket size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-black uppercase italic mb-2">AI Mentor</h3>
                            <p className="text-xs font-bold text-black/70 uppercase tracking-wider mb-6">Accelerate your learning curve</p>
                            <span className="inline-block bg-black text-brand-primary px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest group-hover:scale-105 transition-transform">
                                Initiate
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
