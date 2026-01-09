import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Video, Users, Search, Filter,
    ArrowRight, Bookmark, Share2, Star, Zap, Clock,
    LayoutGrid, List, Plus, X, Loader2, Link as LinkIcon
} from 'lucide-react';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const EventsHub = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('upcoming');
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Workshop',
        isFeatured: false,
        thumbnail: '' // Ideally this would be an upload, staying simple for now or usage generic placehoder
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const canCreate = ['instructor', 'superadmin', 'admin'].includes(user.role);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/events');
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            addToast('Failed to load events', 'error');
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
            setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop', isFeatured: false, thumbnail: '' });
            fetchEvents();
        } catch (error) {
            addToast('Failed to create event', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRSVP = async (event) => {
        try {
            const { data } = await api.post(`/events/${event._id}/rsvp`);
            addToast(data.message, 'success');
            fetchEvents();
        } catch (error) {
            addToast('RSVP Protocol Failure', 'error');
        }
    };

    const now = new Date();
    const categories = {
        all: events,
        upcoming: events.filter(e => new Date(e.date) >= now),
        past: events.filter(e => new Date(e.date) < now),
        live: events.filter(e => e.isFeatured && new Date(e.date).toDateString() === now.toDateString())
    };

    const stats = [
        { label: 'Total Events', value: events.length, icon: Calendar },
        { label: 'Active RSVPs', value: events.reduce((acc, e) => acc + (e.attendees?.length || 0), 0), icon: Users },
        { label: 'Virtual Venues', value: [...new Set(events.map(e => e.location))].length, icon: MapPin },
        { label: 'Recordings', value: 34, icon: Video }
    ];

    const currentEvents = categories[activeCategory] || events;

    const filteredEvents = currentEvents.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading && events.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tight flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/20 rotate-3 group-hover:rotate-0 transition-all">
                                <Calendar className="text-white" size={32} />
                            </div>
                            EVENTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">NEXUS</span>
                        </h1>
                        <p className="text-lg text-dark-muted font-medium ml-2">Discover workshops, conferences, and networking meetups.</p>
                    </div>

                    {canCreate && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-3"
                        >
                            <Plus size={20} /> Create Event
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, idx) => (
                        <StatWidget key={idx} {...s} size="sm" color="pink-500" />
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 bg-dark-layer1/50 backdrop-blur-md p-2 rounded-[2rem] border border-white/5">
                    <div className="flex gap-2 items-center p-2">
                        {['upcoming', 'past', 'all'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold capitalize transition-all ${activeCategory === cat ? 'bg-pink-500 text-white shadow-lg' : 'text-dark-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto px-4">
                        <div className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-pink-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Find an event..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-dark-bg border border-white/5 rounded-xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-all font-medium"
                            />
                        </div>
                        <div className="flex bg-dark-bg border border-white/5 rounded-xl p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-dark-muted'}`}>
                                <LayoutGrid size={20} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-dark-muted'}`}>
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content List */}
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className={`bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-pink-500/30 transition-all shadow-2xl relative ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                        >
                            <div className={`relative ${viewMode === 'list' ? 'md:w-1/3 h-64 md:h-auto' : 'h-56'}`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 opactiy-60" />
                                {event.isFeatured && (
                                    <div className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-20 flex items-center gap-1">
                                        <Zap size={10} fill="currentColor" /> Featured
                                    </div>
                                )}
                                {event.thumbnail ? (
                                    <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-dark-layer2 flex items-center justify-center">
                                        <Calendar size={48} className="text-white/10" />
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex flex-col justify-between flex-1 relative z-20">
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-pink-500 font-bold text-xs uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                        {event.type}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-pink-500 transition-colors leading-tight">{event.title}</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-dark-muted text-sm font-bold group-hover:text-white/80 transition-colors">
                                            <Calendar size={18} className="text-pink-500" />
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-3 text-dark-muted text-sm font-bold group-hover:text-white/80 transition-colors">
                                            <Clock size={18} className="text-pink-500" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-3 text-dark-muted text-sm font-bold group-hover:text-white/80 transition-colors">
                                            <MapPin size={18} className="text-pink-500" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between pb-8 border-b border-white/5 mb-8">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-dark-layer2 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white">
                                                    U{i}
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold text-white">
                                                +{Math.max(0, (event.attendees?.length || 0))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-dark-muted font-bold uppercase tracking-wider">{(event.attendees?.length || 0)} Attending</span>
                                    </div>

                                    <button
                                        onClick={() => handleRSVP(event)}
                                        className={`w-full py-4 font-black rounded-xl border transition-all text-sm flex items-center justify-center gap-2 group/btn uppercase tracking-widest ${event.attendees?.includes(user._id)
                                            ? 'bg-pink-500/10 border-pink-500/30 text-pink-500'
                                            : 'bg-white text-black hover:bg-pink-500 hover:text-white border-transparent'
                                            }`}
                                    >
                                        {event.attendees?.includes(user._id) ? 'Seat Reserved' : 'Secure Your Spot'}
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-32 bg-dark-layer1/30 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                            <Calendar size={64} className="text-dark-muted mx-auto mb-6 opacity-20" />
                            <h3 className="text-3xl font-black text-white mb-2">No Events Found</h3>
                            <p className="text-dark-muted max-w-md mx-auto text-lg">Check back later for new workshops, conferences and meetups.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
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
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onSubmit={handleCreateEvent}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Initialize <span className="text-pink-500">Event</span></h2>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-dark-muted hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Event Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold placeholder:text-white/20"
                                        placeholder="e.g. React Summit 2026"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold placeholder:text-white/20"
                                        placeholder="e.g. San Francisco / Online"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Type</label>
                                    <select
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Workshop">Workshop</option>
                                        <option value="Webinar">Webinar</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Meetup">Meetup</option>
                                    </select>
                                </div>
                                <div className="space-y-3 flex items-center pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox w-6 h-6 text-pink-500 rounded bg-dark-bg border-white/10"
                                            checked={formData.isFeatured}
                                            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-white uppercase tracking-widest">Feature Event?</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Thumbnail URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none font-bold placeholder:text-white/20"
                                        placeholder="https://..."
                                        value={formData.thumbnail}
                                        onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                    />
                                    <div className="p-4 bg-dark-bg border border-white/5 rounded-xl">
                                        <LinkIcon className="text-dark-muted" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1">Description</label>
                                <textarea
                                    className="w-full bg-dark-bg border border-white/5 rounded-xl p-4 text-white focus:border-pink-500 outline-none h-40 font-medium placeholder:text-white/20 resize-none"
                                    placeholder="Event details..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl hover:shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                                Launch Event Protocol
                            </button>

                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventsHub;
