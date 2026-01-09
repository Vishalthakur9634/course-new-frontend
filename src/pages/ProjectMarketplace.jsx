import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderKanban, Search, Filter, Clock, DollarSign, Users,
    Star, Send, BookmarkPlus, Award, TrendingUp, Plus, X, Loader2, Trash2,
    Rocket, Briefcase, Zap, CheckCircle
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const ProjectMarketplace = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [proposalData, setProposalData] = useState({ proposal: '' });
    const [myApplications, setMyApplications] = useState([]);
    const [isApplying, setIsApplying] = useState(false);
    const { addToast } = useToast();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const canManageProjects = user.role === 'superadmin' || user.role === 'admin' || user.role === 'instructor';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        duration: '',
        difficulty: 'Intermediate',
        skills: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const [projRes, appRes] = await Promise.all([
                api.get('/projects'),
                api.get('/projects/my/applications')
            ]);
            setProjects(Array.isArray(projRes.data) ? projRes.data : []);
            setMyApplications(Array.isArray(appRes.data) ? appRes.data : []);
        } catch (error) {
            console.error('Error fetching project data:', error);
            addToast('Failed to load project system', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/projects', formData);
            addToast('Project listed successfully', 'success');
            setShowCreateModal(false);
            setFormData({ title: '', description: '', budget: '', duration: '', difficulty: 'Intermediate', skills: '' });
            fetchProjects();
        } catch (error) {
            addToast('Failed to list project', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setIsApplying(true);
        try {
            await api.post(`/projects/${selectedProject._id}/apply`, proposalData);
            addToast('Proposal Submitted Successfully', 'success');
            setShowApplyModal(false);
            setProposalData({ proposal: '' });
            fetchProjects();
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to transmit proposal', 'error');
        } finally {
            setIsApplying(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            addToast('Project removed', 'success');
            fetchProjects();
        } catch (error) {
            addToast('Failed to remove project', 'error');
        }
    };

    const stats = [
        { label: 'Available Projects', value: projects.length, trend: '+12%', trendColor: 'text-blue-500' },
        { label: 'My Applications', value: myApplications.length, trend: 'Active', trendColor: 'text-purple-500' },
        { label: 'Proposals Recieved', value: projects.reduce((acc, p) => acc + (p.proposals || 0), 0), trend: 'Global', trendColor: 'text-green-500' },
        { label: 'Success Velocity', value: 'High', trend: '98%', trendColor: 'text-blue-500' }
    ];

    if (loading && projects.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[30%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tight flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-3 group-hover:rotate-0 transition-all">
                                <Rocket className="text-white" size={32} />
                            </div>
                            PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">MARKET</span>
                        </h1>
                        <p className="text-lg text-dark-muted font-medium ml-2">Active collaboration terminal for ambitious developers.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end px-6 border-r border-white/10">
                            <span className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] mb-1">Global Activity</span>
                            <span className="text-lg font-black text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                482 <span className="text-purple-500">Live Contracts</span>
                            </span>
                        </div>
                        {canManageProjects && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-3"
                            >
                                <Plus size={20} /> List Project
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] group hover:border-purple-500/30 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                {idx === 0 ? <Rocket size={64} /> : idx === 1 ? <FolderKanban size={64} /> : idx === 2 ? <Users size={64} /> : <TrendingUp size={64} />}
                            </div>
                            <div className="flex items-center gap-4 mb-3 relative z-10">
                                <div className="p-3 rounded-xl bg-white/5 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    {idx === 0 ? <Rocket size={20} /> : idx === 1 ? <FolderKanban size={20} /> : idx === 2 ? <Users size={20} /> : <TrendingUp size={20} />}
                                </div>
                                <span className="text-xs font-black text-dark-muted uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <span className="text-3xl font-black text-white truncate">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-8 flex justify-between items-center bg-[#0a0a0a] p-2 rounded-[1.5rem] border border-white/5 w-fit">
                    {['browse', 'my-applications', 'saved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'text-dark-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>

                {activeTab === 'browse' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.length > 0 ? projects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <FolderKanban size={28} className="text-dark-muted group-hover:text-white transition-colors" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${project.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            project.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {project.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors">{project.title}</h3>
                                <p className="text-dark-muted text-sm font-medium leading-relaxed mb-6 line-clamp-3">{project.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <span className="block text-[10px] uppercase tracking-wider text-dark-muted font-bold mb-1">Budget</span>
                                        <span className="text-white font-bold flex items-center gap-1"><DollarSign size={14} className="text-green-500" /> {project.budget}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <span className="block text-[10px] uppercase tracking-wider text-dark-muted font-bold mb-1">Duration</span>
                                        <span className="text-white font-bold flex items-center gap-1"><Clock size={14} className="text-blue-500" /> {project.duration}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-auto">
                                    {(user.role === 'superadmin' || user.role === 'admin' || project.postedBy?._id === user._id) ? (
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                                            <BookmarkPlus size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setShowApplyModal(true);
                                        }}
                                        className="flex-1 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-32 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5">
                                <FolderKanban size={64} className="text-dark-muted mx-auto mb-6 opacity-20" />
                                <h3 className="text-2xl font-black text-white mb-2">No Projects Found</h3>
                                <p className="text-dark-muted">Try checking back later for new opportunities</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'my-applications' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {myApplications.length > 0 ? myApplications.map((app) => (
                            <div key={app._id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-white/10 transition-all">
                                <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${app.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                    app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        'bg-white/5 text-dark-muted border border-white/10'
                                    }`}>
                                    {app.status === 'Accepted' && <CheckCircle size={12} />}
                                    {app.status}
                                </div>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">{app.projectId?.title || 'Unknown Project'}</h3>
                                <p className="text-dark-muted text-sm font-medium mb-6 italic leading-relaxed pl-4 border-l-2 border-purple-500/30">"{app.proposal?.substring(0, 100)}..."</p>
                                <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-2xl border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black text-dark-muted uppercase tracking-[0.2em]">Submitted On</span>
                                        <span className="text-white text-xs font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Rocket size={18} className="text-purple-500" />
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 text-center bg-[#0a0a0a] rounded-[2.5rem] border border-white/5">
                                <Send size={64} className="mx-auto text-dark-muted opacity-20 mb-6" />
                                <h3 className="text-2xl font-black text-white mb-2">No Applications</h3>
                                <p className="text-dark-muted">You haven't submitted any proposals yet.</p>
                            </div>
                        )}
                    </div>
                )}

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
                                onSubmit={handleCreateProject}
                                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">List <span className="text-purple-500">Project</span></h2>
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-dark-muted hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Project Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Difficulty</label>
                                        <select
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none font-bold"
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Budget</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.budget}
                                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Duration</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Required Skills</label>
                                    <input
                                        type="text"
                                        placeholder="React, Firebase, Tailwind..."
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none font-bold placeholder:text-white/20"
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Description</label>
                                    <textarea
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-purple-500 outline-none h-32 font-medium placeholder:text-white/20 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                                    Launch Project Listing
                                </button>
                            </motion.form>
                        </div>
                    )}
                </AnimatePresence>

                {/* Proposal Modal */}
                <AnimatePresence>
                    {showApplyModal && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                onClick={() => setShowApplyModal(false)}
                            />
                            <motion.form
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onSubmit={handleApply}
                                className="relative w-full max-w-xl bg-[#0a0a0a] border border-purple-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(168,85,247,0.2)] space-y-8"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <button type="button" onClick={() => setShowApplyModal(false)} className="text-dark-muted hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Initialize <span className="text-purple-500">Proposal</span></h2>
                                    <p className="text-dark-muted font-bold text-xs tracking-[0.3em] uppercase">Target: {selectedProject?.title}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Strategy & Implementation</label>
                                        <textarea
                                            className="w-full bg-dark-bg border border-white/5 rounded-2xl p-4 text-white focus:border-purple-500 outline-none h-60 transition-all placeholder:text-white/20 font-medium resize-none"
                                            placeholder="Outline your approach, timeline, and relevant experience..."
                                            value={proposalData.proposal}
                                            onChange={e => setProposalData({ ...proposalData, proposal: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isApplying}
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest hover:scale-[1.02]"
                                >
                                    {isApplying ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
                                    Transmit Proposal
                                </button>
                            </motion.form>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProjectMarketplace;
