import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Search, Filter, MapPin, DollarSign, Clock,
    Building2, TrendingUp, BookmarkPlus, ExternalLink, Plus, X, Loader2, Trash2, Send, Rocket, Sparkles
} from 'lucide-react';
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
            addToast('Application Transmitted', 'success');
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
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full mix-blend-screen" />
            </div>

            {/* Live Ticker */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-2 -mx-4 md:-mx-8 mb-8 overflow-hidden relative z-10">
                <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
                    <span className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> New Opportunity: Senior React Dev at TechFlow • $180k+
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> Remote: UX Designer at OrbitQuest • Equity
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> Hiring: Backend Engineer at CyberX • 0.5 BTC Signing
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> New Opportunity: Senior React Dev at TechFlow • $180k+
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> Remote: UX Designer at OrbitQuest • Equity
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] leading-none">
                        <TrendingUp size={12} /> Hiring: Backend Engineer at CyberX • 0.5 BTC Signing
                    </span>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tight flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-all">
                                <Briefcase className="text-white" size={32} />
                            </div>
                            CAREER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">ENGINE.</span>
                        </h1>
                        <p className="text-lg text-dark-muted font-medium ml-2">Discover opportunities matched to your neural profile.</p>
                    </div>

                    {isManager && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-3"
                        >
                            <Plus size={20} /> Post Opportunity
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <StatWidget
                            key={idx}
                            {...stat}
                            icon={idx === 0 ? Briefcase : idx === 1 ? Building2 : idx === 2 ? BookmarkPlus : TrendingUp}
                            color="blue-500"
                            size="sm"
                        />
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 bg-dark-layer1/50 backdrop-blur-md p-2 rounded-[2rem] border border-white/5">
                    <div className="flex-1 w-full lg:w-auto relative group px-4">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search jobs, companies, skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-bg border border-white/5 rounded-xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2 p-2 w-full lg:w-auto overflow-x-auto">
                        {['all', 'remote', 'full-time', 'contract'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${selectedType === type
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-dark-muted hover:text-white hover:bg-white/5'
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.005 }}
                            className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] group-hover:bg-blue-500/10 transition-colors" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-start gap-6 mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                            <Building2 size={28} className="text-dark-muted group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Sparkles size={10} /> {Math.floor(Math.random() * (99 - 85 + 1) + 85)}% Match
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-dark-muted">
                                                <span className="flex items-center gap-2">
                                                    <Building2 size={16} className="text-blue-500" />
                                                    {job.company}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-blue-500" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <DollarSign size={16} className="text-emerald-500" />
                                                    {job.salary}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock size={16} className="text-purple-500" />
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap pl-[5.5rem]">
                                        {job.skills?.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-1.5 bg-white/5 text-white/80 rounded-full text-xs font-bold border border-white/5 group-hover:border-blue-500/30 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 pl-[5.5rem] md:pl-0">
                                    {(user.role === 'superadmin' || user.role === 'admin' || job.postedBy?._id === user._id) && (
                                        <button onClick={() => handleDelete(job._id)} className="w-12 h-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                    <button className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                                        <BookmarkPlus size={20} />
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
                                        className="px-8 py-3 bg-white text-black rounded-xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 uppercase tracking-wider transform hover:-translate-y-1 shadow-lg"
                                    >
                                        Apply Now
                                        {job.applicationUrl ? <ExternalLink size={16} /> : <Rocket size={16} />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-32 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5">
                            <Briefcase size={64} className="text-dark-muted mx-auto mb-6 opacity-20" />
                            <h3 className="text-2xl font-black text-white mb-2">No Jobs Found</h3>
                            <p className="text-dark-muted">Try adjusting your filters or check back later.</p>
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
                                onSubmit={handleCreateJob}
                                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh]"
                            >
                                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Post <span className="text-blue-500">Opportunity</span></h2>
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-dark-muted hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Job Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Company</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Salary</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.salary}
                                            onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Type</label>
                                        <select
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Application URL</label>
                                        <input
                                            type="url"
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                            value={formData.applicationUrl}
                                            onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, TypeScript..."
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold placeholder:text-white/20"
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Description</label>
                                    <textarea
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32 font-medium placeholder:text-white/20 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                                    Deploy Job Listing
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
                                className="relative w-full max-w-xl bg-[#0a0a0a] border border-blue-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(59,130,246,0.2)] space-y-8"
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
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Digital Resume Link</label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://your-portfolio.com/resume.pdf"
                                            className="w-full bg-dark-bg border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/20 font-bold"
                                            value={applyData.resume}
                                            onChange={e => setApplyData({ ...applyData, resume: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Submission Memo</label>
                                        <textarea
                                            className="w-full bg-dark-bg border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none h-40 transition-all placeholder:text-white/20 font-medium resize-none"
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
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest hover:scale-[1.02]"
                                >
                                    {isApplying ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
                                    Transmit Data
                                </button>
                            </motion.form>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JobBoard;
