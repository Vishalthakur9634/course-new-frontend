import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, MessageSquare, Send, Zap, BookOpen,
    Brain, Target, Clock, RefreshCw, BarChart,
    Lightbulb, ShieldCheck, HelpCircle, ArrowRight,
    ChevronRight, Layout
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

const AIStudyAssistant = () => {
    const [activeMode, setActiveMode] = useState('tutor');

    const stats = [
        { label: 'Concepts Simplified', value: 156, icon: Brain },
        { label: 'Quizzes Taken', value: 24, icon: Target },
        { label: 'Study Time Saved', value: 12, suffix: 'h', icon: Clock },
        { label: 'AI Confidence', value: 98, suffix: '%', icon: ShieldCheck }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8">
            <div className="mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-purple-600/20 via-brand-primary/10 to-transparent border border-brand-primary/20 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 hidden lg:block">
                        <Sparkles size={120} className="text-brand-primary animate-pulse" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 flex items-center gap-4">
                            Quest AI Assistant
                        </h1>
                        <p className="text-brand-primary/80 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <Zap size={16} />
                            Your personalized super-tutor is ready
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 bg-brand-primary text-dark-bg font-extrabold rounded-xl hover:bg-brand-hover transition-all shadow-[0_0_30px_rgba(255,204,0,0.3)] flex items-center gap-2">
                                Start Session
                                <ArrowRight size={18} />
                            </button>
                            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                                View Learning Style
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, idx) => (
                    <StatWidget key={idx} {...s} size="sm" color="brand-primary" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Chat Interface Preview */}
                <div className="lg:col-span-8 bg-dark-layer1 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[600px]">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">AI Interactive Tutor</h3>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Real-time Analysis Active</span>
                            </div>
                        </div>
                        <select className="bg-dark-layer2 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-brand-primary">
                            <option>React Mastery Path</option>
                            <option>System Design Fundamentals</option>
                        </select>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto mb-8 custom-scrollbar px-2">
                        <div className="flex gap-4 max-w-[80%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">AI</div>
                            <div className="bg-dark-layer2 rounded-2xl rounded-tl-none p-5 text-dark-muted leading-relaxed text-sm">
                                Hello! I see you just finished the lecture on "React Context API". Would you like me to generate a 5-question quiz to test your understanding, or should I explain the "Provider-Consumer" pattern like you're five?
                            </div>
                        </div>
                        <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">ME</div>
                            <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl rounded-tr-none p-5 text-white leading-relaxed text-sm shadow-[0_0_20px_rgba(255,204,0,0.05)]">
                                Let's go with the "Explain like I'm 5" mode for the Provider-Consumer pattern, please!
                            </div>
                        </div>
                        <div className="flex gap-4 max-w-[80%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">AI</div>
                            <div className="bg-dark-layer2 rounded-2xl rounded-tl-none p-5 text-dark-muted leading-relaxed text-sm">
                                Think of it like a giant Pizza Delivery System! 🍕
                                <br /><br />
                                The **Provider** is the master chef in the kitchen. He makes the pizza and has all the ingredients. He doesn't want to run around giving it to every single person individually.
                                <br /><br />
                                The **Consumer** is the hungry student in their room. Instead of going to the kitchen, they just have a "Pizza Magic Hole" in their wall. Whenever they need pizza (data), they just reach in and it's there!
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask any question about your course content..."
                            className="w-full bg-dark-layer2 border border-white/5 rounded-2xl pl-6 pr-16 py-5 text-white placeholder-dark-muted focus:outline-none focus:border-brand-primary/50"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-primary text-dark-bg rounded-xl hover:bg-brand-hover transition-all">
                            <Send size={20} />
                        </button>
                    </div>
                </div>

                {/* Features Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Layout className="text-brand-primary" size={20} />
                            Smart Tools
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Flashcard Generator', icon: RefreshCw, color: 'blue' },
                                { title: 'Schedule Optimizer', icon: Clock, color: 'green' },
                                { title: 'Spaced Repetition', icon: Brain, color: 'purple' },
                                { title: 'Concept Maps', icon: Lightbulb, color: 'orange' }
                            ].map((tool, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-4 bg-dark-bg/40 border border-white/5 rounded-2xl group hover:border-brand-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <tool.icon className={`text-${tool.color}-500`} size={18} />
                                        <span className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{tool.title}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-dark-muted" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <RefreshCw className="text-brand-primary" size={20} />
                                Learning Speed
                            </h3>
                            <span className="text-xs font-bold text-brand-primary">2.4x Target</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '70%' }}
                                className="h-full bg-brand-primary shadow-[0_0_10px_rgba(255,204,0,0.5)]"
                            />
                        </div>
                        <p className="text-xs text-dark-muted leading-relaxed">Your retention for "Functional Programming" is 20% higher than average thanks to AI-generated flashcards.</p>
                    </div>

                    <div className="bg-dark-layer1 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
                            <HelpCircle className="text-brand-primary" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 underline decoration-brand-primary/30 decoration-2 underline-offset-4">Need a Study Buddy?</h3>
                        <p className="text-sm text-dark-muted mb-6">Our AI can pair you with another student who is currently at the same milestone!</p>
                        <button className="w-full py-4 bg-white/5 border border-brand-primary/20 text-brand-primary font-bold rounded-2xl hover:bg-brand-primary hover:text-dark-bg transition-all text-xs uppercase tracking-widest">
                            Find Active Peer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIStudyAssistant;
