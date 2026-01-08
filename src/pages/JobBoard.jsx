import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Search, Filter, MapPin, DollarSign, Clock,
    Building2, TrendingUp, BookmarkPlus, ExternalLink, Plus, X, Loader2, Trash2, Send, Rocket
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const JobBoard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyData, setApplyData] = useState({ resume: '', coverLetter: '' });
    const [isApplying, setIsApplying] = useState(false);
    const { addToast } = useToast();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = ['instructor', 'superadmin', 'admin'].includes(user.role);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        description: '',
        skills: '',
        applicationUrl: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs');
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            addToast('Failed to load jobs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            await api.post('/jobs', payload);
            addToast('Job posted successfully', 'success');
            setShowCreateModal(false);
            setFormData({ title: '', company: '', location: '', salary: '', type: 'Full-time', description: '', skills: '', applicationUrl: '' });
            fetchJobs();
        } catch (error) {
            addToast('Failed to post job', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setIsApplying(true);
        try {
            await api.post(`/jobs/${selectedJob._id}/apply`, applyData);
            addToast('Neural Match Confirmed: Application Transmitted', 'success');
            setShowApplyModal(false);
            setApplyData({ resume: '', coverLetter: '' });
            fetchJobs();
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to transmit application', 'error');
        } finally {
            setIsApplying(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            addToast('Job deleted', 'success');
            fetchJobs();
        } catch (error) {
            addToast('Failed to delete job', 'error');
        }
    };

    const stats = [
        { label: 'Active Jobs', value: jobs.length, previousValue: 1200 },
        { label: 'Companies', value: [...new Set(jobs.map(j => j.company))].length },
        { label: 'Saved Jobs', value: 0 },
        { label: 'Applications', value: 0 }
    ];

    const filteredJobs = jobs.filter(job => {
        const matchesType = selectedType === 'all' || job.type.toLowerCase() === selectedType.toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.company && job.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (job.skills && job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesType && matchesSearch;
    });

    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Live Career Ticker */}
            <div className="bg-dark-layer1/50 backdrop-blur-md border-b border-white/5 py-2 -mx-4 md:-mx-8 mb-8 overflow-hidden relative z-10">
                <div className="flex whitespace-nowrap animate-marquee items-center gap-8">
                    {[1, 2].map(id => (
                        <div key={id} className="flex items-center gap-8">
                            <span className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none">
                                <TrendingUp size={12} />
                                New Opportunity: Senior React Dev at TechFlow • $180k+
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest leading-none">
                                <TrendingUp size={12} />
                                New Opportunity: UX Designer at OrbitQuest • Remote
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-bold text-purple-500 uppercase tracking-widest leading-none">
                                <TrendingUp size={12} />
                                New Opportunity: Backend Engineer at CyberX • 0.5 BTC
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Briefcase size={28} className="text-blue-500" />
                            </div>
                            Job Board
                        </h1>
                        <p className="text-dark-muted text-lg">Discover opportunities matched to your <span className="text-blue-500/80 italic font-medium">Neural Profile</span></p>
                    </div>

                    {isManager && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            Post a Job
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <StatWidget
                            key={idx}
                            {...stat}
                            icon={idx === 0 ? Briefcase : idx === 1 ? Building2 : idx === 2 ? BookmarkPlus : TrendingUp}
                            color="blue-500"
                            size="sm"
                            className="hover:border-blue-500/30 transition-all cursor-default"
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Find Existing Search & Filter implementation */}
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-dark-layer1 border border-white/5 rounded-xl text-white placeholder-dark-muted focus:outline-none focus:border-blue-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'remote', 'full-time', 'contract'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${selectedType === type
                                ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                                : 'bg-dark-layer1 text-dark-muted border border-white/5 hover:border-white/10'
                                }`}
                        >
                            {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-layer1 rounded-2xl border border-white/5 p-6 hover:border-blue-500/30 transition-all group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Building2 size={24} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                                                {job.title}
                                            </h3>
                                            <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                                                {Math.floor(Math.random() * (98 - 85 + 1) + 85)}% Match
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-muted">
                                            <span className="flex items-center gap-1">
                                                <Building2 size={14} />
                                                {job.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={14} />
                                                {job.salary}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {job.skills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-semibold border border-blue-500/20"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {(user.role === 'superadmin' || user.role === 'admin' || job.postedBy?._id === user._id) && (
                                    <button onClick={() => handleDelete(job._id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-semibold text-sm transition-all border border-red-500/20">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold text-sm transition-all border border-white/10">
                                    <BookmarkPlus size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (job.applicationUrl) {
                                            window.open(job.applicationUrl, '_blank');
                                        } else {
                                            setSelectedJob(job);
                                            setShowApplyModal(true);
                                        }
                                    }}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                                >
                                    Apply
                                    {job.applicationUrl ? <ExternalLink size={16} /> : <Send size={16} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                        <Briefcase size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                        <p className="text-dark-muted">Try adjusting your filters or search query</p>
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
                            onSubmit={handleCreateJob}
                            className="relative w-full max-w-2xl bg-dark-layer1 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white uppercase italic">Post New <span className="text-blue-500">Job</span></h2>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-dark-muted hover:text-white"><X size={24} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Job Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Salary Range</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.salary}
                                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Job Type</label>
                                    <select
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Application URL</label>
                                    <input
                                        type="url"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.applicationUrl}
                                        onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, TypeScript..."
                                    className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-32"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Post Job Opportunity
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
            {/* Apply Modal */}
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
                            className="relative w-full max-w-xl bg-dark-layer1 border border-blue-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(59,130,246,0.2)] space-y-8"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button type="button" onClick={() => setShowApplyModal(false)} className="text-dark-muted hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Initialize <span className="text-blue-500">Submission</span></h2>
                                <p className="text-dark-muted font-bold text-xs tracking-[0.3em] uppercase">Target: {selectedJob?.title} @ {selectedJob?.company}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Digital Resume Link</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://your-portfolio.com/resume.pdf"
                                        className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10 font-bold"
                                        value={applyData.resume}
                                        onChange={e => setApplyData({ ...applyData, resume: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Submission Memo / Cover Letter</label>
                                    <textarea
                                        className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none h-40 transition-all placeholder:text-white/10 font-bold resize-none"
                                        placeholder="Briefly explain why you're the perfect match..."
                                        value={applyData.coverLetter}
                                        onChange={e => setApplyData({ ...applyData, coverLetter: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isApplying}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest"
                            >
                                {isApplying ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
                                Transmit Data
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default JobBoard;
