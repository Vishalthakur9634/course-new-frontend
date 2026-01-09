import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Plus, Users, Calendar, BarChart3, Edit,
    Trash2, ExternalLink, ShieldAlert, CheckCircle,
    MessageSquare, Eye, LayoutGrid, List, X, Loader2, Zap
} from 'lucide-react';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Webinar',
        isFeatured: false
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = ['instructor', 'superadmin', 'admin'].includes(user.role);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            // If backend fails, fallback to empty to avoid crash
            // addToast('Failed to load events', 'error');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/events', formData);
            addToast('Event created successfully', 'success');
            setShowCreateModal(false);
            setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'Webinar', isFeatured: false });
            fetchEvents();
        } catch (error) {
            addToast('Failed to create event', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            addToast('Event deleted', 'success');
            fetchEvents();
        } catch (error) {
            addToast('Failed to delete event', 'error');
        }
    };

    const stats = [
        { label: 'Total Events', value: events.length, icon: CheckCircle },
        { label: 'Total Attendees', value: events.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0), icon: Users },
        { label: 'Featured', value: events.filter(e => e.isFeatured).length, icon: BarChart3 },
        { label: 'Upcoming', value: events.filter(e => new Date(e.date) > new Date()).length, icon: Calendar }
    ];

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <Loader2 className="text-blue-500 animate-spin" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="relative group">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h1 className="text-6xl font-black text-white tracking-tighter flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-dark-layer1 border border-white/10 flex items-center justify-center p-4 relative overflow-hidden group/icon shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                                <Settings size={40} className="text-blue-500 group-hover/icon:rotate-90 transition-transform duration-700" />
                            </div>
                            EVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">COMMAND</span>
                        </h1>
                        <p className="text-dark-muted text-xl mt-3 flex items-center gap-3">
                            <span className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                            </span>
                            Monitoring Global Transmission Matrix • System Nominal
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end px-6 border-r border-white/10">
                            <span className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.3em] mb-1">Status Protocol</span>
                            <span className="text-xl font-black text-blue-500">LIVE SYNC</span>
                        </div>
                        {isManager && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-10 py-5 bg-white text-black font-black rounded-[1.5rem] hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-3"
                            >
                                <Plus size={24} />
                                INITIALIZE EVENT
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((s, idx) => (
                        <div key={idx} className="bg-dark-layer1/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 group hover:border-blue-500/30 transition-all cursor-default">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 rounded-3xl bg-white/5 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all scale-95 group-hover:scale-100">
                                    <s.icon size={24} />
                                </div>
                                <span className="text-xs font-black text-dark-muted uppercase tracking-widest">{s.label}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">{s.value}</span>
                                <span className="text-[10px] font-bold text-blue-500 uppercase">Deployed</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-dark-layer1 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">All Events</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-dark-bg/20">
                                    <th className="text-left px-6 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Event Details</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Date</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Attendees</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Type</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-bold text-dark-muted uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((e) => (
                                    <tr key={e._id} className="border-t border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="text-white font-bold group-hover:text-blue-400 transition-colors">{e.title}</div>
                                            <div className="text-[10px] text-dark-muted font-medium mt-1">ID: {e._id.slice(-6).toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-dark-muted text-sm font-medium">{new Date(e.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-white font-bold">{e.attendees?.length || 0}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500`}>
                                                {e.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 text-dark-muted">
                                                {(user.role === 'superadmin' || user.role === 'admin' || e.organizer?._id === user._id) && (
                                                    <button onClick={() => handleDelete(e._id)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-dark-muted font-bold text-xs uppercase">No events found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                onSubmit={handleCreateEvent}
                                className="relative w-full max-w-xl bg-dark-layer1/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] space-y-8 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight">INITIALIZE <span className="text-blue-500">MISSION</span></h2>
                                        <p className="text-dark-muted text-xs font-bold uppercase tracking-widest mt-1">Event Deployment Sequence</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-dark-muted hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Event Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter transmission name..."
                                            className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10 font-bold"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Mission Briefing</label>
                                        <textarea
                                            placeholder="Detailed debrief of the event goals..."
                                            className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none h-32 transition-all placeholder:text-white/10 font-medium leading-relaxed"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Launch Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Launch Time</label>
                                            <input
                                                type="text"
                                                placeholder="20:00 UTC"
                                                className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10 font-bold"
                                                value={formData.time}
                                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Encryption / Access Link</label>
                                        <input
                                            type="text"
                                            placeholder="Conference URL or Physical Coordinates"
                                            className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/10 font-bold"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group/toggle cursor-pointer" onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}>
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${formData.isFeatured ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-dark-bg border border-white/10'}`}>
                                            {formData.isFeatured && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                        <label className="text-white text-xs font-black uppercase tracking-widest cursor-pointer">Priority Featured Broadcast</label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(59,130,246,0.2)] disabled:opacity-50 text-lg uppercase tracking-widest"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
                                    Initialize Transmission
                                </button>
                            </motion.form>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EventManager;
