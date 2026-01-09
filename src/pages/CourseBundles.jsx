import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Star, Users, Clock, Flame, Tags, Sparkles, Loader2, Target, Shield, Activity, Layers, PlayCircle } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CourseBundles = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fallbackBundles = [
        {
            title: 'Full-Stack Technical Architecture',
            courses: [{ title: 'Engine Performance' }, { title: 'Node.js Systems' }, { title: 'Advanced CSS Structures' }, { title: 'Schema Design' }],
            price: 149,
            discountPercentage: 50,
            tag: 'CORE CURRICULUM',
            bg: 'from-[#141414] to-[#0a0a0a]',
            rating: 4.9,
            students: '1.2k',
            lessons: 145
        },
        {
            title: 'Strategic UI/UX Design',
            courses: [{ title: 'Design Axioms' }, { title: 'System Prototyping' }, { title: 'User Analysis' }, { title: 'Interface Assets' }],
            price: 99,
            discountPercentage: 50,
            tag: 'RECOGNIZED',
            bg: 'from-[#141414] to-[#0a0a0a]',
            rating: 4.8,
            students: '800',
            lessons: 92
        }
    ];

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const response = await api.get('/mega/bundles');
                if (response.data && response.data.length > 0) {
                    setBundles(response.data);
                } else {
                    setBundles(fallbackBundles);
                }
            } catch (error) {
                console.error('Error fetching bundles:', error);
                setBundles(fallbackBundles);
            } finally {
                setLoading(false);
            }
        };
        fetchBundles();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-16 md:space-y-24 py-12 md:py-20 px-4 md:px-8 font-inter text-white pb-40">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 border-b border-white/5 pb-12 md:pb-20 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="space-y-6 md:space-y-8 text-center lg:text-left max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                        <Package size={14} /> Strategic Bundles
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">
                            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-white">Tracks</span>
                        </h1>
                        <p className="text-base md:text-xl text-dark-muted max-w-2xl font-medium leading-relaxed opacity-80">
                            Master high-performance technical domains with our expert-architected curriculum tracks. Optimized for maximum professional delta.
                        </p>
                    </div>
                </div>

                <div className="hidden xl:flex gap-8">
                    <div className="px-8 py-6 bg-[#141414] rounded-3xl border border-white/5 flex flex-col items-center justify-center shadow-2xl">
                        <span className="text-4xl font-black text-white">{bundles.length}+</span>
                        <span className="text-[10px] font-bold text-dark-muted uppercase tracking-[0.2em] mt-1">Active Tracks</span>
                    </div>
                </div>
            </header>

            <div className="space-y-16 md:space-y-24">
                {bundles.map((bundle, i) => {
                    const originalPrice = bundle.discountPercentage > 0
                        ? (bundle.price / (1 - bundle.discountPercentage / 100)).toFixed(0)
                        : bundle.price;

                    return (
                        <div key={i} className="group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all duration-500 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-10" />
                            {bundle.thumbnail && (
                                <div className="absolute inset-0 z-0">
                                    <img src={bundle.thumbnail} alt={bundle.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000" />
                                </div>
                            )}

                            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                                {/* Content Side */}
                                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent">
                                    <div className="space-y-8">
                                        <div className="flex flex-wrap gap-3">
                                            {bundle.tag && <span className="px-3 py-1.5 bg-brand-primary text-dark-bg font-black text-[10px] uppercase tracking-widest rounded-lg">{bundle.tag}</span>}
                                            {bundle.discountPercentage > 0 && <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/20 font-bold text-[10px] uppercase tracking-widest rounded-lg">High Value Savings</span>}
                                        </div>

                                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-[0.9] tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                                            {bundle.title}
                                        </h2>

                                        <div className="flex items-center gap-6 text-dark-muted font-bold text-[11px] uppercase tracking-widest">
                                            <div className="flex items-center gap-2"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {bundle.rating || '4.9'} Rating</div>
                                            <div className="flex items-center gap-2"><Users size={16} /> {bundle.students || '850+'} Enrolled</div>
                                        </div>

                                        <p className="text-dark-muted text-sm leading-relaxed max-w-md border-l-2 border-brand-primary/30 pl-4">
                                            {bundle.description || 'A comprehensive collection of courses designed to take you from beginner to expert in record time.'}
                                        </p>
                                    </div>

                                    <div className="pt-12">
                                        <div className="flex items-baseline gap-4 mb-8">
                                            <span className="text-6xl font-black text-white tracking-tighter">${bundle.price}</span>
                                            {bundle.discountPercentage > 0 && (
                                                <span className="text-xl text-dark-muted line-through font-bold decoration-2 opacity-50">${originalPrice}</span>
                                            )}
                                        </div>
                                        <button className="w-full sm:w-auto px-10 py-4 bg-white text-black hover:bg-brand-primary font-black rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-105 active:scale-95">
                                            Unlock Bundle Access <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* List Side */}
                                <div className="lg:col-span-7 p-8 md:p-12 lg:border-l border-white/5 bg-white/[0.02] backdrop-blur-sm">
                                    <div className="space-y-8 h-full flex flex-col">
                                        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                                            <Layers className="text-brand-primary" size={20} />
                                            <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Included Curriculum</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                                            {bundle.courses.map((course, j) => (
                                                <div key={j} className="group/item flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/40 hover:bg-white/10 transition-all cursor-default">
                                                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shrink-0 text-dark-muted group-hover/item:text-brand-primary transition-colors">
                                                        <PlayCircle size={24} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-white leading-tight group-hover/item:text-brand-primary transition-colors line-clamp-2">{course.title}</h4>
                                                        <p className="text-[10px] text-dark-muted uppercase tracking-wider mt-1.5 opacity-60">Module {j + 1}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-dark-muted uppercase tracking-widest font-bold">Total Duration</p>
                                                <p className="text-lg font-bold text-white flex items-center gap-2"><Clock size={16} className="text-brand-primary" /> {bundle.lessons || '45h 20m'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-dark-muted uppercase tracking-widest font-bold">Certification</p>
                                                <p className="text-lg font-bold text-white flex items-center gap-2"><Shield size={16} className="text-brand-primary" /> Included</p>
                                            </div>
                                            <div className="space-y-1 hidden md:block">
                                                <p className="text-[10px] text-dark-muted uppercase tracking-widest font-bold">Access Level</p>
                                                <p className="text-lg font-bold text-white flex items-center gap-2"><Target size={16} className="text-brand-primary" /> Lifetime</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Strategic Track Composer Call to Action */}
            <div className="mt-32 relative rounded-[3rem] overflow-hidden group">
                <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <div className="relative z-10 p-12 md:p-24 text-center space-y-8">
                    <div className="w-20 h-20 mx-auto bg-brand-primary text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Sparkles size={40} strokeWidth={2.5} />
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-[0.9]">
                            Build Your Own <span className="text-brand-primary">Path</span>
                        </h2>
                        <p className="text-lg md:text-xl text-dark-muted font-medium">
                            Select any 5 modules to architect a personalized learning track and unlock an automatic <span className="text-white font-bold">40% tuition advantage</span>.
                        </p>
                    </div>

                    <button className="px-12 py-5 bg-white text-black hover:bg-brand-primary font-black rounded-xl text-sm uppercase tracking-[0.25em] transition-all transform hover:scale-105 shadow-2xl">
                        Launch Track Composer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseBundles;
