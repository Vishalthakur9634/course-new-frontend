import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderKanban, Search, Filter, Clock, DollarSign, Users,
    Star, Send, BookmarkPlus, Award, TrendingUp, Plus, X, Loader2, Trash2,
    Rocket, Briefcase, Building2
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
            addToast('Deployment Proposal Transmitted', 'success');
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
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 cyber-grid opacity-[0.03] pointer-events-none z-0" />

            {/* Floating Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tighter flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-dark-layer1 border border-white/10 flex items-center justify-center p-3 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Rocket size={32} className="text-blue-500 group-hover:scale-110 transition-transform" />
                            </div>
                            PROJECTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">MARKET</span>
                        </h1>
                        <p className="text-dark-muted text-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            Active Collaboration Terminal • 2.4k Talents Online
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end px-4 border-r border-white/10">
                            <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Global Activity</span>
                            <span className="text-lg font-black text-white">482 <span className="text-blue-500">Live Proposals</span></span>
                        </div>
                        {canManageProjects && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl"
                            >
                                LIST PROJECT
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-dark-layer1/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-xl bg-white/5 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    {idx === 0 ? <Rocket size={20} /> : idx === 1 ? <Users size={20} /> : idx === 2 ? <Briefcase size={20} /> : <TrendingUp size={20} />}
                                </div>
                                <span className="text-sm font-bold text-dark-muted uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white truncate">{stat.value}</span>
                                <span className="text-xs font-bold text-green-500">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-2 p-1 bg-dark-layer1 rounded-xl border border-white/5 w-fit">
                        {['browse', 'my-applications', 'saved'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === tab
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-dark-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'browse' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {projects.length > 0 ? projects.map((project) => (
                            <FeatureCard
                                key={project._id}
                                icon={FolderKanban}
                                title={project.title}
                                description={project.description}
                                badge={project.difficulty}
                                stats={[
                                    { label: 'Budget', value: project.budget },
                                    { label: 'Duration', value: project.duration },
                                    { label: 'Proposals', value: project.proposals || 0 }
                                ]}
                                primaryAction={{
                                    label: 'Apply Now',
                                    onClick: () => {
                                        setSelectedProject(project);
                                        setShowApplyModal(true);
                                    }
                                }}
                                secondaryAction={(user.role === 'superadmin' || user.role === 'admin' || project.postedBy?._id === user._id) ? {
                                    label: 'Delete',
                                    onClick: () => handleDelete(project._id),
                                    variant: 'danger'
                                } : {
                                    label: 'Save',
                                    onClick: () => console.log('Save', project._id)
                                }}
                                gradient="from-purple-500/10 to-pink-500/10"
                                glowColor="purple-500"
                            />
                        )) : (
                            <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                                <FolderKanban size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                                <p className="text-dark-muted">Try checking back later for new opportunities</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'my-applications' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {myApplications.length > 0 ? myApplications.map((app) => (
                            <div key={app._id} className="bg-dark-layer1 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Accepted' ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                                        app.status === 'Rejected' ? 'bg-red-500 text-white' :
                                            'bg-white/5 text-dark-muted border border-white/10'
                                    }`}>
                                    {app.status}
                                </div>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">{app.projectId?.title || 'Unknown Project'}</h3>
                                <p className="text-dark-muted text-sm font-bold mb-6 italic leading-relaxed">"{app.proposal?.substring(0, 100)}..."</p>
                                <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-2xl border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black text-dark-muted uppercase tracking-[0.2em]">Submitted On</span>
                                        <span className="text-white text-xs font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Rocket size={18} className="text-blue-500" />
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-24 text-center space-y-6 opacity-30">
                                <Send size={64} className="mx-auto" />
                                <p className="text-xl font-black uppercase tracking-[0.5em]">No Proposals Transmitted</p>
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
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setShowCreateModal(false)}
                            />
                            <motion.form
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onSubmit={handleCreateProject}
                                className="relative w-full max-w-2xl bg-dark-layer1 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-white uppercase italic">List New <span className="text-purple-500">Project</span></h2>
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="text-dark-muted hover:text-white"><X size={24} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Project Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
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
                                        <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Budget (e.g. $500 - $1000)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                            value={formData.budget}
                                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Duration (e.g. 2 weeks)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Required Skills</label>
                                    <input
                                        type="text"
                                        placeholder="React, Firebase, Tailwind..."
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Description</label>
                                    <textarea
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-purple-500 outline-none h-32"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                    List Project Opportunity
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
                                className="relative w-full max-w-xl bg-dark-layer1 border border-purple-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(168,85,247,0.2)] space-y-8"
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
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Implementation Strategy / Proposal</label>
                                        <textarea
                                            className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-purple-500 outline-none h-60 transition-all placeholder:text-white/10 font-bold resize-none"
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
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest"
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
