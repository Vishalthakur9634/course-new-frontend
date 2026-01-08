import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase, FileText, User, TrendingUp, Download, Edit,
    Award, BookOpen, Target, Sparkles, Building2, Calendar
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';

import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CareerCenter = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs');
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching career data:', error);
            addToast('Failed to sync career protocols', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (jobId) => {
        // Redirect to Job Board with selected job
        window.location.href = `/job-board?apply=${jobId}`;
    };

    const stats = [
        { label: 'Applications', value: user.applications?.length || 0 },
        { label: 'Profile Views', value: 142 + (user.xp % 100), previousValue: 120 },
        { label: 'Skills', value: user.skills?.length || 0 },
        { label: 'Certificates', value: user.certificatesCount || 0 }
    ];

    const jobMatches = jobs.slice(0, 2).map(job => ({
        ...job,
        matchScore: 75 + Math.floor(Math.random() * 20),
        salary: job.salary || 'Competitive'
    }));

    return (
        <div className="min-h-screen bg-dark-bg font-orbit">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Briefcase size={28} className="text-blue-500" />
                    </div>
                    Career Center
                </h1>
                <p className="text-dark-muted text-lg">Build your career with personalized tools and resources</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? Briefcase : idx === 1 ? TrendingUp : idx === 2 ? Award : FileText}
                        color="blue-500"
                        size="sm"
                    />
                ))}
            </div>

            <div className="mb-6">
                <div className="flex gap-2 p-1 bg-dark-layer1 rounded-xl border border-white/5 w-fit">
                    {['overview', 'resume', 'portfolio', 'jobs'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === tab
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                : 'text-dark-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'jobs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobMatches.map((job) => (
                        <FeatureCard
                            key={job.id}
                            icon={Building2}
                            title={job.title}
                            description={`${job.company} • ${job.location}`}
                            badge={`${job.matchScore}% Match`}
                            stats={[
                                { label: 'Salary', value: job.salary }
                            ]}
                            primaryAction={{
                                label: 'Apply Now',
                                onClick: () => handleApply(job._id)
                            }}
                            secondaryAction={{
                                label: 'Save',
                                onClick: () => addToast('Signal Stored in Neural Archive', 'success')
                            }}
                            gradient="from-blue-500/10 to-purple-500/10"
                            glowColor="blue-500"
                        />
                    ))}
                </div>
            )}

            {activeTab === 'resume' && (
                <div className="bg-dark-layer1 rounded-2xl border border-white/5 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Resume Builder</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-500 rounded-lg font-semibold border border-blue-500/30 hover:bg-blue-500/30 transition-all">
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 bg-dark-layer2 rounded-xl border border-white/5">
                            <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Profile Identity</h4>
                            <p className="text-sm text-white font-medium">{user.name}</p>
                            <p className="text-xs text-dark-muted">{user.email}</p>
                        </div>
                        <div className="p-6 bg-dark-layer2 rounded-xl border border-white/5">
                            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Skill Matrix</h4>
                            <div className="flex flex-wrap gap-2">
                                {user.skills?.length > 0 ? user.skills.map(s => (
                                    <span key={s} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">{s}</span>
                                )) : <span className="text-xs text-dark-muted">No skills indexed in profile</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'portfolio' && (
                <div className="bg-dark-layer1 rounded-2xl border border-white/5 p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Portfolio Builder</h2>
                    <p className="text-dark-muted">Showcase your completed projects and certificates in a professional portfolio.</p>
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={FileText}
                        title="Resume Builder"
                        description="Create a professional resume"
                        primaryAction={{
                            label: 'Build Resume',
                            onClick: () => setActiveTab('resume')
                        }}
                        gradient="from-blue-500/10 to-purple-500/10"
                        glowColor="blue-500"
                    />
                    <FeatureCard
                        icon={Award}
                        title="Portfolio"
                        description="Showcase your work"
                        primaryAction={{
                            label: 'Build Portfolio',
                            onClick: () => setActiveTab('portfolio')
                        }}
                        gradient="from-blue-500/10 to-purple-500/10"
                        glowColor="blue-500"
                    />
                    <FeatureCard
                        icon={Briefcase}
                        title="Job Board"
                        description="Find matching opportunities"
                        primaryAction={{
                            label: 'Browse Jobs',
                            onClick: () => setActiveTab('jobs')
                        }}
                        gradient="from-blue-500/10 to-purple-500/10"
                        glowColor="blue-500"
                    />
                </div>
            )}
        </div>
    );
};

export default CareerCenter;
