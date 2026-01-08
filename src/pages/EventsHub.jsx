import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Video, Users, Search, Filter,
    ArrowRight, Bookmark, Share2, Star, Zap, Clock,
    LayoutGrid, List
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
    const { addToast } = useToast();

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

    const handleRSVP = async (event) => {
        try {
            const { data } = await api.post(`/events/${event._id}/rsvp`);
            addToast(data.message, 'success');
            fetchEvents();
        } catch (error) {
            addToast('RSVP Protocol Failure', 'error');
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                <Calendar className="text-pink- pink-500" size={24} />
                            </div>
                            Events Hub
                        </h1>
                        <p className="text-dark-muted">Discover workshops, conferences, and networking meetups</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="pink-500" />
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex gap-4 items-center">
                    {['upcoming', 'past', 'all'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeCategory === cat ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'text-dark-muted hover:text-white'
                                }`}
                        >
                            {cat.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full lg:w-fit">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Find an event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-layer1 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-pink-500/50"
                        />
                    </div>
                    <div className="flex bg-dark-layer1 border border-white/5 rounded-xl p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-dark-layer2 text-white' : 'text-dark-muted'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-dark-layer2 text-white' : 'text-dark-muted'}`}>
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-layer1 border border-white/5 rounded-3xl overflow-hidden group hover:border-pink-500/30 transition-all"
                    >
                        <div className="h-48 bg-dark-layer2 relative">
                            {event.isFeatured && (
                                <div className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg z-10">
                                    Featured
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <button className="p-2 bg-dark-bg/60 backdrop-blur-md rounded-lg text-white hover:text-pink-500 transition-colors">
                                    <Bookmark size={16} />
                                </button>
                                <button className="p-2 bg-dark-bg/60 backdrop-blur-md rounded-lg text-white hover:text-pink-500 transition-colors">
                                    <Share2 size={16} />
                                </button>
                            </div>
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                {event.thumbnail ? (
                                    <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Calendar size={64} className="text-white" />
                                )}
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4 text-pink-500 font-bold text-xs uppercase tracking-widest">
                                <Zap size={14} />
                                {event.type}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 group-hover:text-pink-500 transition-colors leading-tight line-clamp-2">{event.title}</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-dark-muted text-sm font-medium">
                                    <Calendar size={16} className="text-pink-500" />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-3 text-dark-muted text-sm font-medium">
                                    <Clock size={16} className="text-pink-500" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-3 text-dark-muted text-sm font-medium">
                                    <MapPin size={16} className="text-pink-500" />
                                    {event.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-8 border-b border-white/5 mb-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-dark-layer2 border-2 border-dark-layer1 flex items-center justify-center text-[10px] font-bold text-white">
                                            {i}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-dark-layer1 flex items-center justify-center text-[8px] font-bold text-white">
                                        +{Math.max(0, (event.attendees?.length || 0) - 4)}
                                    </div>
                                </div>
                                <span className="text-xs text-dark-muted font-bold">Attending</span>
                            </div>

                            <button
                                onClick={() => handleRSVP(event)}
                                className={`w-full py-4 font-bold rounded-2xl border transition-all text-sm flex items-center justify-center gap-2 group ${event.attendees?.includes(user._id)
                                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-500'
                                    : 'bg-white/5 border-white/10 hover:bg-pink-500 hover:text-white text-white hover:border-pink-500'
                                    }`}
                            >
                                {event.attendees?.includes(user._id) ? 'Attending' : 'RSVP Now'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                        <Calendar size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                        <p className="text-dark-muted">Check back later for new workshops and meetups</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsHub;
