import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Users, Calendar, Clock, Lock, ShieldCheck,
    Play, MessageSquare, Award, ArrowRight, Star,
    CheckCircle
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

const Bootcamps = () => {
    const [filter, setFilter] = useState('all');

    const bootcamps = [
        {
            id: 1,
            title: 'Full Stack MERN Bootcamp',
            instructor: 'Vishal Thakur',
            startDate: 'Jan 20, 2026',
            duration: '12 Weeks',
            students: '150/200',
            price: '$199',
            enrolled: false,
            tags: ['Full Stack', 'Cohort-based'],
            rating: 4.9
        },
        {
            id: 2,
            title: 'Advanced AI & Deep Learning',
            instructor: 'Deepak Kumar',
            startDate: 'Feb 15, 2026',
            duration: '8 Weeks',
            students: '45/50',
            price: '$299',
            enrolled: true,
            tags: ['AI', 'Intensive'],
            rating: 5.0
        }
    ];

    const stats = [
        { label: 'Active Cohorts', value: 3, icon: Users },
        { label: 'Total Hours', value: 124, icon: Clock },
        { label: 'Skills Mastery', value: 18, icon: Award },
        { label: 'Next Session', value: '2h 15m', icon: Zap }
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
                                <Zap className="text-orange-500" size={24} />
                            </div>
                            Intensive Bootcamps
                        </h1>
                        <p className="text-dark-muted">High-ticket cohort learning with direct instructor guidance</p>
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="orange-500" />
                ))}
            </div>

            {/* My Bootcamps Section */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <ShieldCheck className="text-orange-500" />
                    My Enrolled Bootcamps
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {bootcamps.filter(bc => bc.enrolled).map((bc) => (
                        <motion.div
                            key={bc.id}
                            className="bg-dark-layer1 border border-white/5 rounded-3xl overflow-hidden relative group border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)]"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-500 border border-orange-500/30">
                                            {bc.instructor[0]}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">Instructor</div>
                                            <div className="text-white font-bold">{bc.instructor}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[10px] font-bold uppercase tracking-widest">
                                        <CheckCircle size={12} />
                                        In Progress
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{bc.title}</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-dark-muted uppercase mb-1">Students</div>
                                        <div className="text-white font-bold">{bc.students}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-dark-muted uppercase mb-1">Duration</div>
                                        <div className="text-white font-bold">{bc.duration}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-dark-muted uppercase mb-1">Rating</div>
                                        <div className="text-orange-500 font-bold">⭐ {bc.rating}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-8 py-5 bg-dark-bg/40 border-t border-white/5 flex items-center justify-between group-hover:bg-dark-bg transition-colors">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-orange-500" />
                                    <span className="text-sm text-white font-medium">Next Live: Tomorrow, 10 AM</span>
                                </div>
                                <button className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                    Jump In
                                    <Play size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Explore Bootcamps */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Star className="text-orange-500" />
                        Explore Upcoming Cohorts
                    </h2>
                    <div className="flex gap-2">
                        {['All', 'Development', 'AI', 'Design'].map((f) => (
                            <button key={f} className="px-4 py-2 bg-dark-layer1 border border-white/5 rounded-xl text-xs font-bold text-dark-muted hover:text-white transition-all uppercase tracking-widest">
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bootcamps.filter(bc => !bc.enrolled).map((bc) => (
                        <motion.div
                            key={bc.id}
                            whileHover={{ y: -5 }}
                            className="bg-dark-layer1 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                {bc.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-orange-400 border border-orange-400/20 px-2 py-0.5 rounded uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{bc.title}</h3>
                            <p className="text-sm text-dark-muted mb-6">Led by {bc.instructor}. Limited to {bc.students.split('/')[1]} students for personalized feedback.</p>

                            <div className="flex items-center justify-between mb-6">
                                <div className="text-2xl font-bold text-white">{bc.price}</div>
                                <div className="text-xs text-dark-muted font-bold uppercase tracking-widest">Starts {bc.startDate}</div>
                            </div>

                            <button className="w-full py-4 bg-white/5 hover:bg-orange-500 hover:text-white text-white font-bold rounded-2xl border border-white/10 hover:border-orange-500 transition-all text-sm flex items-center justify-center gap-2 group">
                                Learn More & RSVP
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bootcamps;
