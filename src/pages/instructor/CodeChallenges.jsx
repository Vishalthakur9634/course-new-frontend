import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code, Plus, Edit, Play, CheckCircle, XCircle, Clock,
    Award, Users, BarChart3, TrendingUp, FileCode, Loader2,
    Trash2, X, Search, Filter, BookOpen
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CodeChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        difficulty: 'Medium',
        points: '100',
        language: 'javascript',
        starterCode: '// Write your solution here...',
        testCases: '' // ideally JSON
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isInstructor = ['instructor', 'superadmin', 'admin'].includes(user.role);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [challengesRes, coursesRes] = await Promise.all([
                api.get('/practice'), // Our new global route
                api.get('/courses')   // Assuming this exists to populate dropdown
            ]);
            setChallenges(Array.isArray(challengesRes.data) ? challengesRes.data : []);
            setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Don't toast error on mount if it's just 403 or empty
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/practice', formData);
            addToast('Challenge initialized successfully', 'success');
            setShowCreateModal(false);
            setFormData({
                title: '', description: '', courseId: '', difficulty: 'Medium',
                points: '100', language: 'javascript', starterCode: '// Write your solution here...', testCases: ''
            });
            fetchData();
        } catch (error) {
            addToast('Failed to create challenge', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this challenge?')) return;
        try {
            await api.delete(`/practice/${id}`);
            addToast('Challenge deleted', 'success');
            fetchData();
        } catch (error) {
            addToast('Deletion failed', 'error');
        }
    };

    const stats = [
        { label: 'Total Challenges', value: challenges.length },
        { label: 'Active Submissions', value: '...', icon: Play },
        { label: 'Avg Pass Rate', value: '...', suffix: '%', icon: CheckCircle },
        { label: 'System Load', value: 'Optimal', icon: BarChart3 }
    ];

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && challenges.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <Code size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white mb-1 tracking-tight">
                                CODE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">ARENA</span>
                            </h1>
                            <p className="text-dark-muted font-bold text-sm uppercase tracking-widest">
                                Manage Algorithms & Assessments
                            </p>
                        </div>
                    </div>

                    {isInstructor && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-3"
                        >
                            <Plus size={20} /> New Protocol
                        </button>
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        color="green-500"
                        size="sm"
                    />
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4 mb-8 bg-dark-layer1 border border-white/5 p-2 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search algorithms..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent p-3 pl-12 text-white outline-none font-bold placeholder:text-dark-muted/50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredChallenges.length > 0 ? filteredChallenges.map((challenge) => (
                    <motion.div
                        key={challenge._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 hover:border-green-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-all" />

                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${challenge.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {challenge.difficulty}
                            </span>
                            {isInstructor && (
                                <button onClick={() => handleDelete(challenge._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <h3 className="text-xl font-black text-white mb-2 line-clamp-1">{challenge.title}</h3>
                        <p className="text-dark-muted text-sm font-medium mb-6 line-clamp-2">{challenge.description}</p>

                        <div className="flex items-center gap-2 mb-6 text-xs font-bold text-dark-muted">
                            <BookOpen size={14} className="text-blue-500" />
                            {challenge.courseId?.title || 'General Pool'}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <span className="block text-[10px] uppercase text-dark-muted font-bold">Points</span>
                                <span className="text-white font-black">{challenge.points}</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <span className="block text-[10px] uppercase text-dark-muted font-bold">Type</span>
                                <span className="text-white font-black">{challenge.type || 'Code'}</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white/5 hover:bg-green-500 hover:text-white text-white rounded-xl border border-white/5 hover:border-transparent font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <Edit size={16} /> View Details
                        </button>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-32 text-center bg-[#0a0a0a] rounded-[3rem] border border-white/5">
                        <Code size={64} className="mx-auto text-dark-muted opacity-20 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">No Challenges Found</h3>
                        <p className="text-dark-muted">Initialize a new protocol to begin.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.form
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleCreate}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">New <span className="text-green-500">Algorithm</span></h2>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-dark-muted hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Title</label>
                                    <input type="text" className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-green-500 outline-none font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Course Context</label>
                                    <select className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-green-500 outline-none font-bold" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })} required>
                                        <option value="">Select Course...</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Difficulty</label>
                                    <select className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-green-500 outline-none font-bold" value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                                        <option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Points</label>
                                    <input type="number" className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-green-500 outline-none font-bold" value={formData.points} onChange={e => setFormData({ ...formData, points: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Description</label>
                                <textarea className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-green-500 outline-none h-32 font-medium resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Starter Code</label>
                                <textarea className="w-full bg-[#1e1e1e] border border-white/5 rounded-xl p-4 text-white font-mono text-xs h-32 resize-none" value={formData.starterCode} onChange={e => setFormData({ ...formData, starterCode: e.target.value })} />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Code size={24} />}
                                Initialize Challenge
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeChallenges;
