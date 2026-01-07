import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Search, MoreVertical, Bell, CheckCheck, ChevronRight } from 'lucide-react';

const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('all');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [mobileShowChat, setMobileShowChat] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCourseId === 'all') {
            setFilteredAnnouncements(announcements);
        } else {
            setFilteredAnnouncements(announcements.filter(a => a.courseId?._id === selectedCourseId));
        }
    }, [selectedCourseId, announcements]);

    useEffect(() => {
        if (mobileShowChat) {
            scrollToBottom();
        }
    }, [filteredAnnouncements, mobileShowChat]);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    const fetchData = async () => {
        try {
            const { data } = await api.get('/announcements/student');
            // Sort by createdAt ascending for chat view
            const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setAnnouncements(sorted);

            // Extract unique courses
            const uniqueCourses = [];
            const courseMap = new Map();

            data.forEach(a => {
                if (a.courseId && !courseMap.has(a.courseId._id)) {
                    courseMap.set(a.courseId._id, true);
                    uniqueCourses.push(a.courseId);
                }
            });
            setCourses(uniqueCourses);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="flex h-[calc(100vh-140px)] md:h-full bg-dark-bg overflow-hidden rounded-xl border border-dark-layer2 shadow-2xl relative">
            {/* Sidebar - Course List */}
            <div className={`w-full md:w-80 bg-dark-layer1 border-r border-dark-layer2 flex flex-col absolute inset-0 md:relative z-10 transition-transform duration-300 ${mobileShowChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                <div className="p-4 border-b border-dark-layer2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-dark-layer2 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                        <Search className="absolute left-3 top-2.5 text-dark-muted" size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div
                        onClick={() => {
                            setSelectedCourseId('all');
                            setMobileShowChat(true);
                        }}
                        className={`p-4 cursor-pointer hover:bg-dark-layer2 transition-colors border-b border-dark-layer2/50 ${selectedCourseId === 'all' ? 'bg-dark-layer2 border-l-4 border-l-brand-primary' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">All Chats</h3>
                                <p className="text-sm text-dark-muted">Combined feed</p>
                            </div>
                        </div>
                    </div>

                    {courses.map(course => (
                        <div
                            key={course._id}
                            onClick={() => {
                                setSelectedCourseId(course._id);
                                setMobileShowChat(true);
                            }}
                            className={`p-4 cursor-pointer hover:bg-dark-layer2 transition-colors border-b border-dark-layer2/50 ${selectedCourseId === course._id ? 'bg-dark-layer2 border-l-4 border-l-brand-primary' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                    {course.title.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{course.title}</h3>
                                    <p className="text-sm text-dark-muted truncate">
                                        Instructor Update
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#0e1621] relative w-full h-full md:w-auto transition-transform duration-300 absolute inset-0 md:relative z-20 ${mobileShowChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                {/* Chat Header */}
                <div className="p-4 bg-dark-layer1 border-b border-dark-layer2 flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-3">
                        {/* Back Button for Mobile */}
                        <button
                            onClick={() => setMobileShowChat(false)}
                            className="md:hidden text-dark-muted hover:text-white mr-2"
                        >
                            <ChevronRight size={24} className="rotate-180" />
                        </button>

                        {selectedCourseId !== 'all' && (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
                                {courses.find(c => c._id === selectedCourseId)?.title.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-white font-bold text-base md:text-lg truncate max-w-[200px]">
                                {selectedCourseId === 'all' ? 'All Chats' : courses.find(c => c._id === selectedCourseId)?.title}
                            </h2>
                            <p className="text-xs md:text-sm text-dark-muted">
                                {selectedCourseId === 'all' ? 'Updates from all your instructors' : 'Official Course Channel'}
                            </p>
                        </div>
                    </div>
                    <button className="text-dark-muted hover:text-white">
                        <MoreVertical size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-opacity-50 scroll-smooth pb-24 md:pb-4"
                    style={{ backgroundImage: 'url("https://web.telegram.org/img/bg_0.png")', backgroundBlendMode: 'overlay', backgroundColor: '#0e1621' }}>

                    {filteredAnnouncements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-dark-muted opacity-70">
                            <div className="bg-dark-layer1/50 p-4 rounded-full mb-4">
                                <Bell size={48} />
                            </div>
                            <p>No announcements yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {filteredAnnouncements.map((announcement, index) => {
                                const showDate = index === 0 || new Date(announcement.createdAt).toDateString() !== new Date(filteredAnnouncements[index - 1].createdAt).toDateString();
                                const isInstructor = true; // Assuming all incoming are instructor for now

                                return (
                                    <React.Fragment key={announcement._id}>
                                        {showDate && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-[#202c33] text-dark-muted text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm border border-white/5">
                                                    {new Date(announcement.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isInstructor ? 'items-start' : 'items-end'} max-w-[85%] md:max-w-[70%] self-start`}>
                                            <div className="bg-[#202c33] text-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-none p-3 shadow-md relative group hover:shadow-lg transition-all border border-white/5 ml-2">
                                                {/* Sender Name */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[#aebac1] font-bold text-[11px] md:text-xs uppercase tracking-wide">
                                                        {announcement.createdBy?.name || 'Instructor'}
                                                    </span>
                                                    {announcement.courseId && selectedCourseId === 'all' && (
                                                        <span className="text-brand-primary text-[9px] font-bold uppercase tracking-wider opacity-80">
                                                            via {announcement.courseId.title}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="whitespace-pre-wrap text-[13.5px] md:text-[15px] leading-relaxed text-[#e9edef] font-normal">{announcement.message}</p>

                                                <div className="flex items-center justify-end gap-1 mt-1 select-none">
                                                    <span className="text-[10px] md:text-[11px] text-[#8696a0]">
                                                        {new Date(announcement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {/* Checkmarks simulation (read-only view) */}
                                                    <CheckCheck size={14} className="text-brand-primary" />
                                                </div>

                                                {/* Tail Svg */}
                                                <div className="absolute top-0 -left-2 w-3 h-3 text-[#202c33] fill-current">
                                                    <svg viewBox="0 0 8 13" width="8" height="13" className="">
                                                        <path opacity="0.13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                                                        <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Read Only Footer */}
                <div className="p-4 bg-dark-layer1 border-t border-dark-layer2 text-center text-dark-muted text-xs md:text-sm">
                    Only instructors can send messages in this channel.
                </div>
            </div>
        </div>
    );
};

export default StudentAnnouncements;
