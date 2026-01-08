import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const DailyQuests = ({ missions }) => {
    console.log("Rendering DailyQuests v2 [FIXED]");
    const [localMissions, setLocalMissions] = useState([]);

    useEffect(() => {
        if (missions) {
            setLocalMissions(missions.slice(0, 3)); // Only show top 3
        }
    }, [missions]);

    const handleComplete = async (missionId) => {
        const mission = localMissions.find(m => m.id === missionId);
        if (mission?.completed) return;

        try {
            await api.post(`/gamification/complete-mission/${missionId}`);
            setLocalMissions(prev => prev.map(m =>
                m.id === missionId ? { ...m, completed: true, progress: 100 } : m
            ));
        } catch (error) {
            console.error("Error completing mission:", error);
        }
    };

    if (!localMissions || localMissions.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[250px] opacity-40">
                <Trophy size={40} className="text-dark-muted" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Active Missions</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] border-white/5 space-y-4 md:space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-dark-muted uppercase tracking-widest">Daily Ops</h3>
                <div className="flex items-center gap-1 text-stellar-gold">
                    <Trophy size={14} />
                    <span className="text-[10px] font-black uppercase">Field Assignments</span>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {localMissions.map(quest => (
                        <motion.div
                            key={quest.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${quest.completed
                                ? 'bg-brand-primary/10 border-brand-primary/30'
                                : 'bg-dark-layer2 border-white/5 hover:border-white/20'
                                }`}
                            onClick={() => handleComplete(quest.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${quest.completed ? 'text-brand-primary' : 'text-dark-muted group-hover:text-white'} transition-colors`}>
                                    {quest.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-tight ${quest.completed ? 'text-white line-through opacity-50' : 'text-gray-300'}`}>
                                    {quest.title || quest.text}
                                </span>
                            </div>
                            <span className="text-[9px] font-black text-dark-muted uppercase bg-black/20 px-2 py-1 rounded">
                                +{quest.reward} XP
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-auto pt-4">
                <div className="w-full bg-white/5 h-1 md:h-1.5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(localMissions.filter(q => q.completed).length / Math.max(1, localMissions.length)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-brand-primary to-amber-500 transition-all duration-500 shadow-[0_0_10px_rgba(255,161,22,0.3)]"
                    />
                </div>
            </div>
        </div>
    );
};

export default DailyQuests;
