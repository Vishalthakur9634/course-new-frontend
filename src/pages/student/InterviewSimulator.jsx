import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Mic, Award, RefreshCw, ChevronRight, Brain, Cpu, MessageSquare, Briefcase } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const InterviewSimulator = () => {
    const { addToast } = useToast();
    const [step, setStep] = useState('setup'); // setup, interview, result
    const [role, setRole] = useState('Software Engineer');
    const [difficulty, setDifficulty] = useState('Junior');
    const [session, setSession] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Product Manager', 'UX Designer'];
    const difficulties = ['Junior', 'Mid-Level', 'Senior'];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [session?.transcript]);

    const startSession = async () => {
        try {
            setLoading(true);
            const { data } = await api.post('/ai-interview/start', { role, difficulty });
            setSession(data);
            setStep('interview');
        } catch (error) {
            addToast('Failed to start session', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const currentMsg = message;
        setMessage('');

        // Optimistic UI
        const optimisticTranscript = [...session.transcript, { speaker: 'User', text: currentMsg }];
        setSession(prev => ({ ...prev, transcript: optimisticTranscript }));

        try {
            const { data } = await api.post('/ai-interview/message', {
                sessionId: session._id,
                message: currentMsg
            });
            setSession(data);
            if (data.status === 'completed') {
                setTimeout(() => setStep('result'), 2000);
            }
        } catch (error) {
            addToast('Failed to send message', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                    <Brain size={24} className="text-brand-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tight">AI Interview Simulator</h1>
                    <p className="text-dark-muted text-xs font-bold uppercase tracking-widest opacity-60">Technical & Behavioral Training Terminal</p>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {step === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Select Target Role</h2>
                                    <div className="space-y-3">
                                        {roles.map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setRole(r)}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${role === r
                                                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                                                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 text-dark-muted hover:text-white'
                                                    }`}
                                            >
                                                <span className="font-bold text-sm uppercase tracking-wide">{r}</span>
                                                {role === r && <Briefcase size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-[#141414] p-8 rounded-3xl border border-white/5">
                                    <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Select Difficulty</h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {difficulties.map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDifficulty(d)}
                                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${difficulty === d
                                                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                                                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 text-dark-muted hover:text-white'
                                                    }`}
                                            >
                                                <Award size={20} />
                                                <span className="font-bold text-[10px] uppercase tracking-wider">{d}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={startSession}
                                    disabled={loading}
                                    className="w-full py-6 bg-brand-primary text-dark-bg font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCw className="animate-spin" /> : <Cpu />}
                                    Initialize Simulation
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'interview' && session && (
                    <motion.div
                        key="interview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative"
                    >
                        {/* CRT Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-brand-primary/[0.02] to-transparent animate-scan" style={{ backgroundSize: '100% 3px' }} />

                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="font-mono text-xs text-brand-primary">LIVE_SESSION // {session.role.toUpperCase()}</span>
                            </div>
                            <span className="font-mono text-xs text-dark-muted">{difficulty.toUpperCase()} MODE</span>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                            {session.transcript.map((t, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: t.speaker === 'AI' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${t.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-5 rounded-2xl font-mono text-sm leading-relaxed ${t.speaker === 'AI'
                                        ? 'bg-[#0a0a0a] border border-white/10 text-gray-300'
                                        : 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary'
                                        }`}>
                                        {t.speaker === 'AI' && <div className="text-[9px] font-bold text-brand-primary uppercase tracking-wider mb-2">System AI</div>}
                                        {t.text}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 flex gap-2">
                                        <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
                            <form onSubmit={sendMessage} className="flex gap-4">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 font-mono text-white placeholder-dark-muted"
                                    autoFocus
                                />
                                <button type="submit" className="p-3 bg-brand-primary rounded-xl text-dark-bg hover:bg-brand-hover transition-colors">
                                    <ChevronRight />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && session && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="bg-[#141414] p-10 rounded-3xl border border-white/5 text-center space-y-6 shadow-2xl">
                            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto border border-brand-primary/20 mb-6">
                                <Award size={40} className="text-brand-primary" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Interview Complete</h2>
                            <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/5">
                                <div>
                                    <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest mb-2">Technical</p>
                                    <p className="text-4xl font-black text-white">{session.scores?.technical}/10</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest mb-2">Communication</p>
                                    <p className="text-4xl font-black text-white">{session.scores?.communication}/10</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-dark-muted uppercase tracking-widest mb-2">Overall</p>
                                    <p className="text-4xl font-black text-brand-primary">{session.scores?.overall}/10</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep('setup')}
                                className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                            >
                                Start New Session
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewSimulator;
