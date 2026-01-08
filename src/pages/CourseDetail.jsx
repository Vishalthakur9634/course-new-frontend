import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { getAssetUrl } from '../utils/urlUtils';
import VideoPlayer from '../components/VideoPlayer';
import CourseSidebar from '../components/CourseSidebar';
import VideoTabs from '../components/VideoTabs';
import Reviews from '../components/Reviews';
import PaymentModal from '../components/PaymentModal';
import { Menu, X, Lock, PlayCircle, ShieldCheck, Heart, Check, Share2, Award, Users, BookOpen, Clock, Activity } from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progressMap, setProgressMap] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [videoTime, setVideoTime] = useState(0);

    const [hasAccess, setHasAccess] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [enrollmentType, setEnrollmentType] = useState('none'); // 'none', 'trial', 'full'

    // Explicit Access States
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            setCurrentUser(userObj);
            setIsAdmin(userObj.role === 'superadmin');
            checkWishlistStatus(userObj.id || userObj._id);
        }

        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');
        if (refCode) {
            localStorage.setItem('currentReferral', refCode);
        }

        fetchCourseData();

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const checkWishlistStatus = async (userId) => {
        try {
            const { data } = await api.get(`/users/${userId}/wishlist`);
            const inWishlist = data.some(c => c._id === id);
            setIsWishlisted(inWishlist);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async () => {
        if (!currentUser) {
            alert('Please login to add to wishlist');
            return;
        }

        try {
            const userId = currentUser.id || currentUser._id;
            const { data } = await api.post(`/users/${userId}/wishlist/${id}`);
            setIsWishlisted(data.action === 'added');
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const fetchCourseData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);
            const userId = user.id || user._id;

            const [courseRes, userRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get(`/users/profile/${userId}`)
            ]);

            setCourse(courseRes.data);

            const enrollment = userRes.data.enrolledCourses?.find(e => {
                const courseId = e.courseId?._id || e.courseId;
                return courseId === id;
            });

            const enrolled = !!enrollment;
            const trial = enrollment?.type === 'trial';
            const owner = courseRes.data.instructorId?._id === userId || courseRes.data.instructorId === userId;
            const admin = user.role === 'superadmin';

            setIsEnrolled(enrolled && !trial);
            setIsOwner(owner);
            setIsAdmin(admin);

            // Grant access for full enrollment, trial, admin, or owner
            // NOTE: Even if trial, we might want to show LOCKED for some videos eventually,
            // but for now, trial gives access to the player, but maybe not all validation perks.
            // Requirement update: Trial users should see "Upgrade" buttons.

            if (admin || (enrolled && !trial) || owner) {
                setHasAccess(true);
                if (courseRes.data.videos.length > 0) {
                    setActiveVideo(courseRes.data.videos[0]);
                }
            } else if (trial) {
                // Trial User Logic: Give Access to Player but keep hasAccess 'true' simply so they can see the video?
                // Or if we want to LOCK specific parts, we need granular logic.
                // For now, let's say Trial users have access so they can watch content (as per original logic).
                setHasAccess(true);
                if (courseRes.data.videos.length > 0) {
                    setActiveVideo(courseRes.data.videos[0]);
                }
            } else {
                setHasAccess(false);
            }

            setEnrollmentType(trial ? 'trial' : enrolled ? 'full' : 'none');

            const progress = {};
            if (userRes.data.watchHistory) {
                userRes.data.watchHistory.forEach(h => {
                    if (h.videoId) progress[h.videoId._id || h.videoId] = h;
                });
            }
            setProgressMap(progress);

        } catch (error) {
            console.error('Error fetching course details', error);
        } finally {
            setLoading(false);
        }
    };

    // [NEW] AGGRESSIVE PAYWALL: Auto-open payment modal if not enrolled
    useEffect(() => {
        if (!loading && !hasAccess && !isAdmin && !isOwner) {
            // Small delay for smoother UX
            const timer = setTimeout(() => {
                setShowPaymentModal(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loading, hasAccess, isAdmin, isOwner]);

    const handleVideoSelect = (video) => {
        if (!hasAccess) return;
        setActiveVideo(video);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const handleProgress = async (currentTime, duration) => {
        if (!activeVideo || !course || !hasAccess) return;

        const completed = (currentTime / duration) > 0.8;

        try {
            setVideoTime(currentTime);
            const userId = JSON.parse(localStorage.getItem('user')).id;
            await api.put(`/enrollment/${course._id}/progress`, {
                videoId: activeVideo._id,
                progress: currentTime,
                completed,
                timeSpent: 5
            });

            if (completed) {
                setProgressMap(prev => ({
                    ...prev,
                    [activeVideo._id]: { ...prev[activeVideo._id], completed: true }
                }));
            }
        } catch (error) {
            console.error('Error saving progress', error);
        }
    };

    const handlePurchaseSuccess = () => {
        setHasAccess(true);
        fetchCourseData();
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white font-bold uppercase tracking-widest text-[10px]">Analyzing Curriculum Matrix...</div>;
    if (!course) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white font-bold uppercase tracking-widest text-[10px]">Course Not Found</div>;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] relative font-inter text-white overflow-hidden">
            {showPaymentModal && (
                <PaymentModal
                    course={course}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePurchaseSuccess}
                />
            )}

            {/* HIGH-FIDELITY CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* STRATEGIC VIDEO PLAYER */}
                <div className="bg-black w-full relative flex-shrink-0 flex items-center justify-start py-4 px-4 md:px-8" style={{ maxHeight: '500px' }}>
                    <div className="w-full aspect-video max-w-[900px]">
                        {hasAccess ? (
                            activeVideo ? (
                                <VideoPlayer
                                    src={getAssetUrl(activeVideo.videoUrl)}
                                    poster={getAssetUrl(activeVideo.thumbnailUrl)}
                                    onProgress={handleProgress}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6">
                                    <div className="text-dark-muted font-bold text-[10px] uppercase tracking-[0.4em] opacity-30">Select a syllabus module to begin</div>
                                    {enrollmentType === 'trial' && (
                                        <button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="px-6 py-3 bg-brand-primary text-dark-bg font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                                        >
                                            Upgrade to Full Access
                                        </button>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-4 md:p-8 text-center">
                                <div className="bg-[#141414] p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 max-w-xl w-full shadow-3xl space-y-6 md:space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto border border-brand-primary/20 shadow-xl">
                                        <Lock size={32} className="md:w-9 md:h-9" />
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight">Access Restricted</h2>
                                        <p className="text-dark-muted text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-60">Professional Enrollment Required to Access Curriculum</p>
                                    </div>

                                    <div className="py-6 md:py-8 border-y border-white/5 space-y-2">
                                        <p className="text-[9px] md:text-[10px] font-bold text-dark-muted uppercase tracking-[0.4em] opacity-40">Program Investment</p>
                                        <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter">${course.price}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 md:gap-5 pt-4">
                                        <button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="flex-1 bg-brand-primary hover:brightness-110 text-dark-bg font-bold py-4 md:py-5 rounded-2xl text-[10px] md:text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-brand-primary/20"
                                        >
                                            {enrollmentType === 'trial' ? 'Upgrade to Full Access' : course.price > 0 ? 'Purchase Full Access' : 'Enroll Now Free'}
                                        </button>
                                        {course.price > 0 && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const user = JSON.parse(localStorage.getItem('user'));
                                                        await api.post('/enrollment/enroll', {
                                                            courseId: course._id,
                                                            type: 'trial'
                                                        });
                                                        handlePurchaseSuccess();
                                                    } catch (err) {
                                                        alert(err.response?.data?.message || 'Trial enrollment failed');
                                                    }
                                                }}
                                                className="flex-1 bg-[#141414] hover:bg-white/5 text-white font-bold py-4 md:py-5 rounded-2xl text-[10px] md:text-[11px] border border-white/5 uppercase tracking-[0.3em] transition-all"
                                            >
                                                Start Free Trial
                                            </button>
                                        )}
                                        <button
                                            onClick={toggleWishlist}
                                            className={`px-8 py-4 md:py-0 rounded-2xl border transition-all flex items-center justify-center ${isWishlisted
                                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                : 'border-white/10 hover:border-brand-primary/40 text-white bg-[#0a0a0a]'
                                                }`}
                                        >
                                            <Heart size={22} className={isWishlisted ? "fill-brand-primary" : ""} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 md:gap-8 pt-4">
                                        <div className="flex items-center gap-2.5 text-[8px] md:text-[9px] font-bold text-dark-muted uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-green-500 md:w-4 md:h-4" /> Secure Registry
                                        </div>
                                        <div className="flex items-center gap-2.5 text-[8px] md:text-[9px] font-bold text-dark-muted uppercase tracking-widest">
                                            <Award size={14} className="text-brand-primary md:w-4 md:h-4" /> Verified Credential
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* DOMAIN DETAILS MATRIX */}
                <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 md:space-y-16 custom-scrollbar pb-24 md:pb-12">
                    <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-10 pb-8 md:pb-12 border-b border-white/5">
                        <div className="space-y-4 md:space-y-6 max-w-4xl">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                    {course.category || 'Strategic Track'}
                                </span>
                                <div className="flex items-center gap-2.5 text-[10px] font-bold text-dark-muted uppercase tracking-widest opacity-60">
                                    <Users size={14} className="text-brand-primary" /> {course.enrollmentCount || 0} Domain Learners
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none text-white">{course.title}</h1>
                            <p className="text-dark-muted text-xs md:text-[13px] font-medium leading-loose opacity-70 max-w-2xl">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    const shareId = currentUser?.referralCode || currentUser?.id || currentUser?._id;
                                    const shareLink = `${window.location.origin}/course/${course._id}${shareId ? `?ref=${shareId}` : ''}`;
                                    navigator.clipboard.writeText(shareLink);
                                    alert('Link copied to clipboard!');
                                }}
                                className="p-3 md:p-4 rounded-2xl bg-[#141414] border border-white/5 text-dark-muted hover:text-brand-primary hover:border-brand-primary/40 transition-all shadow-xl"
                            >
                                <Share2 size={24} />
                            </button>

                            {/* [FIX] FORCE PURCHASE BUTTON VISIBILITY IF NOT FULLY ENROLLED */}
                            {/* [FIX] FORCE PURCHASE BUTTON VISIBILITY IF NOT FULLY ENROLLED */}
                            {(!isEnrolled || enrollmentType === 'trial') && !isAdmin && !isOwner && (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="bg-brand-primary text-dark-bg px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-2xl shadow-brand-primary/20 animate-pulse"
                                >
                                    {course.price > 0 ? (enrollmentType === 'trial' ? 'Upgrade Full Access' : 'Purchase Full Access') : 'Enroll Free'}
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-16">
                        <div className="xl:col-span-2 space-y-8 md:space-y-16">
                            {hasAccess && activeVideo && (
                                <VideoTabs
                                    video={activeVideo}
                                    course={course}
                                    currentTime={videoTime}
                                />
                            )}

                            <div className="bg-[#141414] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 md:space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                                        <Activity size={20} className="text-brand-primary" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight text-white">Validation Performance</h3>
                                </div>
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.3em]">
                                        <span className="text-dark-muted opacity-40">Completion Matrix Rate</span>
                                        <span className="text-2xl md:text-3xl font-black text-brand-primary tracking-tighter">
                                            {Math.round((Object.values(progressMap).filter(p => p.completed).length / (course.videos.length || 1)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#0a0a0a] rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                        <div
                                            className="bg-brand-primary h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-brand-primary/40"
                                            style={{ width: `${(Object.values(progressMap).filter(p => p.completed).length / (course.videos.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-dark-muted text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
                                        {Object.values(progressMap).filter(p => p.completed).length} MODULES VALIDATED OUT OF {course.videos.length} SYLLABUS NODES
                                    </p>
                                </div>
                            </div>

                            <Reviews courseId={id} />
                        </div>

                        <aside className="space-y-12 hidden xl:block">
                            {/* Desktop specific aside content if any */}
                        </aside>
                    </div>
                </div>
            </div>

            {/* SYLLABUS MATRIX SIDEBAR */}
            <div
                className={`fixed inset-y-0 right-0 z-[60] bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.8)] transition-all duration-500 ease-in-out pt-20 md:pt-0 ${sidebarOpen ? 'translate-x-0 w-full md:w-[380px]' : 'translate-x-full w-full md:w-[380px]'}`}
            >
                <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center bg-[#141414]/30">
                    <div className="space-y-1">
                        <h3 className="text-xs font-bold text-white uppercase tracking-[0.4em]">Syllabus <span className="text-brand-primary">Matrix</span></h3>
                        <p className="text-[9px] font-bold text-dark-muted uppercase tracking-widest opacity-40">{course.videos.length} Modules Registered</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-3 bg-white/5 rounded-xl text-dark-muted hover:text-white">
                        <X size={20} />
                    </button>
                    {/* Desktop Collapse Button */}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-4 md:py-6">
                    {course.videos.map((video, index) => (
                        <div
                            key={video._id}
                            onClick={() => handleVideoSelect(video)}
                            className={`px-6 md:px-8 py-6 md:py-8 border-b border-white/5 cursor-pointer transition-all flex gap-5 relative group ${activeVideo?._id === video._id ? 'bg-brand-primary/5' : 'hover:bg-white/[0.03]'
                                } ${!hasAccess ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                        >
                            {activeVideo?._id === video._id && (
                                <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary shadow-[0_0_20px_rgba(255,161,22,0.6)]" />
                            )}
                            <div className="flex-shrink-0 pt-1">
                                {hasAccess ? (
                                    progressMap[video._id]?.completed ? (
                                        <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                            <Check size={18} className="text-green-500" strokeWidth={4} />
                                        </div>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${activeVideo?._id === video._id ? 'bg-brand-primary border-brand-primary' : 'bg-[#141414] border-white/10 group-hover:border-brand-primary/40'}`}>
                                            <PlayCircle size={18} className={activeVideo?._id === video._id ? 'text-dark-bg' : 'text-dark-muted group-hover:text-brand-primary'} />
                                        </div>
                                    )
                                ) : (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPaymentModal(true);
                                        }}
                                        className="w-8 h-8 rounded-xl bg-[#141414] flex items-center justify-center border border-white/10 opacity-60 hover:border-brand-primary/40 hover:opacity-100 transition-all cursor-pointer group/lock"
                                    >
                                        <Lock size={16} className="text-dark-muted group-hover/lock:text-brand-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 space-y-2">
                                <h4 className={`text-[11px] font-bold uppercase tracking-tight leading-relaxed transition-colors ${activeVideo?._id === video._id ? 'text-brand-primary' : 'text-white group-hover:text-brand-primary/80'}`}>
                                    <span className="opacity-30 mr-2">{String(index + 1).padStart(2, '0')}</span> {video.title}
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-dark-muted uppercase tracking-[0.2em] opacity-50">
                                        <Clock size={12} className="text-brand-primary" /> {video.duration || '12:00'}
                                    </div>
                                    {progressMap[video._id]?.completed && (
                                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md">Validated</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FIXED BOTTOM PURCHASE BAR FOR ROBUST VISIBILITY */}
            {!isEnrolled && !isAdmin && !isOwner && !loading && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#141414] border-t border-brand-primary/20 p-4 md:hidden animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-dark-muted">Get Access</span>
                            <span className="text-xl font-black text-white">${course?.price || '0'}</span>
                        </div>
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="bg-brand-primary text-dark-bg px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-brand-primary/20"
                        >
                            {course?.price > 0 ? 'Buy Now' : 'Enroll Free'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
