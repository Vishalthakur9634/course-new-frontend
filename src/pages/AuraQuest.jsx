import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Trophy, Target, Star, Shield,
    ChevronRight, Award, Flame, Users,
    Lock, CheckCircle2, TrendingUp, Sparkles,
    Medal, Crown
} from 'lucide-react';
import api from '../utils/api';

const AuraQuest = () => {
    const [activeTab, setActiveTab] = useState('missions');
    const [loading, setLoading] = useState(true);
    const [xp, setXp] = useState(2450);
    const [rank, setRank] = useState('Nebula Sage');
    const [streak, setStreak] = useState(7);

    const missions = [
        { id: 1, title: 'Deep Focus', desc: 'Complete 2 lessons today', reward: 50, progress: 50, icon: Target, color: 'brand-primary' },
        { id: 2, title: 'Knowledge Weaver', desc: 'Interact with 3 social posts', reward: 30, progress: 100, icon: Zap, color: 'brand-accent' },
        { id: 3, title: 'Elite Scholar', desc: 'Take a practice quiz', reward: 100, progress: 0, icon: Shield, color: 'purple-500' },
    ];

    const leaderboard = [
        { id: 1, name: 'Alex Rivera', xp: 12500, tier: 'Supernova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
        { id: 2, name: 'Sarah Chen', xp: 11200, tier: 'Supernova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: 3, name: 'You', xp: 2450, tier: 'Nebula', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal', isUser: true },
        { id: 4, name: 'Marcus Bell', xp: 9800, tier: 'Nova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
    ];

    return (
        <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 md:pt-8 overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase"
                        >
                            Aura <span className="text-brand-primary underline decoration-brand-primary/30">Quest</span>
                        </motion.h1>
                        <p className="text-white/40 text-sm md:text-base font-medium mt-2 max-w-md">
                            The frontier of learning. Ascend through tiers, complete neural missions, and dominate the global hierarchy.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-dark-layer p-4 rounded-2xl border border-white/5 backdrop-blur-xl flex items-center gap-4 shadow-2xl">
                            <div className="p-3 bg-brand-primary/10 rounded-xl">
                                <Flame className="text-brand-primary animate-bounce" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1">STREAK</p>
                                <p className="text-xl font-black italic">{streak} DAYS</p>
                            </div>
                        </div>
                        <div className="bg-brand-primary p-4 rounded-2xl flex items-center gap-4 shadow-xl shadow-brand-primary/20">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Zap className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest leading-none mb-1">TOTAL XP</p>
                                <p className="text-xl font-black italic text-dark-bg">{xp.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-dark-layer border border-white/5 rounded-2xl w-full md:w-max mb-8 backdrop-blur-md">
                    {['missions', 'leaderboard', 'achievements'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-brand-primary text-dark-bg shadow-lg shadow-brand-primary/20 scale-[1.02]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'missions' && (
                        <motion.div
                            key="missions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {missions.map((mission, idx) => (
                                <div
                                    key={mission.id}
                                    className="group bg-dark-layer border border-white/5 rounded-3xl p-6 hover:border-brand-primary/50 transition-all hover:translate-y-[-8px] relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${mission.color}/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                                            <mission.icon className="text-brand-primary" size={28} />
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase mb-2 group-hover:text-brand-primary transition-colors">{mission.title}</h3>
                                        <p className="text-white/40 text-sm mb-6 leading-relaxed">{mission.desc}</p>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black tracking-tighter text-white/40 uppercase">Progress</span>
                                                <span className="text-sm font-black italic">{mission.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-primary transition-all duration-1000"
                                                    style={{ width: `${mission.progress}%` }}
                                                />
                                            </div>
                                            <div className="pt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="text-brand-primary" />
                                                    <span className="text-sm font-black">+{mission.reward} XP</span>
                                                </div>
                                                {mission.progress === 100 ? (
                                                    <span className="text-brand-primary font-black text-xs uppercase italic flex items-center gap-1">
                                                        Claimed <CheckCircle2 size={14} />
                                                    </span>
                                                ) : (
                                                    <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/10 rounded-lg hover:bg-white hover:text-dark-bg transition-all">
                                                        Activate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-dark-layer border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-2xl font-black italic uppercase">The Global <span className="text-brand-primary">Hierarchy</span></h2>
                                <div className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-widest">
                                    <Users size={14} /> 12,402 Neural Runners Online
                                </div>
                            </div>
                            <div className="p-4 md:p-8">
                                <div className="space-y-3">
                                    {leaderboard.sort((a, b) => b.xp - a.xp).map((user, idx) => (
                                        <div
                                            key={user.id}
                                            className={`group p-4 md:p-6 rounded-[32px] flex items-center justify-between transition-all ${user.isUser
                                                    ? 'bg-brand-primary shadow-2xl shadow-brand-primary/20 scale-[1.02] border-none'
                                                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center justify-center w-8 text-lg font-black italic">
                                                    {idx === 0 ? <Crown className="text-yellow-400" size={24} /> : `#${idx + 1}`}
                                                </div>
                                                <div className="relative">
                                                    <img src={user.avatar} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-white/10" alt="" />
                                                    {idx === 0 && <Sparkles className="absolute -top-2 -right-2 text-yellow-500 animate-pulse" size={16} />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-black italic text-lg ${user.isUser ? 'text-dark-bg' : 'text-white'}`}>
                                                        {user.name} {user.isUser && "(Agent)"}
                                                    </h4>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${user.isUser ? 'text-dark-bg/60' : 'text-white/40'}`}>
                                                        {user.tier} Tier Rank
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-black italic ${user.isUser ? 'text-dark-bg' : 'text-brand-primary'}`}>
                                                    {user.xp.toLocaleString()}
                                                </p>
                                                <p className={`text-[10px] uppercase font-bold tracking-widest ${user.isUser ? 'text-dark-bg/60' : 'text-white/40'}`}>Point Aura</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={`p-6 bg-dark-layer border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 group hover:border-brand-primary/40 transition-all ${i > 2 ? 'opacity-30 grayscale' : ''}`}>
                                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform`}>
                                        {i === 0 ? <Medal size={40} className="text-yellow-500" /> :
                                            i === 1 ? <Flame size={40} className="text-orange-500" /> :
                                                i === 2 ? <Star size={40} className="text-brand-primary" /> :
                                                    <Lock size={40} className="text-white/20" />}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black uppercase italic tracking-tighter">
                                            {i === 0 ? 'Legendary Ascent' :
                                                i === 1 ? 'Thermal Streak' :
                                                    i === 2 ? 'Neural Link' : 'Restricted'}
                                        </p>
                                        <p className="text-[10px] font-bold text-white/30 uppercase mt-1">
                                            {i < 3 ? 'Unlocked UN-67' : 'X-Auras Required'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuraQuest;
