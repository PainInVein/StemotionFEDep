import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * VideoPage Component - Hiển thị video YouTube
 * Track khi người dùng xem video để enable nút Continue
 */
export default function VideoPage({ mediaUrl, textContent, onWatched }) {
    const [hasWatched, setHasWatched] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeRef = useRef(null);

    // Extract YouTube video ID from URL
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(mediaUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : null;

    const handlePlayClick = () => {
        if (!hasWatched) {
            setHasWatched(true);
            onWatched?.();
        }
        setIsPlaying(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[70vh] px-4"
        >
            <div className="max-w-4xl w-full">
                <div
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-purple-100"
                >
                    {/* Icon & Title */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <span className="text-6xl">🎬</span>
                    </motion.div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Video bài học
                        </h2>
                        <p className="text-lg text-slate-600">
                            {textContent || 'Con hãy xem video nhé! 👀'}
                        </p>
                    </div>

                    {/* Video Player */}
                    <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
                        {embedUrl ? (
                            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    ref={iframeRef}
                                    src={embedUrl}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={handlePlayClick}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-white">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📹</div>
                                    <div className="text-lg">Video không khả dụng</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Watch indicator */}
                    {hasWatched && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                <span>✅</span>
                                <span>Đã xem video!</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
