import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Award, Trophy, Star, Zap, Target, Gift, Crown, Medal,
    TrendingUp, Calendar, Check, Lock, Flame, Sparkles, Clock
} from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import StatWidget from '../../components/StatWidget';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const AchievementsHub = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [gamification, setGamification] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data } = await api.get('/gamification/xp');
            setGamification(data);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            addToast('Failed to load achievements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemReward = async (reward) => {
        if (currentXP < reward.cost) return;
        try {
            await api.post('/gamification/redeem', { rewardId: reward.id, cost: reward.cost });
            addToast(`Successfully redeemed ${reward.name}`, 'success');
            fetchAchievements();
        } catch (error) {
            addToast(error.response?.data?.message || 'Redemption failed', 'error');
        }
    };

    const handleCompleteMission = async (missionId) => {
        try {
            await api.post(`/gamification/complete-mission/${missionId}`);
            addToast('Mission Protocol Accomplished', 'success');
            fetchAchievements();
        } catch (error) {
            addToast('Synchronisation failure', 'error');
        }
    };

    const badges = [
        { id: 1, name: 'First Course', icon: Star, color: 'blue', unlocked: (gamification?.coursesCompleted > 0), date: '2026-01-05' },
        { id: 2, name: '7 Day Streak', icon: Flame, color: 'orange', unlocked: (gamification?.streak >= 7), date: '2026-01-07' },
        { id: 3, name: 'Code Master', icon: Trophy, color: 'yellow', unlocked: (gamification?.xp > 5000) },
        { id: 4, name: 'Top Performer', icon: Crown, color: 'purple', unlocked: (gamification?.level > 10) },
        { id: 5, name: 'Certified Pro', icon: Award, color: 'green', unlocked: (gamification?.certificatesCount > 0), date: '2026-01-03' },
        { id: 6, name: 'Perfect Score', icon: Target, color: 'red', unlocked: false }
    ];

    const challenges = [
        {
            id: 1,
            title: 'Daily Learning Streak',
            description: 'Learn for 7 consecutive days',
            progress: gamification?.streak || 0,
            goal: 7,
            xp: 100,
            status: 'active'
        },
        {
            id: 2,
            title: 'Quiz Master',
            description: 'Complete 10 quizzes with 90%+ score',
            progress: 7,
            goal: 10,
            xp: 150,
            status: 'active'
        },
        {
            id: 3,
            title: 'Community Helper',
            description: 'Help 5 students in discussion forums',
            progress: 3,
            goal: 5,
            xp: 75,
            status: 'active'
        }
    ];

    const rewards = [
        { id: 1, name: '20% Off Coupon', cost: 500, type: 'discount', available: true },
        { id: 2, name: '1 Month Premium', cost: 1000, type: 'premium', available: true },
        { id: 3, name: 'Exclusive Badge', cost: 250, type: 'badge', available: false },
        { id: 4, name: 'Custom Avatar', cost: 300, type: 'avatar', available: true }
    ];

    const stats = [
        { label: 'Total XP', value: gamification?.xp || 0, previousValue: 3200 },
        { label: 'Level', value: gamification?.level || 1, prefix: 'Lvl ' },
        { label: 'Badges', value: `${badges.filter(b => b.unlocked).length}/${badges.length}` },
        { label: 'Rank', value: 234, prefix: '#', trendLabel: 'Global' }
    ];

    const userLevel = gamification?.level || 1;
    const currentXP = gamification?.xp || 0;
    const nextLevelXP = gamification?.nextLevelXp || 1000;
    const prevLevelXP = (userLevel - 1) * 1000;
    const levelProgress = ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-500/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Header with Level Card */}
            <div className="mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-dark-layer1/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-500/5 opacity-50" />
                    <div className="absolute top-0 right-0 p-8">
                        <Sparkles className="text-yellow-500/20 animate-pulse" size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                            <div className="flex items-center gap-10">
                                <div className="relative group/level">
                                    <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 group-hover/level:opacity-40 transition-opacity" />
                                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative shadow-[0_0_40px_rgba(251,191,36,0.2)]">
                                        <Crown size={56} className="text-white drop-shadow-lg" />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-3xl bg-dark-bg flex items-center justify-center border-4 border-yellow-500 text-2xl font-black text-yellow-500 shadow-xl">
                                        {userLevel}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Ascended Tier</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className={i <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'} />)}
                                        </div>
                                    </div>
                                    <h1 className="text-6xl font-black text-white tracking-tighter mb-2">Achievements <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Hub</span></h1>
                                    <p className="text-dark-muted text-xl font-medium">Rank <span className="text-white font-bold">#{stats[3].value}</span> Global • Top 2% of Elite Learners</p>
                                </div>
                            </div>

                            <div className="flex-1 max-w-md w-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white uppercase tracking-widest">Protocol Evolution</span>
                                        <span className="text-xs text-dark-muted font-orbit tracking-tight">Leveling Sequence Active</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-yellow-500">{nextLevelXP - currentXP}</span>
                                        <span className="text-xs font-bold text-dark-muted uppercase ml-2">XP To Ascent</span>
                                    </div>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full p-1 border border-white/5 relative overflow-hidden group/bar">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent animate-shimmer" />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(2, levelProgress)}%` }}
                                        transition={{ duration: 1.5, ease: 'circOut' }}
                                        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] relative"
                                    >
                                        <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatWidget
                        key={idx}
                        {...stat}
                        icon={idx === 0 ? Zap : idx === 1 ? Trophy : idx === 2 ? Award : TrendingUp}
                        color="yellow-500"
                        size="sm"
                    />
                ))}
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex gap-2 p-1 bg-dark-layer1 rounded-xl border border-white/5 w-fit">
                    {['all', 'badges', 'challenges', 'rewards'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === tab
                                ? 'bg-gradient-to-r from-yellow-500 to-purple-500 text-white shadow-lg'
                                : 'text-dark-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
                {/* Badges Section */}
                {(activeTab === 'all' || activeTab === 'badges') && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Medal size={24} className="text-yellow-500" />
                            Badges Collection
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {badges.map((badge) => {
                                const Icon = badge.icon;
                                return (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{
                                            rotateY: badge.unlocked ? 10 : 0,
                                            rotateX: badge.unlocked ? -5 : 0,
                                            z: 30,
                                            scale: 1.05
                                        }}
                                        className={`relative bg-dark-layer1/60 backdrop-blur-md rounded-3xl border p-8 text-center transition-all duration-500 group overflow-hidden ${badge.unlocked
                                            ? `border-${badge.color}-500/40 shadow-2xl`
                                            : 'border-white/5 opacity-40 grayscale'
                                            }`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {!badge.unlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/60 backdrop-blur-[2px] z-20">
                                                <Lock size={24} className="text-dark-muted" />
                                            </div>
                                        )}

                                        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
                                            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br from-${badge.color}-500/20 to-transparent border border-${badge.color}-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                                <Icon size={32} className={`text-${badge.color}-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                            </div>
                                            <h3 className="text-base font-black text-white mb-1 tracking-tight">{badge.name}</h3>
                                            {badge.unlocked && badge.date ? (
                                                <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">{badge.date}</p>
                                            ) : (
                                                <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Locked</p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Daily Challenges */}
                {(activeTab === 'all' || activeTab === 'challenges') && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Target size={24} className="text-yellow-500" />
                            Active Challenges
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {challenges.map((challenge) => (
                                <div key={challenge.id} className="bg-dark-layer1 rounded-2xl border border-white/5 p-6 hover:border-yellow-500/30 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{challenge.title}</h3>
                                            <p className="text-sm text-dark-muted">{challenge.description}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full border border-yellow-500/30">
                                            <span className="text-sm font-bold">+{challenge.xp} XP</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-dark-muted">Progress</span>
                                            <span className="text-sm font-bold text-yellow-500">{challenge.progress}/{challenge.goal}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-yellow-500 to-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rewards Store */}
                {(activeTab === 'all' || activeTab === 'rewards') && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Gift size={24} className="text-yellow-500" />
                            Rewards Store
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {rewards.map((reward) => (
                                <FeatureCard
                                    key={reward.id}
                                    icon={Gift}
                                    title={reward.name}
                                    description={`Redeem with ${reward.cost} XP`}
                                    primaryAction={{
                                        label: currentXP >= reward.cost ? 'Redeem' : 'Not Enough XP',
                                        onClick: () => handleRedeemReward(reward)
                                    }}
                                    status={currentXP >= reward.cost ? 'available' : 'locked'}
                                    gradient="from-yellow-500/10 to-purple-500/10"
                                    glowColor="yellow-500"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsHub;
