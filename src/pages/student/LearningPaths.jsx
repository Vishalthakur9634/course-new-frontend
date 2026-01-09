import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Map, TrendingUp, Award, Clock, BookOpen, CheckCircle,
    Lock, Star, Target, Plus, Search, Filter, ArrowRight,
    PlayCircle, Users, BarChart3, Zap
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const LearningPaths = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const categories = ['all', 'development', 'data-science', 'design', 'business', 'marketing'];

    useEffect(() => {
        fetchPaths();
    }, []);

    const fetchPaths = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/learning-paths');
            setPaths(data);
        } catch (error) {
            console.error('Error fetching paths:', error);
            addToast('Failed to load learning paths', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStartPath = async (pathId) => {
        try {
            await api.post(`/learning-paths/enroll/${pathId}`);
            addToast('Mission Initialized: Learning Path Active', 'success');
            fetchPaths();
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to initialize mission', 'error');
        }
    };

    const handleUnenroll = async (pathId) => {
        try {
            await api.post(`/learning-paths/unenroll/${pathId}`);
            addToast('Mission Aborted: Path Deactivated', 'info');
            fetchPaths();
        } catch (error) {
            addToast('Failed to abort mission', 'error');
        }
    };

    const myPaths = paths.filter(p => p.progress > 0);
    const recommendedPaths = paths.filter(p => !p.progress || p.progress === 0);

    const stats = [
        { label: 'Active Paths', value: myPaths.length },
        { label: 'Completed', value: 23, suffix: '%' },
        { label: 'Total Hours', value: 156, suffix: 'hrs' },
        { label: 'Certificates', value: 0 }
    ];

    const filteredPaths = paths.filter(path => {
        const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
        const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Quest Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                    <div className="relative">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                        <h1 className="text-6xl font-black text-white tracking-tighter flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-dark-layer1 border border-white/10 flex items-center justify-center p-4 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Map size={40} className="text-purple-500 group-hover:scale-110 transition-transform" />
                            </div>
                            LEARNING <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">PATHS</span>
                        </h1>
                        <p className="text-dark-muted text-xl mt-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            Mission Protocol Active • Choose Your Frontier
                        </p>
                    </div>

                    <div className="flex gap-4 p-2 bg-dark-layer1/50 backdrop-blur-xl border border-white/5 rounded-2xl">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedCategory === cat
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-dark-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SVG Quest Map Concept */}
                <div className="mb-20 bg-dark-layer1/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none cyber-grid" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Target size={24} className="text-purple-500" />
                            ACTIVE QUEST MAP
                        </h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-dark-muted">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> COMPLETED</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> IN PROGRESS</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/10" /> LOCKED</span>
                        </div>
                    </div>

                    <div className="relative h-64 flex items-center justify-around z-10">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.3))' }}>
                            <path d="M 100 200 Q 300 100 500 200 T 900 200" fill="none" stroke="url(#line-gradient)" strokeWidth="4" strokeDasharray="12,12" className="animate-marquee" />
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {[
                            { pos: '10%', label: 'Foundation', status: 'done', icon: BookOpen },
                            { pos: '35%', label: 'Intermediate', status: 'active', icon: Star },
                            { pos: '60%', label: 'Advanced', status: 'locked', icon: Zap },
                            { pos: '85%', label: 'Mastery', status: 'locked', icon: Award }
                        ].map((node, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative bg-dark-bg z-20 ${node.status === 'done' ? 'border-purple-500 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
                                        node.status === 'active' ? 'border-blue-500 text-blue-500 animate-pulse' :
                                            'border-white/10 text-white/10'
                                        }`}
                                >
                                    <node.icon size={32} />
                                    {node.status === 'done' && <CheckCircle size={16} className="absolute -top-2 -right-2 bg-dark-bg rounded-full text-green-500" />}
                                </motion.div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${node.status === 'locked' ? 'text-white/10' : 'text-white'}`}>
                                    {node.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <StatWidget
                            key={idx}
                            {...stat}
                            icon={idx === 0 ? Map : idx === 1 ? CheckCircle : idx === 2 ? Clock : Award}
                            color="purple-500"
                            size="sm"
                        />
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" />
                        <input
                            type="text"
                            placeholder="Search learning paths..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-layer1 border border-white/5 rounded-xl text-white placeholder-dark-muted focus:outline-none focus:border-purple-500/50"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                                    : 'bg-dark-layer1 text-dark-muted border border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* My Active Paths */}
                {myPaths.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <PlayCircle size={24} className="text-purple-500" />
                            My Active Paths
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myPaths.map((path) => (
                                <FeatureCard
                                    key={path._id}
                                    icon={Map}
                                    title={path.title}
                                    description={path.description}
                                    badge={`${path.progress || 0}% Complete`}
                                    progress={path.progress || 0}
                                    stats={[
                                        { label: 'Courses', value: path.courses?.length || 0 },
                                        { label: 'Duration', value: path.duration }
                                    ]}
                                    primaryAction={{
                                        label: 'Continue Learning',
                                        onClick: () => addToast('Resuming simulation...', 'info')
                                    }}
                                    secondaryAction={{
                                        label: 'Abort Mission',
                                        onClick: () => handleUnenroll(path._id)
                                    }}
                                    gradient="from-purple-500/10 to-blue-500/10"
                                    glowColor="purple-500"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Discover Paths */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Star size={24} className="text-purple-500" />
                        Recommended Paths
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredPaths.filter(p => !p.progress || p.progress === 0).map((path) => (
                            <FeatureCard
                                key={path._id}
                                icon={Map}
                                title={path.title}
                                description={path.description}
                                badge={path.difficulty}
                                stats={[
                                    { label: 'Courses', value: path.courses?.length || 0 },
                                    { label: 'Students', value: (path.enrolledCount || 0).toLocaleString() }
                                ]}
                                primaryAction={{
                                    label: 'Initialize Path',
                                    onClick: () => handleStartPath(path._id)
                                }}
                                secondaryAction={{
                                    label: 'Analyze Details',
                                    onClick: () => addToast('Analyzing path data...', 'info')
                                }}
                                gradient="from-purple-500/10 to-blue-500/10"
                                glowColor="purple-500"
                                status="new"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPaths;
