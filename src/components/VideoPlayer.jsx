import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, PictureInPicture, RotateCcw, RotateCw } from 'lucide-react';
import { getAssetUrl } from '../utils/urlUtils';

const VideoPlayer = ({ src, poster, onProgress }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const containerRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const playPromiseRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentQuality, setCurrentQuality] = useState('Auto');
    const [availableQualities, setAvailableQualities] = useState([]);

    // Initialize HLS or Native Video (SAME AS BEFORE)
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        const assetSrc = getAssetUrl(src);
        const isHLS = assetSrc.includes('.m3u8');

        if (isHLS && Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsRef.current = hls;
            hls.loadSource(assetSrc);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const qualities = data.levels.map((level, index) => ({
                    index,
                    height: level.height,
                    label: `${level.height}p`
                }));
                setAvailableQualities([{ index: -1, label: 'Auto' }, ...qualities]);
            });
        } else {
            video.src = assetSrc;
            video.load();
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [src]);

    // Genuine Watch Tracking (SAME AS BEFORE)
    const [watchedDuration, setWatchedDuration] = useState(0);
    useEffect(() => {
        let watchTimer;
        if (isPlaying) {
            watchTimer = setInterval(() => setWatchedDuration(prev => prev + 1), 1000);
        }
        return () => clearInterval(watchTimer);
    }, [isPlaying]);

    // Report Progress (SAME AS BEFORE)
    useEffect(() => {
        if (isPlaying && onProgress) {
            const reportTimer = setInterval(() => {
                if (videoRef.current) {
                    const current = videoRef.current.currentTime;
                    const total = videoRef.current.duration;
                    const isGenuineComplete = (watchedDuration / total) >= 0.6;
                    onProgress(current, total, isGenuineComplete);
                }
            }, 5000);
            return () => clearInterval(reportTimer);
        }
    }, [isPlaying, onProgress, watchedDuration]);

    // Play/Pause (SAME AS BEFORE)
    const togglePlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
            if (onProgress) onProgress(video.currentTime, video.duration);
        } else {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true))
                    .catch(e => { setIsPlaying(false); console.log(e); });
            } else {
                setIsPlaying(true);
            }
        }
    };

    // Time & Duration (SAME AS BEFORE)
    const handleTimeUpdate = () => setCurrentTime(videoRef.current.currentTime);
    const handleLoadedMetadata = () => setDuration(videoRef.current.duration);

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            videoRef.current.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const changeQuality = (qualityIndex) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = qualityIndex;
            const quality = availableQualities.find(q => q.index === qualityIndex);
            setCurrentQuality(quality?.label || 'Auto');
            setShowSettings(false);
        }
    };

    const changeSpeed = (speed) => {
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const speeds = [0.5, 1, 1.5, 2];
    const controlsTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };

    const handleMouseLeave = () => {
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative bg-[#0a0a0a] group w-full h-full font-inter overflow-hidden border border-white/5 shadow-3xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseEnter}
            onClick={handleMouseEnter}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                poster={getAssetUrl(poster)}
            />

            {/* CONTROLS OVERLAY */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 md:pt-24 pb-safe-area-bottom px-3 md:px-8 transition-all duration-300 z-[60] ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
            >
                {/* PROGRESS BAR */}
                <div
                    className="w-full h-1 md:h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 md:mb-6 group/progress relative overflow-visible"
                    onClick={handleSeek}
                >
                    {/* Hover Effect */}
                    <div className="absolute inset-y-0 left-0 bg-brand-primary/50 opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ width: '100%' }} />

                    <div
                        className="h-full bg-brand-primary relative rounded-full flex items-center justify-end"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(255,161,22,0.8)] scale-0 group-hover/progress:scale-100 transition-transform absolute -right-1.5 md:-right-2" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-white pb-2 md:pb-6">
                    {/* LEFT CONTROLS */}
                    <div className="flex items-center gap-3 md:gap-6">
                        <button onClick={togglePlay} className="p-1 md:p-2 hover:bg-white/10 rounded-lg transition-all">
                            {isPlaying ? <Pause size={18} className="md:w-6 md:h-6" /> : <Play size={18} className="translate-x-0.5 md:w-6 md:h-6" />}
                        </button>

                        <div className="flex items-center gap-2 md:gap-4 group/vol">
                            <button onClick={toggleMute} className="p-1 text-white/70 hover:text-white transition-colors">
                                {isMuted ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
                            </button>
                            <div className="w-0 md:w-24 group-hover/vol:w-16 md:group-hover/vol:w-24 h-1 bg-white/10 rounded-full relative overflow-hidden transition-all duration-300">
                                <div
                                    className="absolute inset-0 bg-brand-primary"
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                        </div>

                        <div className="hidden xs:flex text-[10px] md:text-[11px] font-medium text-white/60 items-center">
                            <span className="text-white">{formatTime(currentTime)}</span>
                            <span className="mx-1.5">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* RIGHT CONTROLS */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-1.5 md:p-2 rounded-xl transition-all border ${showSettings ? 'bg-brand-primary text-dark-bg border-brand-primary' : 'bg-white/5 border-white/10 text-dark-muted hover:text-white'}`}
                            >
                                <Settings size={18} className={`md:w-5 md:h-5 ${showSettings ? 'rotate-90' : ''}`} />
                            </button>

                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-4 bg-[#141414] border border-white/10 rounded-xl shadow-2xl p-4 md:p-6 min-w-[200px] md:min-w-[240px] z-[100]">
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="space-y-2">
                                            <div className="text-[9px] md:text-[10px] text-white/40 font-semibold uppercase tracking-wider">Speed</div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {speeds.map(speed => (
                                                    <button
                                                        key={speed}
                                                        onClick={() => changeSpeed(speed)}
                                                        className={`py-1 rounded text-[9px] md:text-[10px] font-medium transition-all border ${playbackSpeed === speed ? 'bg-brand-primary text-dark-bg border-brand-primary' : 'bg-transparent border-white/5 text-white/60'}`}
                                                    >
                                                        {speed}x
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={toggleFullscreen} className="p-1.5 md:p-2 text-white/60 hover:text-white transition-all">
                            <Maximize size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE QUICK ACTIONS OVERLAY */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showControls ? '' : 'opacity-0'}`}>
                <div className="flex gap-8 md:gap-12 pointer-events-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); videoRef.current.currentTime -= 10; }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-primary hover:text-dark-bg transition-all hover:scale-110 active:scale-95"
                    >
                        <RotateCcw size={16} className="md:w-5 md:h-5" />
                    </button>
                    {/* Play Button only if not playing to avoid clutter, or maybe just invisible trigger area */}

                    <button
                        onClick={(e) => { e.stopPropagation(); videoRef.current.currentTime += 10; }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-primary hover:text-dark-bg transition-all hover:scale-110 active:scale-95"
                    >
                        <RotateCw size={16} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
