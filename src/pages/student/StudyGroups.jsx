import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Plus, Search, Filter, TrendingUp, MessageSquare,
    Video, Calendar, Award, Clock, Lock, Globe, X, Send,
    FileText, Link as LinkIcon, UserPlus, Settings
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const StudyGroups = () => {
    const [activeTab, setActiveTab] = useState('discover');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchCommunities();
    }, [activeTab]);

    const fetchCommunities = async () => {
        try {
            setLoading(true);
            let endpoint = '/community/communities';
            if (activeTab === 'my-groups') {
                endpoint = '/community/communities/enrolled';
            }
            const { data } = await api.get(endpoint);
            setCommunities(data);
        } catch (error) {
            console.error('Error fetching communities:', error);
            addToast('Failed to load groups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLeave = async (groupId) => {
        try {
            const { data } = await api.post(`/community/communities/${groupId}/join`);
            addToast(data.joined ? 'Welcome to the inner circle' : 'Departure protocol complete', 'success');
            fetchCommunities();
        } catch (error) {
            addToast('Synchronisation failure', 'error');
        }
    };

    const handleOpenGroup = (groupId) => {
        navigate(`/community-hub?communityId=${groupId}`);
    };

    const stats = [
        { label: 'Active Groups', value: communities.length, previousValue: 1 },
        { label: 'Study Hours', value: 45, suffix: 'hrs' },
        { label: 'Group Rank', value: 3, prefix: '#' },
        { label: 'Contributions', value: 87 }
    ];

    const filteredGroups = communities.filter(group => {
        const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-purple-500/20 border border-brand-primary/30 flex items-center justify-center">
                                <Users size={28} className="text-brand-primary" />
                            </div>
                            Study Groups
                        </h1>
                        <p className="text-dark-muted text-lg">
                            Collaborate with peers, share knowledge, and achieve goals together
                        </p>
                    </div>

                    <button
                        onClick={() => addToast('Please use Community section to create groups', 'info')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                    >
                        <Plus size={20} />
                        Create Group
                    </button>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        previousValue={stat.previousValue}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        icon={idx === 0 ? Users : idx === 1 ? Clock : idx === 2 ? Award : FileText}
                        size="sm"
                    />
                ))}
            </motion.div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex items-center gap-2 p-1 bg-dark-layer1 rounded-xl border border-white/5 w-fit">
                    {['discover', 'my-groups', 'invitations'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === tab
                                ? 'bg-gradient-to-r from-brand-primary to-purple-500 text-white shadow-lg'
                                : 'text-dark-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab === 'discover' && 'Discover Groups'}
                            {tab === 'my-groups' && 'My Groups'}
                            {tab === 'invitations' && 'Invitations'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGroups.length > 0 ? filteredGroups.map((group) => (
                    <FeatureCard
                        key={group._id}
                        icon={group.isPrivate ? Lock : Globe}
                        title={group.name}
                        description={group.description}
                        badge={group.category}
                        stats={[
                            { label: 'Members', value: group.memberCount || 0 },
                            { label: 'Official', value: group.isOfficial ? 'Yes' : 'No' }
                        ]}
                        primaryAction={{
                            label: activeTab === 'my-groups' || group.members?.includes(user._id) ? 'Open Group' : 'Join Group',
                            onClick: () => {
                                if (activeTab === 'my-groups' || group.members?.includes(user._id)) {
                                    handleOpenGroup(group._id);
                                } else {
                                    handleJoinLeave(group._id);
                                }
                            }
                        }}
                        secondaryAction={group.members?.includes(user._id) ? {
                            label: 'Leave Group',
                            onClick: () => handleJoinLeave(group._id),
                            variant: 'danger'
                        } : {
                            label: 'View Details',
                            onClick: () => console.log('View', group._id)
                        }}
                        gradient={`from-brand-primary/10 to-purple-500/10`}
                        glowColor="brand-primary"
                    />
                )) : (
                    <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                        <Users size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">No groups found</h3>
                        <p className="text-dark-muted">Start by exploring new communities</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyGroups;
