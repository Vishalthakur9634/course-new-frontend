import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import {
    Briefcase, Building, MapPin, DollarSign, Clock, CheckCircle,
    XCircle, Users, Plus, ChevronRight, Search, FileText, Globe
} from 'lucide-react';

const HiringChannel = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('browse'); // 'browse', 'create', 'applications'
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const { addToast } = useToast();

    // Form states
    const [formData, setFormData] = useState({
        title: '', company: '', description: '', location: '',
        type: 'Full-time', minSalary: '', maxSalary: '', skills: ''
    });

    const [applicationData, setApplicationData] = useState({
        portfolioLink: '', resumeLink: '', coverNote: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            fetchJobs(userData.role);
        }
    }, []);

    const fetchJobs = async (role) => {
        setLoading(true);
        try {
            if (role === 'instructor' || role === 'superadmin') {
                const { data } = await api.get('/hiring/my-posts');
                setMyPosts(data);
                if (viewMode === 'browse') setViewMode('recruiter'); // Default to recruiter view
            }
            // Fetch public jobs for everyone (students view this)
            const { data: publicJobs } = await api.get('/hiring');
            setJobs(publicJobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            addToast('Failed to load hiring channel', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hiring', {
                ...formData,
                salaryRange: { min: formData.minSalary, max: formData.maxSalary },
                skills: formData.skills.split(',').map(s => s.trim())
            });
            addToast('Job post created successfully', 'success');
            setViewMode('recruiter');
            fetchJobs(user.role);
        } catch (error) {
            console.error(error);
            addToast('Failed to create job post', 'error');
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/hiring/${selectedJob._id}/apply`, applicationData);
            addToast('Application submitted successfully', 'success');
            setShowApplyModal(false);
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Application failed', 'error');
        }
    };

    if (loading) return <div className="p-10 text-center text-dark-muted">Loading Hiring Channel...</div>;

    return (
        <div className="min-h-screen bg-dark-bg p-4 md:p-8 font-inter text-gray-200">
            <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <Briefcase className="text-brand-primary" size={40} /> Hiring Channel
                    </h1>
                    <p className="text-dark-muted font-bold uppercase tracking-widest mt-2">
                        {user?.role === 'student' ? 'Elite Career Opportunities' : 'Recruitment Command Center'}
                    </p>
                </div>
                {(user?.role === 'instructor' || user?.role === 'superadmin') && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setViewMode('recruiter')}
                            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs border ${viewMode === 'recruiter' ? 'bg-brand-primary text-dark-bg border-brand-primary' : 'bg-dark-layer2 border-white/10 hover:bg-white/5'}`}
                        >
                            Manage Posts
                        </button>
                        <button
                            onClick={() => setViewMode('create')}
                            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs border ${viewMode === 'create' ? 'bg-brand-primary text-dark-bg border-brand-primary' : 'bg-dark-layer2 border-white/10 hover:bg-white/5'}`}
                        >
                            <Plus size={14} className="inline mr-2" /> Post Job
                        </button>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto">
                {/* INSTRUCTOR: CREATE POST VIEW */}
                {viewMode === 'create' && (
                    <div className="max-w-3xl mx-auto bg-dark-layer1 border border-white/5 p-8 rounded-[2rem]">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Opportunity</h2>
                        <form onSubmit={handleCreatePost} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-dark-muted">Job Title</label>
                                    <input required className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="e.g. Senior React Developer" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-dark-muted">Company Name</label>
                                    <input required className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="e.g. TechCorp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-dark-muted">Job Description</label>
                                <textarea required rows="5" className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="Describe the role..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-dark-muted">Location</label>
                                    <input required className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="e.g. Remote" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-dark-muted">Salary Min</label>
                                    <input type="number" className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="50000" value={formData.minSalary} onChange={e => setFormData({ ...formData, minSalary: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-dark-muted">Salary Max</label>
                                    <input type="number" className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="80000" value={formData.maxSalary} onChange={e => setFormData({ ...formData, maxSalary: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-dark-muted">Required Skills (Comma separated)</label>
                                <input className="w-full bg-dark-layer2 border border-white/10 p-4 rounded-xl text-white focus:border-brand-primary outline-none" placeholder="React, Node.js, MongoDB" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-brand-primary text-dark-bg font-black uppercase py-4 rounded-xl hover:brightness-110 transition-all">Publish Opportunity</button>
                        </form>
                    </div>
                )}

                {/* INSTRUCTOR: MANAGE POSTS VIEW */}
                {viewMode === 'recruiter' && (
                    <div className="space-y-6">
                        {myPosts.map(post => (
                            <div key={post._id} className="bg-dark-layer1 border border-white/5 p-6 rounded-2xl md:flex justify-between items-center group hover:border-brand-primary/20 transition-all">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{post.title}</h3>
                                    <p className="text-dark-muted text-sm mt-1">{post.company} • {post.location} • {post.applicationCount || 0} Applicants</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex gap-4">
                                    <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase hover:bg-white/10">Edit</button>
                                    <button className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-bold uppercase hover:bg-brand-primary/20">View Applicants</button>
                                </div>
                            </div>
                        ))}
                        {myPosts.length === 0 && <div className="text-center py-20 text-dark-muted opacity-50">No active job posts found.</div>}
                    </div>
                )}

                {/* STUDENT/PUBLIC: JOB BOARD VIEW */}
                {(viewMode === 'browse' || (!user || user.role === 'student')) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-dark-layer1 border border-white/5 p-8 rounded-[2rem] hover:border-brand-primary/30 transition-all group flex flex-col items-start gap-4 shadow-xl">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-2">
                                    <Building className="text-brand-primary opacity-80" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white leading-tight">{job.title}</h3>
                                    <p className="text-brand-primary font-bold text-sm uppercase tracking-wider mt-1">{job.company}</p>
                                </div>
                                <div className="w-full h-px bg-white/5 my-2" />
                                <div className="flex flex-wrap gap-4 text-xs font-medium text-dark-muted">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {job.type}</span>
                                    {job.salaryRange && <span className="flex items-center gap-1.5"><DollarSign size={14} /> ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.skills?.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase text-white/60">{skill}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setSelectedJob(job); setShowApplyModal(true); }}
                                    className="w-full mt-4 bg-white/5 hover:bg-brand-primary hover:text-dark-bg text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* APPLY MODAL */}
            {showApplyModal && selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-dark-layer1 border border-white/10 p-8 rounded-[2rem] max-w-lg w-full relative">
                        <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-dark-muted hover:text-white"><XCircle /></button>
                        <h2 className="text-2xl font-bold text-white mb-2">Apply for {selectedJob.title}</h2>
                        <p className="text-dark-muted text-sm mb-6">at {selectedJob.company}</p>

                        <form onSubmit={handleApply} className="space-y-4">
                            <input className="w-full bg-dark-layer2 p-4 rounded-xl border border-white/5 text-white outline-none focus:border-brand-primary" placeholder="Portfolio URL" value={applicationData.portfolioLink} onChange={e => setApplicationData({ ...applicationData, portfolioLink: e.target.value })} />
                            <input className="w-full bg-dark-layer2 p-4 rounded-xl border border-white/5 text-white outline-none focus:border-brand-primary" placeholder="Resume URL (Google Drive/Dropbox)" value={applicationData.resumeLink} onChange={e => setApplicationData({ ...applicationData, resumeLink: e.target.value })} />
                            <textarea rows="4" className="w-full bg-dark-layer2 p-4 rounded-xl border border-white/5 text-white outline-none focus:border-brand-primary" placeholder="Why are you a good fit?" value={applicationData.coverNote} onChange={e => setApplicationData({ ...applicationData, coverNote: e.target.value })} />

                            <button type="submit" className="w-full bg-brand-primary text-dark-bg font-black uppercase py-4 rounded-xl hover:scale-[1.02] transition-transform">Submit Application</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HiringChannel;
