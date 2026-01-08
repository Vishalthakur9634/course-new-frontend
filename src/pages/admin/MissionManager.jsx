import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Plus, Trash2, Shield, Zap, Award, Star,
    X, Loader2, Save, Activity, Trash, CheckCircle2
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const MissionManager = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rewardXp: 50,
        type: 'daily',
        icon: 'Target',
        color: 'brand-primary'
    });

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/gamification/xp'); // Reusing this for now to get missions or create new endpoint
            // Actually, I just added routes for /gamification/missions in the backend
            const missionRes = await api.get('/gamification/xp');
            setMissions(missionRes.data.missions || []);
        } catch (error) {
            addToast('Failed to load missions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMission = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/gamification/missions', formData);
            addToast('Mission created', 'success');
            setShowCreateModal(false);
            setFormData({ title: '', description: '', rewardXp: 50, type: 'daily', icon: 'Target', color: 'brand-primary' });
            fetchMissions();
        } catch (error) {
            addToast('Failed to create mission', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this mission?')) return;
        try {
            await api.delete(`/gamification/missions/${id}`);
            addToast('Mission removed', 'success');
            fetchMissions();
        } catch (error) {
            addToast('Failed to delete mission', 'error');
        }
    };

    const stats = [
        { label: 'Active Missions', value: missions.length },
        { label: 'Daily Type', value: missions.filter(m => m.type === 'daily').length },
        { label: 'Total XP Given', value: '45.2K' },
        { label: 'Completion Rate', value: '62%' }
    ];

    if (loading && missions.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <Target size={28} className="text-yellow-500" />
                        </div>
                        Mission Control
                    </h1>
                    <p className="text-dark-muted text-lg">Manage gamification missions and reward systems</p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                >
                    <Plus size={20} />
                    New Mission
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? Target : idx === 1 ? Activity : idx === 2 ? Zap : Shield}
                        color="yellow-500"
                        size="sm"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map((mission) => (
                    <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-layer1 border border-white/5 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(mission.id)} className="text-red-500 hover:text-red-400">
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className={`w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4`}>
                            <Zap size={24} className="text-yellow-500" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                        <p className="text-dark-muted text-sm mb-4 line-clamp-2">{mission.desc}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 font-bold">+{mission.reward} XP</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted bg-white/5 px-2 py-1 rounded">
                                {mission.type}
                            </span>
                        </div>
                    </motion.div>
                ))}
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
                            onSubmit={handleCreateMission}
                            className="relative w-full max-w-lg bg-dark-layer1 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white uppercase italic">Add <span className="text-yellow-500">Mission</span></h2>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-dark-muted hover:text-white"><X size={24} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Mission Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-yellow-500 outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">XP Reward</label>
                                    <input
                                        type="number"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-yellow-500 outline-none"
                                        value={formData.rewardXp}
                                        onChange={e => setFormData({ ...formData, rewardXp: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Mission Description</label>
                                    <textarea
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-yellow-500 outline-none h-24"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Icon</label>
                                        <select
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-yellow-500 outline-none"
                                            value={formData.icon}
                                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        >
                                            <option value="Target">Target</option>
                                            <option value="Zap">Zap</option>
                                            <option value="Shield">Shield</option>
                                            <option value="Award">Award</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-dark-muted uppercase tracking-widest">Type</label>
                                        <select
                                            className="w-full bg-dark-bg border border-white/5 rounded-xl p-3 text-white focus:border-yellow-500 outline-none"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="achievement">Achievement</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Activate Mission
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MissionManager;
