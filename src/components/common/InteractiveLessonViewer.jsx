import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonContentsByLessonIdService } from '../../services/education/education.service';
import GamesHub from '../../pages/Games/GamesHub';

import TextPage from '../lessonPages/TextPage';
import ImagePage from '../lessonPages/ImagePage';
import FormulaPage from '../lessonPages/FormulaPage';
import VideoPage from '../lessonPages/VideoPage';
import PracticePage from '../lessonPages/PracticePage';
import ExamplePage from '../lessonPages/ExamplePage';

import owlMascot from '../../assets/owl_mascot.png';
import owlCelebrating from '../../assets/owl_celebrating.png';

/* ════════════════════════════════════════════
   FLOATING DECORATIONS — soft, cute, playful
   ════════════════════════════════════════════ */
function FloatingDecorations() {
    const shapes = [
        { emoji: '⭐', size: 28, top: '5%', left: '4%', delay: 0, duration: 5 },
        { emoji: '☁️', size: 34, top: '10%', right: '6%', delay: 0.8, duration: 7 },
        { emoji: '🌈', size: 26, top: '30%', left: '3%', delay: 1.5, duration: 6 },
        { emoji: '🎈', size: 30, top: '45%', right: '4%', delay: 0.3, duration: 7.5 },
        { emoji: '🦋', size: 24, bottom: '25%', left: '5%', delay: 2, duration: 5.5 },
        { emoji: '🌸', size: 22, bottom: '15%', right: '6%', delay: 1, duration: 6.5 },
        { emoji: '💫', size: 20, top: '65%', left: '7%', delay: 2.5, duration: 8 },
        { emoji: '☁️', size: 32, top: '20%', left: '85%', delay: 0.5, duration: 7 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {shapes.map((s, i) => (
                <motion.div
                    key={i}
                    className="absolute select-none"
                    style={{
                        fontSize: s.size,
                        top: s.top, bottom: s.bottom,
                        left: s.left, right: s.right,
                        opacity: 0.45,
                    }}
                    animate={{
                        y: [0, -15, 0, 10, 0],
                        rotate: [0, 5, -5, 3, 0],
                    }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: 'easeInOut',
                    }}
                >
                    {s.emoji}
                </motion.div>
            ))}

            {/* Soft gradient blobs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FDE68A 0%, transparent 70%)' }} />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #86EFAC 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full opacity-12 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FBCFE8 0%, transparent 70%)' }} />
        </div>
    );
}

/* ════════════════════════════════════════════
   PROGRESS SPARKLE
   ════════════════════════════════════════════ */
function ProgressSparkle({ progress }) {
    return (
        <motion.div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            style={{ left: `${progress}%` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
        >
            <span className="drop-shadow-lg" style={{ fontSize: 16 }}>✨</span>
        </motion.div>
    );
}

/* ════════════════════════════════════════════════
   MAIN — InteractiveLessonViewer
   ════════════════════════════════════════════════ */
export default function InteractiveLessonViewer({ lessonId, lessonName, onComplete }) {
    const [contents, setContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completedPages, setCompletedPages] = useState(new Set());
    const [canContinue, setCanContinue] = useState(true);
    const [showGames, setShowGames] = useState(false);
    const [direction, setDirection] = useState(1);

    const handleExit = () => { onComplete?.(); };

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true); setError('');
                const data = await getLessonContentsByLessonIdService(lessonId);
                setContents(data || []);
                setCurrentPage(0); setShowGames(false); setCompletedPages(new Set());
            } catch (err) {
                setError(err?.message || 'Không thể tải nội dung bài học');
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) fetchContents();
    }, [lessonId]);

    useEffect(() => {
        if (contents.length === 0) return;
        const cur = contents[currentPage];
        const type = cur?.contentType?.toLowerCase() || '';
        if (type === 'video' || type === 'practice') {
            setCanContinue(completedPages.has(cur.lessonContentId));
        } else {
            setCanContinue(true);
        }
    }, [currentPage, contents, completedPages]);

    const totalPages = contents.length;
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    const goToNext = () => { setDirection(1); if (currentPage < totalPages - 1) setCurrentPage(p => p + 1); else setShowGames(true); };
    const goToPrevious = () => { setDirection(-1); if (currentPage > 0) setCurrentPage(p => p - 1); };

    const handlePageComplete = () => {
        const pageId = contents[currentPage]?.lessonContentId;
        if (pageId) { setCompletedPages(prev => new Set([...prev, pageId])); setCanContinue(true); }
    };

    const renderPage = () => {
        if (contents.length === 0) return null;
        const c = contents[currentPage];
        const type = c?.contentType?.toLowerCase() || '';
        const key = `${c?.lessonContentId}-${currentPage}`;
        const props = { textContent: c?.textContent, mediaUrl: c?.mediaUrl, formulaLatex: c?.formulaLatex, orderIndex: c?.orderIndex };
        switch (type) {
            case 'text': return <TextPage key={key} {...props} />;
            case 'image': return <ImagePage key={key} {...props} />;
            case 'formula': return <FormulaPage key={key} {...props} />;
            case 'video': return <VideoPage key={key} {...props} onWatched={handlePageComplete} />;
            case 'practice': return <PracticePage key={key} {...props} onCorrect={handlePageComplete} />;
            default: return <ExamplePage key={key} {...props} />;
        }
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
    };

    /* ── Soft pastel background ── */
    const bgStyle = { background: 'linear-gradient(135deg, #FEF9C3 0%, #FBCFE8 30%, #BFDBFE 60%, #BBF7D0 100%)' };

    /* ─── LOADING ─── */
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={bgStyle}>
                <FloatingDecorations />
                <div className="text-center relative z-10">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="mx-auto mb-4 w-32 h-32 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #C084FC, #818CF8, #60A5FA)',
                            boxShadow: '0 8px 30px rgba(129, 140, 248, 0.45), 0 0 0 5px rgba(192, 132, 252, 0.25)',
                        }}
                    >
                        <img src={owlMascot} alt="Loading" className="w-28 h-28 object-contain" />
                    </motion.div>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-2xl font-extrabold text-slate-700">
                        Đang tải bài học...
                    </motion.p>
                    <p className="text-slate-500 mt-2 text-base font-semibold">Chờ chút nhé bạn ơi! ✨</p>
                </div>
            </div>
        );
    }

    /* ─── ERROR ─── */
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4" style={bgStyle}>
                <FloatingDecorations />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full rounded-[2rem] p-10 shadow-2xl text-center relative overflow-hidden z-10"
                    style={{ background: 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)' }}>
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}
                        className="mx-auto mb-4 w-28 h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #F9A8D4, #F472B6)', boxShadow: '0 6px 20px rgba(244, 114, 182, 0.4)' }}>
                        <img src={owlMascot} alt="Error" className="w-24 h-24 object-contain" />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Ôi không!</h2>
                    <p className="text-slate-500 mb-6 text-lg">{error}</p>
                    <motion.button onClick={handleExit}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-full font-bold text-white shadow-lg text-lg"
                        style={{ background: 'linear-gradient(135deg, #F9A8D4, #F472B6)' }}>
                        ← Quay lại
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    /* ─── NO CONTENT → Games ─── */
    if (contents.length === 0) {
        return (
            <div className="min-h-screen px-4 py-8" style={bgStyle}>
                <FloatingDecorations />
                <div className="max-w-5xl mx-auto space-y-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] p-10 shadow-2xl text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #fff 0%, #ecfdf5 100%)' }}>
                        <button type="button" onClick={handleExit} aria-label="Thoát"
                            className="absolute right-5 top-5 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg hover:scale-110 transition-all"
                            style={{ background: 'rgba(0,0,0,0.06)', color: '#64748b' }}>✕</button>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                            className="mx-auto mb-4 w-28 h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' }}>
                            <img src={owlMascot} alt="Games" className="w-24 h-24 object-contain" />
                        </motion.div>
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Bài học chưa có nội dung</h2>
                        <p className="text-lg text-slate-500 mb-4">Nhưng đừng lo! Hãy chơi mini game để rèn luyện kỹ năng nhé! 🚀</p>
                    </motion.div>
                    <GamesHub lessonId={lessonId} onClose={() => { onComplete?.(); }} />
                </div>
            </div>
        );
    }

    const progress = ((currentPage + 1) / totalPages) * 100;

    const getPageTypeLabel = () => {
        const type = contents[currentPage]?.contentType?.toLowerCase() || '';
        const labels = {
            text: { emoji: '📖', label: 'Bài đọc' },
            image: { emoji: '🖼️', label: 'Hình ảnh' },
            formula: { emoji: '📐', label: 'Công thức' },
            video: { emoji: '🎬', label: 'Video' },
            practice: { emoji: '✏️', label: 'Luyện tập' },
            example: { emoji: '💡', label: 'Ví dụ' },
        };
        return labels[type] || labels.example;
    };
    const pageType = getPageTypeLabel();

    /* ════════════ MAIN RENDER ════════════ */
    return (
        <div className="min-h-screen relative" style={bgStyle}>
            <FloatingDecorations />

            {/* ═══ TOP BAR ═══ */}
            <div className="sticky top-0 z-50 backdrop-blur-xl border-b"
                style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
                }}>
                <div className="max-w-5xl mx-auto px-4 py-2.5">
                    <div className="flex items-center gap-3">
                        {/* Exit */}
                        <motion.button type="button" onClick={handleExit} aria-label="Thoát"
                            whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                                color: '#EF4444',
                                boxShadow: '0 2px 8px rgba(239,68,68,0.2)',
                            }}>✕</motion.button>

                        {/* Lesson name */}
                        <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-600 truncate max-w-[180px]">
                            <img src={owlMascot} alt="" className="w-6 h-6 object-contain" />
                            {lessonName}
                        </div>

                        {/* Progress bar — pastel rainbow shimmer */}
                        <div className="flex-1">
                            <div className="relative h-5 rounded-full overflow-visible"
                                style={{ background: 'rgba(0,0,0,0.05)' }}>
                                <motion.div
                                    className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    style={{
                                        background: 'linear-gradient(90deg, #86EFAC, #67E8F9, #A78BFA, #F9A8D4, #FDE68A)',
                                        backgroundSize: '200% 100%',
                                        animation: 'rainbow-shimmer 3s ease infinite',
                                        boxShadow: '0 2px 10px rgba(167, 139, 250, 0.3)',
                                    }}>
                                    <motion.div className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                                            backgroundSize: '200% 100%',
                                        }}
                                        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                                </motion.div>
                                <ProgressSparkle progress={Math.min(progress, 95)} />
                            </div>
                        </div>

                        {/* Page counter */}
                        <motion.div key={currentPage}
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold shadow-sm"
                            style={{
                                background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)',
                                color: '#6366F1',
                            }}>
                            <span>{pageType.emoji}</span>
                            <span>{currentPage + 1}/{totalPages}</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ═══ PAGE CONTENT ═══ */}
            <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
                {!showGames ? (
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div key={currentPage} custom={direction}
                            variants={slideVariants} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.35, ease: 'easeInOut' }}>
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6">
                        <div className="rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #fff 0%, #ECFDF5 100%)' }}>
                            <button type="button" onClick={handleExit} aria-label="Thoát"
                                className="absolute right-5 top-5 w-11 h-11 rounded-full flex items-center justify-center font-bold hover:scale-110 transition-all"
                                style={{ background: 'rgba(0,0,0,0.06)', color: '#64748b' }}>✕</button>

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', duration: 0.8 }}
                                className="mx-auto mb-4 w-32 h-32 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5), 0 0 0 5px rgba(251, 191, 36, 0.25)',
                                }}>
                                <img src={owlCelebrating} alt="Celebration" className="w-28 h-28 object-contain" />
                            </motion.div>

                            {/* Stars explosion */}
                            {[...Array(8)].map((_, i) => (
                                <motion.span key={i} className="absolute text-2xl"
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{ scale: [0, 1.2, 0], x: Math.cos(i * 0.785) * 120, y: Math.sin(i * 0.785) * 120 }}
                                    transition={{ duration: 1.5, delay: 0.3 + i * 0.1 }}
                                    style={{ left: '50%', top: '30%' }}>⭐</motion.span>
                            ))}

                            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-extrabold text-slate-800 mb-2">
                                Tuyệt vời! 🏆
                            </motion.h2>
                            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-lg text-slate-500 mb-6">
                                Con đã hoàn thành bài học! Giờ hãy chơi mini game để ôn tập nhé! 🎮
                            </motion.p>
                        </div>
                        <GamesHub lessonId={lessonId} onClose={() => { setShowGames(false); onComplete?.(); }} />
                    </motion.div>
                )}
            </div>

            {/* ═══ BOTTOM NAV ═══ */}
            {!showGames && (
                <div className="sticky bottom-0 z-50 backdrop-blur-xl border-t"
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        borderColor: 'rgba(0,0,0,0.06)',
                        boxShadow: '0 -2px 15px rgba(0,0,0,0.05)',
                    }}>
                    <div className="max-w-5xl mx-auto px-4 py-3.5">
                        <div className="flex items-center justify-between gap-4">
                            {/* Back */}
                            <motion.button onClick={goToPrevious} disabled={isFirstPage}
                                whileHover={!isFirstPage ? { scale: 1.05, x: -3 } : {}}
                                whileTap={!isFirstPage ? { scale: 0.95 } : {}}
                                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-extrabold text-base transition-all"
                                style={isFirstPage
                                    ? { background: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed' }
                                    : {
                                        background: 'white',
                                        color: '#475569',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                                        border: '2px solid #E2E8F0',
                                        cursor: 'pointer',
                                    }}>
                                <span className="text-lg">👈</span>
                                <span>Quay lại</span>
                            </motion.button>

                            {/* Center */}
                            <motion.div key={currentPage}
                                initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                className="hidden sm:flex items-center gap-2 text-sm font-extrabold px-4 py-2 rounded-full"
                                style={{ background: 'rgba(99,102,241,0.08)', color: '#6366F1' }}>
                                <span>{pageType.emoji}</span>
                                <span>{pageType.label}</span>
                            </motion.div>

                            {/* Next */}
                            <motion.button onClick={goToNext} disabled={!canContinue}
                                whileHover={canContinue ? { scale: 1.05, x: 3 } : {}}
                                whileTap={canContinue ? { scale: 0.95 } : {}}
                                className="flex items-center gap-2 px-9 py-3.5 rounded-full font-extrabold text-base transition-all"
                                style={canContinue
                                    ? {
                                        background: 'linear-gradient(135deg, #86EFAC, #67E8F9)',
                                        color: '#065F46',
                                        boxShadow: '0 4px 15px rgba(134, 239, 172, 0.4)',
                                        cursor: 'pointer',
                                    }
                                    : { background: '#E2E8F0', color: '#94A3B8', cursor: 'not-allowed' }}>
                                <span>{isLastPage ? 'Hoàn thành 🎉' : 'Tiếp tục'}</span>
                                <span className="text-lg">{isLastPage ? '🏆' : '👉'}</span>
                            </motion.button>
                        </div>

                        {!canContinue && (
                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                className="text-center text-sm mt-2.5 font-bold" style={{ color: '#F59E0B' }}>
                                ⚡ Hãy hoàn thành hoạt động trên trang này trước khi tiếp tục nhé!
                            </motion.p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
