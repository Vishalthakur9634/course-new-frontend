import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, MessageSquare, Settings as SettingsIcon,
    BarChart3, Eye, Ban, Award, Filter, Search, Loader2, Trash2
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const StudyGroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/community/communities');
            setGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            addToast('Failed to load study groups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this community? All posts will be lost.')) return;
        try {
            await api.delete(`/community/communities/${id}`);
            addToast('Community deleted successfully', 'success');
            fetchGroups();
        } catch (error) {
            addToast('Failed to delete community', 'error');
        }
    };

    const stats = [
        { label: 'Total Groups', value: groups.length },
        { label: 'Total Members', value: groups.reduce((acc, g) => acc + (g.memberCount || 0), 0) },
        { label: 'Official', value: groups.filter(g => g.isOfficial).length },
        { label: 'Private', value: groups.filter(g => g.isPrivate).length }
    ];

    if (loading && groups.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-purple-500/20 border border-brand-primary/30 flex items-center justify-center">
                        <Users size={28} className="text-brand-primary" />
                    </div>
                    Study Group Management
                </h1>
                <p className="text-dark-muted text-lg">Monitor and moderate student study groups</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? Users : idx === 1 ? TrendingUp : idx === 2 ? Award : BarChart3}
                        size="sm"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groups.length > 0 ? groups.map((group) => (
                    <FeatureCard
                        key={group._id}
                        icon={Users}
                        title={group.name}
                        description={group.description}
                        badge={group.isOfficial ? 'Official' : group.category}
                        stats={[
                            { label: 'Members', value: group.memberCount || 0 },
                            { label: 'Private', value: group.isPrivate ? 'Yes' : 'No' }
                        ]}
                        primaryAction={{
                            label: 'Moderate',
                            onClick: () => console.log('Moderate', group._id)
                        }}
                        secondaryAction={{
                            label: 'Delete',
                            onClick: () => handleDelete(group._id),
                            variant: 'danger'
                        }}
                        glowColor={group.color || 'brand-primary'}
                    />
                )) : (
                    <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5 font-orbit">
                        <Users size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">No study groups found</h3>
                        <p className="text-dark-muted">Community activity will appear here once groups are created</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyGroupManagement;
