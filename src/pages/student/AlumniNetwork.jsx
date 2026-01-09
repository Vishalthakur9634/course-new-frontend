import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, GraduationCap, Search, Filter, MapPin,
    Briefcase, MessageCircle, Share2, Award, Star,
    CheckCircle, Globe, ChevronRight, Bookmark
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const AlumniNetwork = () => {
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchAlumni();
    }, [selectedRole, searchQuery]);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/users/directory?role=${selectedRole}&search=${searchQuery}`);
            setAlumni(data);
        } catch (error) {
            console.error('Error fetching alumni:', error);
            addToast('Failed to sync network signals', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await api.post(`/users/follow/${userId}`);
            addToast('Connection Protocol Established', 'success');
            fetchAlumni();
        } catch (error) {
            addToast('Synchronisation Interrupted', 'error');
        }
    };

    const stats = [
        { label: 'Total Alumni', value: 4500, icon: GraduationCap },
        { label: 'Hired Globally', value: 3800, suffix: '+', icon: Globe },
        { label: 'Career Mentors', value: 340, icon: Users },
        { label: 'Avg. Salary Lift', value: 45, suffix: '%', icon: Award }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                <GraduationCap className="text-orange-500" size={24} />
                            </div>
                            Alumni Network
                        </h1>
                        <p className="text-dark-muted">Connect with graduates and explore career opportunities</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="orange-500" />
                ))}
            </div>

            {/* Search and Discovery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, company, or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-dark-layer1 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-layer1 border border-white/5 rounded-2xl text-white font-bold hover:border-orange-500/30 transition-all">
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {alumni.map((member, idx) => (
                            <motion.div
                                key={member._id || member.id || idx}
                                className="bg-dark-layer1 border border-white/5 rounded-3xl p-6 group hover:border-orange-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-dark-layer2 p-1 border border-white/10">
                                        <div className="w-full h-full rounded-xl bg-orange-500/20 flex items-center justify-center font-bold text-orange-500">
                                            {member.name[0]}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnect(member._id)}
                                        className={`p-2 rounded-xl transition-all ${member.followers?.includes(currentUser._id) ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-dark-muted bg-dark-layer2 border border-white/5 hover:text-orange-500'}`}
                                    >
                                        {member.followers?.includes(currentUser._id) ? <CheckCircle size={18} /> : <MessageCircle size={18} />}
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">{member.name}</h3>
                                <p className="text-sm font-medium text-white mb-4">{member.role}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-dark-muted font-medium">
                                        <GraduationCap size={14} className="text-orange-500" />
                                        Cohort {new Date(member.createdAt).getFullYear()}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-dark-muted font-medium">
                                        <Users size={14} className="text-orange-500" />
                                        {member.followers?.length || 0} Professional Connections
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {(member.skills || []).map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-dark-layer2 border border-white/5 rounded-lg text-[8px] font-bold text-dark-muted uppercase tracking-widest">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(`/student-profile/${member._id}`)}
                                    className="w-full py-3 bg-dark-layer2 border border-white/5 text-white text-xs font-bold rounded-xl hover:bg-orange-500 hover:border-orange-500 transition-all"
                                >
                                    View Full Career Profile
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Alumni Success Stories & Perks */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Star className="text-orange-500" size={20} />
                            Success Showcase
                        </h2>
                        <div className="space-y-6">
                            {[1, 2].map(i => (
                                <div key={i} className="group cursor-pointer">
                                    <h4 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors mb-2">How I leveraged Quest to land my dream job at Microsoft</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-dark-muted font-bold uppercase tracking-widest">
                                        <GraduationCap size={12} />
                                        By Liam Johnson
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 text-orange-500 font-bold text-sm flex items-center gap-2 hover:underline">
                            View All Stories <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-500" size={20} />
                            Exclusive Perks
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: 'Life-time Content Access', icon: CheckCircle },
                                { title: 'Mentorship Discounts', icon: CheckCircle },
                                { title: 'Job Referral Priority', icon: CheckCircle }
                            ].map((perk, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-dark-muted font-medium">
                                    <perk.icon size={16} className="text-blue-500" />
                                    {perk.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniNetwork;
