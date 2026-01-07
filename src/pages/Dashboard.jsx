import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getAssetUrl } from '../utils/urlUtils';
import {
    PlayCircle, Search, Clock, Zap, Award, BookOpen, CheckCircle,
    Flame, Share2, Users, MessageSquare, TrendingUp, Globe, Plus,
    Heart, Star, ArrowRight, Cpu, Sparkles, GraduationCap, Activity,
    Target, Trophy, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from '../components/NotificationCenter';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import SkillRadar from '../components/dashboard/SkillRadar';
import DailyQuests from '../components/dashboard/DailyQuests';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [socialPulse, setSocialPulse] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userObj = JSON.parse(localStorage.getItem('user'));
            const userId = userObj.id || userObj._id;
            const [coursesRes, userRes, enrollmentsRes, followingRes, communityRes] = await Promise.all([
                api.get('/courses'),
                api.get(`/users/profile/${userId}`),
                api.get('/enrollment/my-courses'),
                api.get(`/users/following/${userId}`),
                api.get('/community/posts?limit=5')
            ]);
            setCourses(coursesRes.data);
            setUser(userRes.data);
            setEnrollments(enrollmentsRes.data || []);
            setFollowing(Array.isArray(followingRes.data) ? followingRes.data : []);
            setSocialPulse(communityRes.data.posts || []);
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
    const certificatesEarned = enrollments.filter(e => e.certificateIssued).length;

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
        <div className="max-w-[1600px] mx-auto pb-24 px-4 md:px-10 font-inter text-gray-300">
            {/* Split Layout Matrix */}
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">

                {/* Main Mission Control Column */}
                <div className="flex-1 space-y-12 md:space-y-16">

                    {/* HERO MATRIX: Welcome & High-Yield Stats */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#141414] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-12 lg:p-16 relative overflow-hidden shadow-3xl group"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full group-hover:bg-brand-primary/20 transition-all duration-1000" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-12">
                            <div className="flex-1 text-center lg:text-left space-y-4 md:space-y-10">
                                <div className="space-y-1 md:space-y-4">
                                    <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3">
                                        <div className="w-1 md:w-1.5 h-6 md:h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(255,161,22,0.5)]" />
                                        <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                                            Hello, <span className="text-brand-primary">{user?.name?.split(' ')[0] || 'User'}</span>
                                        </h1>
                                    </div>
                                    <p className="text-[7px] md:text-[10px] lg:text-[11px] text-dark-muted font-black uppercase tracking-[0.2em] md:tracking-[0.5em] opacity-40">Tactical Education Control Center</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 md:gap-6 w-full sm:w-auto mt-4 md:mt-0 px-4 md:px-0">
                                    <Link to="/my-learning" className="bg-brand-primary text-dark-bg px-6 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:brightness-110 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20 group/btn w-full sm:w-auto">
                                        <PlayCircle size={16} className="md:w-5 md:h-5 group-hover/btn:scale-125 transition-transform" /> Continue Mission
                                    </Link>
                                    <Link to="/browse" className="bg-white/5 text-white px-6 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-white/10 hover:-translate-y-1 border border-white/10 transition-all flex items-center justify-center gap-3 shadow-xl w-full sm:w-auto">
                                        <Search size={16} className="md:w-5 md:h-5 text-brand-primary" /> Scan Catalog
                                    </Link>
                                </div>
                            </div>

                            {/* USER PERFORMANCE HUB */}
                            <div className="w-full lg:max-w-[400px] bg-black/40 backdrop-blur-2xl p-5 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-3xl space-y-5 md:space-y-8 relative overflow-hidden">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4 md:pb-6">
                                    <div className="space-y-1">
                                        <p className="text-[8px] md:text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] md:tracking-widest">Growth progression</p>
                                        <div className="text-xl md:text-3xl font-black text-white italic tracking-tighter">LEVEL {Math.floor((user?.gamification?.xp || 0) / 1000) + 1}</div>
                                    </div>
                                    <div className="text-[10px] md:text-sm font-black text-brand-primary uppercase tracking-widest">{user?.gamification?.xp || 0} XP</div>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <div className="h-1 md:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(user?.gamification?.xp % 1000) / 10}%` }}
                                            className="h-full bg-brand-primary shadow-[0_0_15px_rgba(255,161,22,0.8)]"
                                        />
                                    </div>
                                    <p className="text-[7px] md:text-[9px] font-black text-dark-muted uppercase tracking-[0.2em] text-right opacity-50">Next terminal at 1000 XP</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-6">
                                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 group/stat hover:border-brand-primary/30 transition-all">
                                        <div className="flex items-center gap-1.5 md:gap-3 mb-1.5 md:mb-2 text-dark-muted group-hover/stat:text-brand-primary transition-colors">
                                            <Target size={10} className="md:w-[14px] md:h-[14px]" />
                                            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Completed</p>
                                        </div>
                                        <p className="text-xl md:text-4xl font-black text-white tracking-tighter">{completedCourses}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 group/stat hover:border-brand-primary/30 transition-all">
                                        <div className="flex items-center gap-1.5 md:gap-3 mb-1.5 md:mb-2 text-dark-muted group-hover/stat:text-brand-primary transition-colors">
                                            <Clock size={10} className="md:w-[14px] md:h-[14px]" />
                                            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Tactical Hrs</p>
                                        </div>
                                        <p className="text-xl md:text-4xl font-black text-white tracking-tighter">{totalHours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* CURRICULUM RESUMPTION */}
                    {recentEnrollments.length > 0 && (
                        <section className="space-y-6 md:space-y-10">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4 md:pb-8">
                                <div className="space-y-1 md:space-y-2">
                                    <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 md:gap-4">
                                        <TrendingUp className="text-brand-primary md:w-8 md:h-8" size={24} /> Active Coordination
                                    </h2>
                                    <p className="text-[9px] md:text-[10px] text-dark-muted font-black uppercase tracking-[0.3em] opacity-40">Resuming Critical Learning Nodes</p>
                                </div>
                                <Link to="/my-learning" className="group flex items-center gap-2 text-[10px] md:text-[11px] font-black text-brand-primary uppercase tracking-widest hover:text-white transition-all">
                                    Full Matrix <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:-mx-0 remove-scrollbar">
                                {recentEnrollments.map((enrollment, idx) => (
                                    <motion.div
                                        key={enrollment._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="min-w-[280px] md:min-w-0 snap-center"
                                    >
                                        <Link to={`/course/${enrollment.courseId._id}`} className="bg-[#141414] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 hover:border-brand-primary/40 transition-all group block shadow-xl hover:shadow-brand-primary/5 relative overflow-hidden h-full flex flex-col">
                                            <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 bg-[#0a0a0a] relative ring-1 ring-white/5 flex-shrink-0">
                                                <img src={getAssetUrl(enrollment.courseId.thumbnail)} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${enrollment.progress}%` }}
                                                            className="h-full bg-brand-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:space-y-4 px-1 pb-1 flex-1">
                                                <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">
                                                    <span>{enrollment.courseId.category}</span>
                                                    <span>{Math.round(enrollment.progress)}%</span>
                                                </div>
                                                <h3 className="font-black text-base md:text-xl text-white line-clamp-2 uppercase tracking-tight group-hover:text-brand-primary transition-colors">{enrollment.courseId.title}</h3>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* INTELLIGENCE MATRIX: Analytics Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {/* Keep Analytics vertical/grid as they are singular widgets, or maybe carousel them optionally? User said "cards smaller". Let's stick to Grid for widgets as they are large. */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl hover:border-brand-primary/20 transition-all group overflow-hidden relative">
                            <DailyQuests />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl hover:border-brand-primary/20 transition-all group overflow-hidden relative">
                            <SkillRadar courses={courses} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl hover:border-brand-primary/20 transition-all group overflow-hidden relative">
                            <ActivityHeatmap />
                        </motion.div>
                    </div>

                    {/* EXPLORATION HUB */}
                    <section className="space-y-6 md:space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 border-b border-white/5 pb-6 md:pb-10">
                            <div className="space-y-1.5 md:space-y-3">
                                <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3 md:gap-5">
                                    <Rocket size={24} className="md:w-9 md:h-9 text-brand-primary" /> Exploration Hub
                                </h2>
                                <p className="text-dark-muted font-black text-[8px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">Curated Intelligence Recommendation Matrix</p>
                            </div>
                            <div className="relative w-full md:max-w-[450px]">
                                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-brand-primary transition-colors w-4 h-4 md:w-5 md:h-5" size={16} />
                                <input
                                    type="text"
                                    placeholder="SCAN CURRICULUM ARCHIVE..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 rounded-xl md:rounded-[1.5rem] py-3 md:py-5 pl-12 md:pl-16 pr-5 md:pr-8 text-[9px] md:text-xs font-black text-white placeholder:text-dark-muted uppercase tracking-widest focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/20 focus:outline-none transition-all shadow-3xl"
                                />
                            </div>
                        </div>

                        {/* Specialization Matrix Filters */}
                        <div className="flex gap-2.5 md:gap-4 overflow-x-auto pb-4 px-4 md:px-0 -mx-4 md:-mx-0 remove-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 md:px-10 py-2.5 md:py-3.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap overflow-hidden relative group/pill flex-shrink-0 ${selectedCategory === cat
                                        ? 'bg-brand-primary text-dark-bg border-brand-primary shadow-2xl shadow-brand-primary/20'
                                        : 'bg-white/5 text-dark-muted border-white/10 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="relative z-10">{cat}</span>
                                    {selectedCategory === cat && <motion.div layoutId="activeCat" className="absolute inset-0 bg-brand-primary z-0" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:-mx-0 remove-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {filteredCourses.slice(0, 6).map((course, idx) => (
                                    <motion.div
                                        layout
                                        key={course._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="min-w-[280px] md:min-w-0 snap-center h-auto"
                                    >
                                        <Link to={`/course/${course._id}`} className="group bg-[#141414] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-brand-primary/30 transition-all duration-700 flex flex-col h-full shadow-2xl relative">
                                            <div className="aspect-[16/10] bg-black relative overflow-hidden ring-1 ring-white/5 flex-shrink-0">
                                                <img src={getAssetUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                                                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                                    <span className="bg-black/60 backdrop-blur-xl text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-3xl">
                                                        {course.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4 md:p-8 lg:p-10 flex-1 flex flex-col space-y-3 md:space-y-8">
                                                <h3 className="text-base md:text-xl lg:text-2xl font-black text-white group-hover:text-brand-primary transition-colors tracking-tight line-clamp-2 uppercase leading-snug">
                                                    {course.title}
                                                </h3>
                                                <div className="flex justify-between items-center pt-3 md:pt-8 border-t border-white/5 mt-auto">
                                                    <div className="flex items-center gap-1.5 md:gap-3 text-yellow-500/80 font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                                                        <Star size={12} className="md:w-[16px] md:h-[16px]" fill="currentColor" />
                                                        <span>High Fidelity</span>
                                                    </div>
                                                    <span className="font-black text-lg md:text-3xl text-white tracking-tighter italic">${course.price}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>

                {/* NEURAL PULSE SIDEBAR */}
                <div className="w-full lg:max-w-[380px] xl:max-w-[400px] space-y-8 md:space-y-12 flex-shrink-0">

                    {/* LIVE SIGNAL */}
                    <div className="bg-[#141414] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 shadow-3xl space-y-6 md:space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />

                        <div className="space-y-6 md:space-y-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-5 md:pb-10">
                                <div className="space-y-1 md:space-y-2">
                                    <h3 className="text-lg md:text-3xl font-black text-white uppercase tracking-tighter italic">Neural Pulse</h3>
                                    <p className="text-[7px] md:text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] md:tracking-[0.5em] opacity-80 animate-pulse flex items-center gap-2">
                                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-brand-primary" /> Live Signal
                                    </p>
                                </div>
                                <div className="p-2.5 md:p-5 bg-brand-primary/10 rounded-xl md:rounded-[1.5rem] text-brand-primary border border-brand-primary/20 shadow-2xl shadow-brand-primary/10">
                                    <Activity size={16} className="md:w-[24px] md:h-[24px]" />
                                </div>
                            </div>

                            {/* Collective Base */}
                            <div className="space-y-4 md:space-y-6">
                                <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black text-dark-muted uppercase tracking-[0.3em] opacity-40 px-2">
                                    <span>Peer Network</span>
                                    <span className="text-brand-primary">{following.length} Synced</span>
                                </div>
                                <div className="flex flex-wrap gap-2.5 md:gap-4 px-2">
                                    {following.slice(0, 6).map((f, i) => (
                                        <Link
                                            key={f._id}
                                            to={f.role === 'instructor' ? `/instructor/profile/${f._id}` : `/u/${f._id}`}
                                            className="relative group/avatar"
                                        >
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#0a0a0a] ring-1 ring-white/10 p-0.5 md:p-1 group-hover/avatar:ring-brand-primary/50 transition-all overflow-hidden shadow-2xl"
                                            >
                                                <img src={getAssetUrl(f.avatar) || 'https://via.placeholder.com/150'} className="w-full h-full rounded-lg md:rounded-xl object-cover grayscale opacity-60 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 transition-all duration-500" alt={f.name} />
                                            </motion.div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-4 md:h-4 bg-green-500 rounded-full border-2 md:border-[3px] border-[#141414] shadow-2xl" />
                                        </Link>
                                    ))}
                                    <button className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-dark-muted hover:border-brand-primary hover:text-white transition-all shadow-xl group/add">
                                        <Plus size={12} className="md:w-[20px] md:h-[20px] group-hover/add:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* SIGNAL FEED */}
                            <div className="space-y-6 md:space-y-8 pt-2 md:pt-4">
                                {socialPulse.length > 0 ? socialPulse.map((post, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group space-y-4 md:space-y-5 p-6 md:p-8 border border-white/5 rounded-3xl bg-black/20 hover:bg-white/[0.04] transition-all hover:border-brand-primary/20 shadow-xl"
                                    >
                                        <div className="flex items-center gap-2.5 md:gap-4">
                                            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-primary shadow-xl flex items-center justify-center text-dark-bg text-[10px] md:text-sm font-black italic">
                                                {post.author?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] md:text-sm font-black text-white uppercase tracking-tight truncate">{post.author?.name}</span>
                                                    <span className="text-[7px] md:text-[9px] font-black text-dark-muted uppercase opacity-40">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-[7px] md:text-[10px] text-brand-primary font-black uppercase tracking-widest opacity-60 mt-0.5">Transmission Active</p>
                                            </div>
                                        </div>
                                        <p className="text-xs md:text-[14px] text-dark-muted font-medium line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-6 md:gap-8 pt-1">
                                            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-brand-primary uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                                                <MessageSquare size={14} className="md:w-[16px] md:h-[16px]" /> <span>{post.comments?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                                                <Heart size={14} className="md:w-[16px] md:h-[16px]" fill="rgba(239, 68, 68, 0.4)" /> <span>{post.likes?.length || 0}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="py-24 text-center space-y-6 opacity-20 bg-black/20 rounded-[2rem] border-2 border-dashed border-white/5">
                                        <Users size={56} className="mx-auto" />
                                        <p className="text-xs font-black uppercase tracking-[0.5em]">No Global Signals</p>
                                    </div>
                                )}
                            </div>

                            <Link to="/community" className="block w-full py-5 md:py-6 bg-white/5 border-2 border-white/5 text-white rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] text-center hover:bg-brand-primary hover:text-dark-bg hover:border-brand-primary transition-all shadow-3xl">
                                Synchronize with Collective
                            </Link>
                        </div>
                    </div>

                    {/* AI DOMAIN MENTOR */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-brand-primary border border-brand-primary/20 rounded-[2rem] md:rounded-[3rem] p-5 md:p-12 relative overflow-hidden group text-center shadow-39 shadow-brand-primary/20 cursor-pointer"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20" />

                        <div className="relative z-10 space-y-6 md:space-y-10">
                            <div className="w-12 h-12 md:w-24 md:h-24 rounded-lg md:rounded-[1.5rem] bg-dark-bg flex items-center justify-center text-brand-primary mx-auto shadow-3xl group-hover:rotate-[360deg] transition-transform duration-1000 border-2 border-brand-primary/20">
                                <Rocket size={20} className="md:w-[40px] md:h-[40px]" />
                            </div>
                            <div className="space-y-1.5 md:space-y-4">
                                <h4 className="text-xl md:text-4xl font-black text-dark-bg uppercase tracking-tighter italic">AI MENTOR</h4>
                                <p className="text-[9px] md:text-sm text-dark-bg font-black leading-relaxed px-1 md:px-6 opacity-80 uppercase tracking-tight">
                                    Accelerate your domain mastery with high-fidelity predictive guidance.
                                </p>
                            </div>
                            <Link to="/neural-tutor" className="block w-full py-4 md:py-6 bg-dark-bg text-brand-primary rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                INITIATE AGENT
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
