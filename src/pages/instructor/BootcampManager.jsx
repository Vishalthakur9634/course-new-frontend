import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Users, Clock, Plus, Zap, Star, Shield,
    Video, MessageSquare, ClipboardList, TrendingUp,
    ChevronRight, MoreHorizontal, LayoutGrid
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

const BootcampManager = () => {
    const [view, setView] = useState('grid');

    const bootcamps = [
        {
            id: 1,
            title: 'MERN Stack Mastery 2026',
            cohort: 'Beta-4',
            students: 45,
            sessions: '12/15',
            status: 'active',
            nextSession: 'Jan 12, 06:00 PM',
            revenue: '$12,450'
        },
        {
            id: 2,
            title: 'Advanced AI & ML Cohort',
            cohort: 'Alpha-1',
            students: 28,
            sessions: '4/20',
            status: 'active',
            nextSession: 'Jan 10, 10:00 AM',
            revenue: '$18,900'
        },
        {
            id: 3,
            title: 'System Design Architecture',
            cohort: 'Upcoming',
            students: 120,
            sessions: '0/10',
            status: 'planning',
            nextSession: 'Feb 01, 04:00 PM',
            revenue: '$45,000'
        }
    ];

    const stats = [
        { label: 'Active Bootcamps', value: 2, icon: Calendar },
        { label: 'Total Enrolled', value: 193, icon: Users },
        { label: 'Avg. Completion', value: 94, suffix: '%', icon: Star },
        { label: 'Cumulative Revenue', value: 76350, prefix: '$', icon: TrendingUp }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                            <Zap className="text-orange-500" size={24} />
                        </div>
                        Bootcamp Manager
                    </h1>
                    <p className="text-dark-muted">Launch and manage high-intensity group learning experiences</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2">
                        <Plus size={20} />
                        Launch New Bootcamp
                    </button>
                    <div className="flex bg-dark-layer1 border border-white/5 rounded-xl p-1">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-dark-layer2 text-white' : 'text-dark-muted'}`}>
                            <LayoutGrid size={20} />
                        </button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-dark-layer2 text-white' : 'text-dark-muted'}`}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="orange-500" />
                ))}
            </div>

            {/* Active Bootcamps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {bootcamps.map((bc) => (
                    <motion.div
                        key={bc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-layer1 border border-white/5 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-all"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${bc.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                    }`}>
                                    {bc.status}
                                </span>
                                <span className="text-xs font-bold text-dark-muted">{bc.cohort}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">{bc.title}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-dark-bg/50 rounded-xl p-3 border border-white/5">
                                    <div className="text-[10px] font-bold text-dark-muted uppercase mb-1">Students</div>
                                    <div className="text-lg font-bold text-white">{bc.students}</div>
                                </div>
                                <div className="bg-dark-bg/50 rounded-xl p-3 border border-white/5">
                                    <div className="text-[10px] font-bold text-dark-muted uppercase mb-1">Revenue</div>
                                    <div className="text-lg font-bold text-green-500">{bc.revenue}</div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-dark-bg/30 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-orange-500" />
                                <span className="text-xs text-white font-medium">{bc.nextSession}</span>
                            </div>
                            <button className="text-orange-500 font-bold text-xs hover:underline flex items-center gap-1">
                                Manage <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Calendar Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-dark-layer1 rounded-2xl border border-white/5 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Cohort Operations</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Schedule Session', icon: Video, color: 'blue' },
                            { label: 'Bulk Announcement', icon: MessageSquare, color: 'purple' },
                            { label: 'Assignment Review', icon: ClipboardList, color: 'orange' },
                            { label: 'Graduate Cohort', icon: Shield, color: 'green' }
                        ].map((action, i) => (
                            <button key={i} className="flex flex-col items-center gap-3 p-6 rounded-xl bg-dark-bg/40 border border-white/5 hover:bg-dark-bg transition-all group">
                                <action.icon className={`text-${action.color}-500 group-hover:scale-110 transition-transform`} size={24} />
                                <span className="text-sm font-bold text-white">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-dark-layer1 rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white">Upcoming Deadlines</h2>
                        <button className="text-xs font-bold text-dark-muted hover:text-white uppercase tracking-widest">Full Schedule</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-dark-bg/20 border-l-4 border-orange-500">
                                <div className="text-center min-w-[50px]">
                                    <div className="text-[10px] font-bold text-dark-muted uppercase">Jan</div>
                                    <div className="text-xl font-bold text-white">{10 + i}</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Final Project Review</h4>
                                    <p className="text-xs text-dark-muted">MERN Stack Mastery • Session 14</p>
                                </div>
                                <div className="text-xs font-bold text-orange-500">02:00 PM</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BootcampManager;
