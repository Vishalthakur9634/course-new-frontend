import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Calendar, Clock, MapPin,
    ArrowRight, Bell, Share2, Users,
    Sparkles, Radio, PlayCircle, Filter,
    Search, Plus, Bookmark
} from 'lucide-react';

const MetaClassroom = () => {
    const [view, setView] = useState('grid');
    const [filter, setFilter] = useState('all');

    const liveSessions = [
        {
            id: 1,
            title: "Advanced Neural Networks Architecture",
            instructor: "Dr. Aris Thorne",
            startTime: "Live Now",
            participants: 1240,
            thumbnail: "https://api.dicebear.com/7.x/shapes/svg?seed=NN",
            type: "Workshop",
            isLive: true
        }
    ];

    const upcomingEvents = [
        {
            id: 2,
            title: "The Future of Web 4.0 Ecosystems",
            instructor: "Elena Vance",
            date: "Tomorrow, 10:00 AM",
            duration: "90 min",
            type: "Keynote",
            participants: 856
        },
        {
            id: 3,
            title: "Quantum Computing Basics",
            instructor: "Leo Quantum",
            date: "Jan 12, 02:00 PM",
            duration: "120 min",
            type: "Technical",
            participants: 412
        }
    ];

    return (
        <div className="min-h-screen bg-[#08080a] text-white pt-4 md:pt-8 pb-32 overflow-hidden relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Dynamic Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-brand-primary mb-3"
                        >
                            <Radio size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Real-time Learning Node</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.9]"
                        >
                            Meta <span className="text-white/20">Classroom</span>
                        </motion.h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-dark-layer border border-white/5 p-1 rounded-2xl flex backdrop-blur-3xl shadow-2xl">
                            {['grid', 'calendar'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-brand-primary text-dark-bg' : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <button className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-3 rounded-2xl hover:bg-brand-primary hover:text-dark-bg transition-all shadow-lg shadow-brand-primary/10">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Live Feature Node */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black italic uppercase flex items-center gap-3">
                            <span className="w-2 h-8 bg-red-500 rounded-full animate-pulse" /> Transmitting Now
                        </h2>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand-primary transition-all">View Frequency</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {liveSessions.map((session) => (
                            <motion.div
                                key={session.id}
                                whileHover={{ scale: 1.005 }}
                                className="lg:col-span-12 group bg-dark-layer border border-white/5 rounded-[40px] overflow-hidden relative cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden relative shadow-2xl">
                                        <img src={session.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle size={60} className="text-brand-primary" />
                                        </div>
                                        <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase mb-4 tracking-widest">
                                            <span className="px-2 py-0.5 border border-white/10 rounded">{session.type}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Users size={12} /> {session.participants} Participants
                                            </div>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black italic uppercase leading-none mb-6">
                                            {session.title}
                                        </h3>
                                        <div className="flex items-center gap-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/30 uppercase leading-none mb-1">CONDUCTOR</p>
                                                    <p className="font-bold text-brand-primary">{session.instructor}</p>
                                                </div>
                                            </div>
                                            <button className="bg-white text-dark-bg px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-brand-primary transition-all active:scale-95">
                                                Join Stream
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Event Schedule Node */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black italic uppercase flex items-center gap-3">
                            <Calendar className="text-brand-primary" size={24} /> Future Log
                        </h2>
                        <div className="flex gap-2">
                            {['all', 'workshops', 'keynotes'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/30 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingEvents.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group bg-dark-layer border border-white/5 rounded-[32px] p-8 hover:border-brand-primary/30 transition-all flex flex-col justify-between h-[280px] relative overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                            {event.type}
                                        </div>
                                        <button className="text-white/20 hover:text-brand-primary transition-colors">
                                            <Bookmark size={18} />
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase mb-2 group-hover:text-brand-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-white/40 text-sm font-medium">{event.instructor}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Scheduled For</p>
                                        <div className="flex items-center gap-2 text-brand-primary font-black italic">
                                            <Clock size={14} /> {event.date}
                                        </div>
                                    </div>
                                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-dark-bg transition-all">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MetaClassroom;
