import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getAssetUrl } from '../utils/urlUtils';
import { PlayCircle, BookOpen, Search, Filter, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, in-progress, completed
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const { data } = await api.get('/enrollment/my-courses');
            setCourses(data.filter(e => e && e.courseId).map(enrollment => ({
                ...enrollment.courseId,
                progress: enrollment.progress,
                lastAccessedAt: enrollment.lastAccessedAt
            })) || []);
        } catch (error) {
            console.error('Error fetching courses', error);
        } finally {
            setLoading(false);
        }
    };

    // Derived state
    const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'completed'
                ? course.progress === 100
                : course.progress < 100;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-dark-bg">
            <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-24 pt-24 px-1 md:px-10 max-w-[1600px] mx-auto font-inter overflow-x-hidden">

            {/* Usage Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                        My <span className="text-brand-primary">Matrix</span>
                    </h1>
                    <p className="text-[9px] md:text-[10px] font-bold text-dark-muted uppercase tracking-[0.3em] opacity-50">
                        {courses.length} Active Protocols
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'in-progress', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f
                                ? 'bg-brand-primary text-dark-bg border-brand-primary shadow-lg shadow-brand-primary/20'
                                : 'bg-white/5 text-dark-muted border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* "Continue Watching" Shelf (Only on Mobile/Tablet if exists) */}
            {inProgressCourses.length > 0 && filter === 'all' && !searchTerm && (
                <div className="mb-10 md:hidden">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PlayCircle size={14} className="text-brand-primary" /> Resume Operations
                    </h2>
                    <div className="flex overflow-x-auto gap-3.5 pb-6 -mx-4 px-4 snap-x snap-mandatory remove-scrollbar">
                        {inProgressCourses.slice(0, 5).map(course => (
                            <Link
                                to={`/course/${course._id}`}
                                key={`resume-${course._id}`}
                                className="min-w-[180px] snap-center bg-[#141414] border border-white/5 rounded-xl p-2.5 flex flex-col shadow-xl"
                            >
                                <div className="aspect-video bg-dark-layer2 rounded-lg overflow-hidden relative mb-2.5">
                                    <img src={getAssetUrl(course.thumbnail)} className="w-full h-full object-cover opacity-80" alt="" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <PlayCircle className="text-white/80" size={20} />
                                    </div>
                                    <div className="absolute bottom-1.5 left-1.5 right-1.5 h-[2px] bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary" style={{ width: `${course.progress}%` }} />
                                    </div>
                                </div>
                                <h3 className="text-[10px] font-black text-white uppercase leading-tight line-clamp-1 mb-0.5">{course.title}</h3>
                                <p className="text-[7px] text-brand-primary font-bold uppercase tracking-wider">{Math.round(course.progress)}% Complete</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Library Grid */}
            {filteredCourses.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={course._id}
                            >
                                <Link
                                    to={`/course/${course._id}`}
                                    className="group block bg-[#141414] border border-white/5 rounded-2xl md:rounded-[1.5rem] overflow-hidden hover:border-brand-primary/40 transition-all hover:shadow-2xl hover:shadow-brand-primary/10 h-full flex flex-col"
                                >
                                    <div className="aspect-video bg-dark-layer2 relative overflow-hidden">
                                        <img src={getAssetUrl(course.thumbnail)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                            {course.progress === 100 ? (
                                                <span className="bg-green-500 text-dark-bg text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                                                    <CheckCircle size={8} /> Completed
                                                </span>
                                            ) : (
                                                <span className="bg-black/60 backdrop-blur-md text-white border border-white/10 text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    {course.category || 'Course'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress Bar Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress}%` }}
                                                className={`h-full ${course.progress === 100 ? 'bg-green-500' : 'bg-brand-primary'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 md:p-5 flex-1 flex flex-col">
                                        <h3 className="text-[11px] md:text-base font-black text-white uppercase leading-snug line-clamp-2 mb-2.5 group-hover:text-brand-primary transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-2.5">
                                            <div className="space-y-0.5">
                                                <p className="text-[7px] text-dark-muted font-bold uppercase tracking-widest opacity-60">Progress</p>
                                                <p className={`text-[11px] md:text-6xl font-black italic tracking-tight ${course.progress === 100 ? 'text-green-500' : 'text-white'}`}>
                                                    {Math.round(course.progress)}%
                                                </p>
                                            </div>
                                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-dark-bg transition-all translate-y-0.5">
                                                <PlayCircle size={14} className={course.progress === 100 ? "hidden" : "block"} />
                                                <CheckCircle size={14} className={course.progress === 100 ? "block" : "hidden"} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                    <div className="w-20 h-20 bg-dark-layer2 rounded-full flex items-center justify-center mb-6 opacity-50">
                        <BookOpen size={32} className="text-dark-muted" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Protocols Found</h3>
                    <p className="text-dark-muted text-xs font-bold uppercase tracking-widest mb-8">Initiate your first learning sequence</p>
                    <Link to="/browse" className="bg-brand-primary text-dark-bg px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-xl">
                        Access Catalog
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyLearning;
