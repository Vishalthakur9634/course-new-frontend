import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, Clock, Eye, MousePointer2,
    Target, AlertCircle, Calendar, DollarSign, ArrowUpRight,
    ArrowDownRight, ChevronRight, Activity, Sparkles
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

const InstructorAdvancedAnalytics = () => {
    const stats = [
        { label: 'Projected Revenue', value: 12500, prefix: '$', previousValue: 10200, icon: DollarSign },
        { label: 'Avg. Retention', value: 84, suffix: '%', previousValue: 82, icon: Users },
        { label: 'Course Health', value: 92, suffix: '%', icon: Activity },
        { label: 'Market Rank', value: 15, prefix: '#', icon: Target }
    ];

    const heatmaps = [
        { day: 'Mon', power: 30 },
        { day: 'Tue', power: 45 },
        { day: 'Wed', power: 85 },
        { day: 'Thu', power: 65 },
        { day: 'Fri', power: 90 },
        { day: 'Sat', power: 40 },
        { day: 'Sun', power: 25 },
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                            <BarChart3 className="text-brand-primary" size={24} />
                        </div>
                        Advanced Analytics
                    </h1>
                    <p className="text-dark-muted">Deep insights into student behavior and platform performance</p>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget key={idx} {...stat} size="sm" color="brand-primary" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Heatmap */}
                <div className="lg:col-span-2 bg-dark-layer1 rounded-2xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Student Engagement Heatmap</h2>
                            <p className="text-sm text-dark-muted">Activity intensity based on time of day</p>
                        </div>
                        <select className="bg-dark-layer2 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-primary">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-2">
                        {heatmaps.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h.power}%` }}
                                    className={`w-full rounded-t-lg bg-gradient-to-t from-brand-primary/20 to-brand-primary shadow-[0_0_20px_rgba(255,204,0,0.2)]`}
                                />
                                <span className="text-[10px] uppercase font-bold text-dark-muted mt-3">{h.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drop-off Analysis */}
                <div className="bg-dark-layer1 rounded-2xl border border-white/5 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Drop-off Analysis</h2>
                    <div className="space-y-6">
                        {[
                            { label: 'Intro & Setup', value: 98, trend: 'stable' },
                            { label: 'Core Concepts', value: 85, trend: 'down' },
                            { label: 'Advanced Modules', value: 64, trend: 'up' },
                            { label: 'Final Exam', value: 42, trend: 'stable' }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-white group-hover:text-brand-primary transition-colors">{item.label}</span>
                                    <span className="text-sm font-bold text-dark-muted">{item.value}% Retention</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        className="h-full bg-brand-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Predictions */}
                <div className="lg:col-span-3 bg-gradient-to-r from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Sparkles className="text-brand-primary opacity-50" size={48} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">AI Predictive Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-dark-bg/40 backdrop-blur-md rounded-xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-3 text-brand-primary text-sm font-bold uppercase tracking-widest">
                                    <TrendingUp size={16} />
                                    Growth Potential
                                </div>
                                <p className="text-white text-lg font-medium mb-2">Revenue is projected to increase by 15% next month.</p>
                                <p className="text-sm text-dark-muted leading-relaxed">Based on current student enrollment trends and coupon engagement in your "React Advanced" course.</p>
                            </div>
                            <div className="bg-dark-bg/40 backdrop-blur-md rounded-xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-3 text-red-400 text-sm font-bold uppercase tracking-widest">
                                    <AlertCircle size={16} />
                                    Retention Alert
                                </div>
                                <p className="text-white text-lg font-medium mb-2">Module 4 has a 20% higher drop-off rate.</p>
                                <p className="text-sm text-dark-muted leading-relaxed">Consider breaking down the "Microservices" lecture into smaller segments to improve student stamina.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorAdvancedAnalytics;
