import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import owlMascot from '../../assets/owl_mascot.png';

/**
 * VideoPage – Cinema candy theme with circular mascot
 */
export default function VideoPage({ mediaUrl, textContent, onWatched }) {
    const [hasWatched, setHasWatched] = useState(false);
    const iframeRef = useRef(null);

    const getYouTubeId = (url) => {
        if (!url) return null;
        const r = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const m = url.match(r);
        return m && m[2].length === 11 ? m[2] : null;
    };

    const videoId = getYouTubeId(mediaUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : null;

    const handlePlayClick = () => {
        if (!hasWatched) { setHasWatched(true); onWatched?.(); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-4xl w-full">
                {/* Mascot */}
                <div className="flex items-end gap-4 mb-2 relative" style={{ zIndex: 2 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                        <motion.div animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #F472B6, #E879F9, #C084FC)',
                                boxShadow: '0 8px 25px rgba(244, 114, 182, 0.4), 0 0 0 4px rgba(232, 121, 249, 0.25)',
                            }}>
                            <img src={owlMascot} alt="Cú mèo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }} className="relative mb-5">
                        <div className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #FCE7F3, #FDF2F8)',
                                color: '#9d174d',
                                border: '3px solid #F9A8D4',
                                boxShadow: '0 4px 12px rgba(249, 168, 212, 0.3)',
                            }}>
                            {hasWatched ? 'Giỏi lắm! Xem xong rồi! 🌟' : 'Xem video thật chăm chú nhé! 👀'}
                            <div className="absolute -left-3 bottom-3 w-0 h-0"
                                style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #F9A8D4' }} />
                        </div>
                    </motion.div>
                </div>

                {/* Main card */}
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring' }}
                    className="rounded-[2.2rem] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #F472B6, #E879F9, #818CF8)',
                        padding: '4px',
                        boxShadow: '0 10px 40px rgba(244, 114, 182, 0.2)',
                    }}>
                    <div className="rounded-[2rem] p-6 sm:p-10 relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #FFF5F9 0%, #FDF4FF 50%, #F0F9FF 100%)' }}>

                        <motion.span className="absolute top-4 right-5 text-xl opacity-50 select-none pointer-events-none"
                            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>🍿</motion.span>
                        <motion.span className="absolute bottom-4 left-5 text-xl opacity-40 select-none pointer-events-none"
                            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>🎞️</motion.span>

                        <div className="mb-5">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                                }}>🎬 VIDEO BÀI HỌC</span>
                        </div>

                        <p className="text-xl text-slate-700 font-bold leading-relaxed mb-6 text-center">
                            {textContent || 'Con hãy xem video nhé! 👀'}
                        </p>

                        <div className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(90deg, #F472B6, #A78BFA, #38BDF8, #F472B6)',
                                backgroundSize: '300% 100%',
                                animation: 'rainbow-shimmer 5s ease infinite',
                                padding: '4px',
                                boxShadow: '0 6px 25px rgba(167, 139, 250, 0.2)',
                            }}>
                            <div className="rounded-xl overflow-hidden bg-black shadow-2xl">
                                {embedUrl ? (
                                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                        <iframe ref={iframeRef} src={embedUrl}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen onLoad={handlePlayClick} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-80 text-white">
                                        <motion.div animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }} className="text-center">
                                            <div className="text-7xl mb-4">📹</div>
                                            <div className="text-lg font-bold">Video không khả dụng</div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasWatched && (
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }} className="mt-5 text-center">
                                <span className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-base font-extrabold text-white shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #34D399, #10B981)',
                                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                                    }}>
                                    <motion.span animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: 2 }}>⭐</motion.span>
                                    Đã xem video! Giỏi lắm!
                                    <motion.span animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}>🌟</motion.span>
                                </span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
