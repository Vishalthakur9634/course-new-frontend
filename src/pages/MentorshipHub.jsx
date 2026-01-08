import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Star, Calendar, MessageCircle, Shield,
    ArrowRight, Search, Filter, Award, Target,
    Bookmark, Zap, CheckCircle, X, Loader2
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import StatWidget from '../components/StatWidget';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { getAssetUrl } from '../utils/urlUtils';

const MentorshipHub = () => {
    const [selectedTab, setSelectedTab] = useState('browse');
    const [searchQuery, setSearchQuery] = useState('');
    const [mentors, setMentors] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingData, setBookingData] = useState({ topic: '', date: '' });
    const [isBooking, setIsBooking] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchMentors();
    }, [searchQuery]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/users/instructors/mentors?search=${searchQuery}`);
            setMentors(data);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            addToast('Failed to load mentors', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/mentorship/sessions');
            setSessions(data);
        } catch (error) {
            addToast('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            setIsBooking(true);
            await api.post('/mentorship/book', {
                mentorId: selectedMentor._id,
                topic: bookingData.topic,
                scheduledDate: bookingData.date,
                price: 80
            });
            addToast('Mentorship session requested!', 'success');
            setShowBookingModal(false);
            setBookingData({ topic: '', date: '' });
        } catch (error) {
            addToast('Failed to book session', 'error');
        } finally {
            setIsBooking(false);
        }
    };

    const stats = [
        { label: 'Active Mentors', value: mentors.length, icon: Users },
        { label: 'Sessions Scheduled', value: sessions.length, icon: CheckCircle },
        { label: 'Success Rate', value: 99, suffix: '%', icon: Target },
        { label: 'Experts Online', value: mentors.filter(m => m.isOnline).length || Math.floor(mentors.length * 0.4), icon: Award }
    ];

    if (loading && mentors.length === 0) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <Users className="text-purple-500" size={24} />
                            </div>
                            Mentorship Hub
                        </h1>
                        <p className="text-dark-muted">Connect with industry experts for personalized guidance</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="purple-500" />
                ))}
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex bg-dark-layer1 border border-white/5 rounded-2xl p-1 w-full lg:w-fit">
                    {['browse', 'my-mentors', 'bookings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${selectedTab === tab ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'text-dark-muted hover:text-white'
                                }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full lg:w-fit">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Find expertise (e.g. React)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-layer1 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                    <button className="p-3 bg-dark-layer1 border border-white/5 rounded-2xl text-dark-muted hover:text-white transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {selectedTab === 'browse' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {mentors.length > 0 ? mentors.map((mentor) => (
                        <motion.div
                            key={mentor._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-dark-layer1 border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/50 transition-all shadow-2xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative">
                                        <img
                                            src={mentor.avatar ? getAssetUrl(mentor.avatar) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`}
                                            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white/5 group-hover:ring-purple-500/30 transition-all"
                                            alt={mentor.name}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-dark-layer1" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5 text-stellar-gold font-black text-sm">
                                            <Star size={16} fill="currentColor" />
                                            <span>{mentor.rating || 4.9}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-dark-muted uppercase tracking-widest">
                                            {mentor.specialization || 'Expert'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8">
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase line-clamp-1">{mentor.name}</h3>
                                    <p className="text-dark-muted text-xs font-bold leading-relaxed line-clamp-2 min-h-[32px]">{mentor.bio || 'Professional industry mentor and technical consultant.'}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {(mentor.skills || ['React', 'Node.js', 'AWS']).slice(0, 3).map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-purple-500/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedMentor(mentor);
                                        setShowBookingModal(true);
                                    }}
                                    className="w-full py-4 bg-dark-bg border border-white/5 group-hover:bg-purple-600 group-hover:border-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_15px_30px_rgba(168,85,247,0.3)]"
                                >
                                    <Zap size={16} className="text-purple-500 group-hover:text-white" />
                                    Initialize Session
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-24 text-center space-y-6 opacity-30">
                            <Users size={64} className="mx-auto" />
                            <p className="text-xl font-black uppercase tracking-[0.5em]">No Experts Detected</p>
                        </div>
                    )}
                </div>
            )}

            {selectedTab === 'bookings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessions.length > 0 ? sessions.map((session) => (
                        <div key={session._id} className="bg-dark-layer1 border border-white/5 rounded-3xl p-8 relative">
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${session.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                session.status === 'scheduled' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                    'bg-dark-layer2 text-dark-muted border border-white/5'
                                }`}>
                                {session.status}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{session.topic}</h3>
                            <p className="text-dark-muted text-sm mb-6 flex items-center gap-2">
                                <Users size={14} className="text-purple-500" />
                                Mentor: <span className="text-white">{session.mentorId?.name}</span>
                            </p>
                            <div className="flex items-center justify-between text-xs text-dark-muted font-bold p-4 bg-dark-bg/50 rounded-2xl border border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="uppercase text-[8px] tracking-[0.2em]">Scheduled For</span>
                                    <span className="text-white">{new Date(session.scheduledDate).toLocaleDateString()}</span>
                                </div>
                                <Calendar size={16} className="text-purple-500" />
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-dark-layer1 rounded-2xl border border-white/5">
                            <Calendar size={48} className="text-dark-muted mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                            <p className="text-dark-muted">Your scheduled sessions will appear here</p>
                        </div>
                    )}
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"
                        onClick={() => setShowBookingModal(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-lg bg-dark-layer1 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <button onClick={() => setShowBookingModal(false)} className="text-dark-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Initialize Session</h2>
                            <p className="text-dark-muted font-bold text-sm tracking-widest uppercase">Consultation with {selectedMentor?.name}</p>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Mentorship Goal / Topic</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Career guidance, React architecture, etc."
                                    className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-white/10 font-bold"
                                    value={bookingData.topic}
                                    onChange={e => setBookingData({ ...bookingData, topic: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] ml-1">Preferred Deployment Date</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-dark-bg/50 border border-white/5 rounded-2xl p-4 text-white focus:border-purple-500 outline-none transition-all font-bold"
                                    value={bookingData.date}
                                    onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isBooking}
                                className="w-full py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(168,85,247,0.2)] disabled:opacity-50 text-lg uppercase tracking-widest"
                            >
                                {isBooking ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
                                Confirm Session
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MentorshipHub;
