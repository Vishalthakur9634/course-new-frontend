import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Award, TrendingUp, Users, Star, Trophy, Medal, BookOpen, Sparkles } from 'lucide-react';

const Leaderboard = () => {
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    const fetchLeaderboards = async () => {
        try {
            // Fetch top students based on enrollment count and course completion
            const { data: enrollments } = await api.get('/enrollment/leaderboard');

            // Fetch top instructors based on student count and ratings
            const { data: instructorData } = await api.get('/users/instructors/top');

            setStudents(enrollments || []);
            setInstructors(instructorData || []);
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
            setStudents([]);
            setInstructors([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                <p className="text-dark-muted mt-4">Loading leaderboards...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4 md:px-6 xl:px-0 py-8">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs md:text-sm font-bold">
                    <Trophy size={14} className="md:w-4 md:h-4" /> Global Leaderboard
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Top Performers</h1>
                <p className="text-dark-muted max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">Celebrate the dedication and achievements of our most active students and top-rated instructors.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Students Leaderboard */}
                <section className="bg-dark-layer1 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-brand-primary/10 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center">
                                <Users className="text-brand-primary" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white">Top Students</h2>
                                <p className="text-[10px] md:text-xs text-dark-muted font-bold uppercase tracking-widest">Global Ranking</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 md:p-4">
                        {students.length === 0 ? (
                            <div className="text-center py-8 text-dark-muted">
                                No student data available yet
                            </div>
                        ) : (
                            students.map((student, index) => {
                                const rank = index + 1;
                                const userName = student.userId?.name || student.name || 'Unknown Student';
                                const points = student.points || (student.coursesCompleted * 100) || 0;
                                const courses = student.coursesCompleted || student.courses || 0;

                                return (
                                    <div key={student._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-5 rounded-2xl md:rounded-3xl hover:bg-white/5 transition-all duration-300 group cursor-default gap-2 sm:gap-0">
                                        <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto">
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shadow-lg ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-dark-bg ring-2 md:ring-4 ring-yellow-500/20' :
                                                    rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-dark-bg ring-2 md:ring-4 ring-gray-400/20' :
                                                        rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white ring-2 md:ring-4 ring-amber-700/20' :
                                                            'bg-dark-layer2 text-dark-text border border-white/5'
                                                    }`}>
                                                    {userName.charAt(0).toUpperCase()}
                                                </div>
                                                {rank <= 3 && (
                                                    <div className="absolute -top-1.5 -right-1.5 md:-top-3 md:-right-3 animate-bounce">
                                                        <Medal size={16} className={`md:w-6 md:h-6 ${rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                                            rank === 2 ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]' :
                                                                'text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]'
                                                            }`} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm md:text-lg font-black text-white group-hover:text-brand-primary transition-colors truncate max-w-[140px] sm:max-w-none">{userName}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex items-center gap-1 text-[9px] md:text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5 font-bold uppercase tracking-wider">
                                                        <BookOpen size={9} className="text-brand-primary" /> {courses} Courses
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right pl-[3.5rem] sm:pl-0 w-full sm:w-auto">
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <Sparkles size={12} className="text-brand-primary animate-pulse" />
                                                <p className="text-base md:text-xl font-black text-white">{points.toLocaleString()}</p>
                                            </div>
                                            <p className="text-[9px] md:text-[10px] font-black text-dark-muted uppercase tracking-[0.2em] mt-0.5 opacity-60">Quest XP</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="p-6 text-center border-t border-white/5">
                        <button className="text-sm font-black text-brand-primary hover:text-white transition-colors uppercase tracking-widest">View Full Standings</button>
                    </div>
                </section>

                {/* Instructors Leaderboard */}
                <section className="bg-dark-layer1 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                <TrendingUp className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white">Elite Mentors</h2>
                                <p className="text-[10px] md:text-xs text-dark-muted font-bold uppercase tracking-widest">Master Instructors</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 md:p-4">
                        {instructors.length === 0 ? (
                            <div className="text-center py-8 text-dark-muted">
                                No instructor data available yet
                            </div>
                        ) : (
                            instructors.map((instructor, index) => {
                                const rank = index + 1;
                                return (
                                    <div key={instructor._id} className="flex items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl hover:bg-white/5 transition-all duration-300 group cursor-default">
                                        <div className="flex items-center gap-4 md:gap-5">
                                            <div className="text-2xl md:text-3xl font-black text-dark-layer2 w-8 md:w-12 text-center group-hover:text-purple-500/50 transition-colors tracking-tighter">
                                                #{rank}
                                            </div>
                                            <div>
                                                <h3 className="text-base md:text-lg font-black text-white group-hover:text-purple-400 transition-colors">{instructor.name}</h3>
                                                <p className="text-xs text-dark-muted font-medium mt-0.5">{(instructor.studentCount || instructor.students || 0).toLocaleString()} Students Enrolled</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-yellow-500/10 py-1 md:py-1.5 px-3 md:px-4 rounded-xl md:rounded-2xl border border-yellow-500/20 shadow-inner">
                                            <Star size={14} className="text-yellow-500 fill-yellow-500 md:w-4 md:h-4" />
                                            <span className="text-base md:text-lg font-black text-yellow-500">{instructor.rating || 0}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="p-6 mt-auto">
                        <div className="bg-dark-layer2/50 rounded-2xl p-6 border border-white/5 text-center">
                            <p className="text-sm text-dark-muted font-medium italic">"The best instructors are those who show you where to look but don't tell you what to see."</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Leaderboard;
