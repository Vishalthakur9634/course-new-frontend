import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, MessageSquare, Send, Zap, BookOpen,
    Brain, Target, Clock, RefreshCw, BarChart,
    Lightbulb, ShieldCheck, HelpCircle, ArrowRight,
    ChevronRight, Layout, User, Bot, Loader2, Search
} from 'lucide-react';
import StatWidget from '../../components/StatWidget';

const AIStudyAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Greetings. I am the Quest Neural Interface. I have analyzed your recent progress in React.js. Shall we begin a spaced repetition session or would you prefer to explore a new concept?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Latency
        setTimeout(() => {
            const airesponse = generateResponse(input);
            setMessages(prev => [...prev, { role: 'ai', content: airesponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (query) => {
        const lower = query.toLowerCase();
        if (lower.includes('quiz') || lower.includes('test')) return "Initiating Assessment Protocol... Question 1: In React, what is the primary difference between useEffect and useLayoutEffect in terms of rendering blocking?";
        if (lower.includes('explain') || lower.includes('what')) return "Accessing Knowledge Base... Concept Loaded. To understand this, imagine data flowing like water through a pipe system. Components are the valves. When you change state, you adjust the valve pressure, causing the view to update downstream.";
        if (lower.includes('hello') || lower.includes('hi')) return "System Online. Ready to assist with your learning path. What is your objective today?";
        return "I've logged that query. While my knowledge core is processing specific context, I recommend reviewing the 'Advanced Patterns' module. Would you like me to summarize it?";
    };

    const stats = [
        { label: 'Concepts Validated', value: 156, icon: Brain },
        { label: 'Neural Accuracy', value: 98, suffix: '%', icon: Target },
        { label: 'Time Optimization', value: 12, suffix: 'h', icon: Clock },
        { label: 'Study Streak', value: 4, suffix: 'd', icon: Zap }
    ];

    return (
        <div className="min-h-screen bg-dark-bg font-orbit p-4 md:p-8 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                <div className="mb-8 flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                                <Sparkles className="text-brand-primary" size={32} />
                                QUEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-500">AI CORE</span>
                            </h1>
                            <p className="text-dark-muted font-bold text-xs uppercase tracking-[0.2em] pl-1">
                                Advanced Personal Tutor • v4.2
                            </p>
                        </div>

                        <div className="flex gap-4 hidden md:flex">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-dark-layer1 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <s.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-black text-white leading-none">{s.value}<span className="text-xs">{s.suffix}</span></div>
                                        <div className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">{s.label.split(' ')[0]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    {/* Chat Area */}
                    <div className="lg:col-span-9 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-md flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">System Online</span>
                            </div>
                            <select className="bg-dark-bg border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-brand-primary">
                                <option>General Tutor</option>
                                <option>Code Reviewer</option>
                                <option>Quiz Master</option>
                            </select>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-brand-primary to-purple-600 text-white shadow-lg' : 'bg-dark-layer2 text-dark-muted'}`}>
                                        {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                                    </div>
                                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm leading-relaxed font-medium ${msg.role === 'ai'
                                        ? 'bg-dark-layer1 border border-white/5 text-dark-muted rounded-tl-none'
                                        : 'bg-brand-primary text-black font-bold rounded-tr-none shadow-[0_0_20px_rgba(255,204,0,0.1)]'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-dark-layer1 border border-white/5 rounded-[2rem] rounded-tl-none p-5 flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-2 h-2 bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-2 h-2 bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Message Neural Core..."
                                    className="w-full bg-dark-bg border border-white/10 rounded-2xl pl-6 pr-20 py-5 text-white placeholder:text-dark-muted focus:outline-none focus:border-brand-primary/50 font-medium transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-brand-primary text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-6 hidden lg:block overflow-y-auto custom-scrollbar">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 space-y-4">
                            <h3 className="text-xs font-black text-dark-muted uppercase tracking-widest pl-1 mb-2">Neural Tools</h3>
                            {[
                                { title: 'Generate Quiz', icon: HelpCircle, color: 'text-brand-primary' },
                                { title: 'Explain Logic', icon: Lightbulb, color: 'text-purple-500' },
                                { title: 'Analyze Code', icon: Search, color: 'text-blue-500' },
                                { title: 'Summarize', icon: Layout, color: 'text-green-500' }
                            ].map((tool, i) => (
                                <button key={i} className="w-full p-4 bg-dark-bg border border-white/5 rounded-2xl flex items-center gap-3 hover:border-brand-primary/30 transition-all group text-left">
                                    <div className={`p-2 bg-white/5 rounded-lg ${tool.color} group-hover:scale-110 transition-transform`}>
                                        <tool.icon size={18} />
                                    </div>
                                    <span className="font-bold text-white text-sm">{tool.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-brand-primary/20 to-purple-600/20 border border-brand-primary/20 rounded-[2rem] p-6 text-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <Zap className="text-brand-primary" fill="currentColor" />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2">Boost Learning?</h3>
                            <p className="text-xs text-dark-muted mb-4 leading-relaxed font-medium">Activate "Deep Focus Mode" to disable notifications and optimize interface for retention.</p>
                            <button className="w-full py-3 bg-brand-primary text-black font-black uppercase text-xs tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(255,204,0,0.4)] transition-all">
                                Activate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIStudyAssistant;
