import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map, Plus, Edit, Save, Trash2, Eye, Copy, Settings,
    BookOpen, ArrowRight, GripVertical, X, Loader2, TrendingUp,
    ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const LearningPathCreator = () => {
    const [paths, setPaths] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'development',
        difficulty: 'Intermediate',
        duration: '',
        courses: [] // Array of { courseId, milestone }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pathsRes, coursesRes] = await Promise.all([
                api.get('/learning-paths'),
                api.get('/courses')
            ]);
            setPaths(Array.isArray(pathsRes.data) ? pathsRes.data : []);
            setCourses(Array.isArray(coursesRes.data) ? coursesRes.data.filter(c => c.status === 'Published') : []);
        } catch (error) {
            addToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePath = async (e) => {
        e.preventDefault();
        if (formData.courses.length === 0) {
            addToast('Please add at least one course to the path', 'warning');
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/learning-paths', formData);
            addToast('Learning path created', 'success');
            setShowCreateModal(false);
            setFormData({ title: '', description: '', category: 'development', difficulty: 'Intermediate', duration: '', courses: [] });
            fetchData();
        } catch (error) {
            addToast('Failed to create learning path', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this learning path?')) return;
        try {
            await api.delete(`/learning-paths/${id}`);
            addToast('Path deleted', 'success');
            fetchData();
        } catch (error) {
            addToast('Failed to delete path', 'error');
        }
    };

    const toggleCourseSelection = (courseId) => {
        setFormData(prev => {
            const exists = prev.courses.find(c => c.courseId === courseId);
            if (exists) {
                return { ...prev, courses: prev.courses.filter(c => c.courseId !== courseId) };
            } else {
                return { ...prev, courses: [...prev.courses, { courseId, milestone: `Step ${prev.courses.length + 1}` }] };
            }
        });
    };

    const stats = [
        { label: 'Published Paths', value: paths.length },
        { label: 'Total Students', value: paths.reduce((acc, p) => acc + (p.enrolledCount || 0), 0) },
        { label: 'Courses Linked', value: [...new Set(paths.flatMap(p => p.courses.map(c => c.courseId)))].length },
        { label: 'Active Drafts', value: 0 }
    ];

    if (loading && paths.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                                <Map size={28} className="text-purple-500" />
                            </div>
                            Learning Path Creator
                        </h1>
                        <p className="text-dark-muted text-lg">Design curated learning journeys for your students</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        <Plus size={20} />
                        Create New Path
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? Map : idx === 1 ? BookOpen : idx === 2 ? TrendingUp : Edit}
                        color="purple-500"
                        size="sm"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paths.length > 0 ? paths.map((path) => (
                    <FeatureCard
                        key={path._id}
                        icon={Map}
                        title={path.title}
                        description={path.description}
                        badge={path.difficulty}
                        stats={[
                            { label: 'Courses', value: path.courses.length },
                            { label: 'Students', value: path.enrolledCount || 0 }
                        ]}
                        primaryAction={{
                            label: 'Edit Path',
                            onClick: () => console.log('Edit', path._id)
                        }}
                        secondaryAction={{
                            label: 'Delete',
                            onClick: () => handleDelete(path._id),
                            variant: 'danger'
                        }}
                        gradient="from-purple-500/10 to-blue-500/10"
                        glowColor="purple-500"
                        status="available"
                    />
                )) : (
                    <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                        <Map size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">No learning paths created</h3>
                        <p className="text-dark-muted">Start by creating your first curated learning journey</p>
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.form
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleCreatePath}
                            className="relative w-full max-w-3xl bg-dark-layer1 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white uppercase italic">Create <span className="text-purple-500">Learning Path</span></h2>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-dark-muted hover:text-white"><X size={24} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Path Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Category</label>
                                    <select
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="development">Development</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="design">Design</option>
                                        <option value="business">Business</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Difficulty</label>
                                    <select
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Duration (e.g. 3 Months)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="Flexible"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Select Courses & Milestones</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                    {courses.map(course => {
                                        const isSelected = formData.courses.find(c => c.courseId === course._id);
                                        return (
                                            <div
                                                key={course._id}
                                                onClick={() => toggleCourseSelection(course._id)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isSelected
                                                    ? 'bg-purple-500/20 border-purple-500/50'
                                                    : 'bg-dark-bg border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-dark-layer2 overflow-hidden">
                                                        {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <span className="text-sm text-white font-medium line-clamp-1">{course.title}</span>
                                                </div>
                                                {isSelected && <CheckCircle2 size={16} className="text-purple-500" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Publish Learning Journey
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LearningPathCreator;
