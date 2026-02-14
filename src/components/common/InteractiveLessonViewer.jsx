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

export default function InteractiveLessonViewer({ lessonId, lessonName, onComplete }) {
    const [contents, setContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completedPages, setCompletedPages] = useState(new Set());
    const [canContinue, setCanContinue] = useState(true);
    const [showGames, setShowGames] = useState(false);

    // ✅ Thoát viewer (giống logic bạn đưa)
    const handleExit = () => {
        // optional: reset nhẹ nếu bạn muốn khi quay lại sẽ bắt đầu lại
        // setShowGames(false);
        // setCurrentPage(0);
        // setCompletedPages(new Set());

        onComplete?.();
    };

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getLessonContentsByLessonIdService(lessonId);
                setContents(data || []);
                setCurrentPage(0);
                setShowGames(false);
                setCompletedPages(new Set());
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

        const currentContent = contents[currentPage];
        const type = currentContent?.contentType?.toLowerCase() || '';

        if (type === 'video' || type === 'practice') {
            const pageId = currentContent.lessonContentId;
            setCanContinue(completedPages.has(pageId));
        } else {
            setCanContinue(true);
        }
    }, [currentPage, contents, completedPages]);

    const totalPages = contents.length;
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    const goToNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
        else setShowGames(true);
    };

    const goToPrevious = () => {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    const handlePageComplete = () => {
        const currentContent = contents[currentPage];
        const pageId = currentContent?.lessonContentId;

        if (pageId) {
            setCompletedPages((prev) => new Set([...prev, pageId]));
            setCanContinue(true);
        }
    };

    const renderPage = () => {
        if (contents.length === 0) return null;

        const content = contents[currentPage];
        const type = content?.contentType?.toLowerCase() || '';
        const key = `${content?.lessonContentId}-${currentPage}`;

        const commonProps = {
            textContent: content?.textContent,
            mediaUrl: content?.mediaUrl,
            formulaLatex: content?.formulaLatex,
            orderIndex: content?.orderIndex,
        };

        switch (type) {
            case 'text':
                return <TextPage key={key} {...commonProps} />;
            case 'image':
                return <ImagePage key={key} {...commonProps} />;
            case 'formula':
                return <FormulaPage key={key} {...commonProps} />;
            case 'video':
                return <VideoPage key={key} {...commonProps} onWatched={handlePageComplete} />;
            case 'practice':
                return <PracticePage key={key} {...commonProps} onCorrect={handlePageComplete} />;
            default:
                return <ExamplePage key={key} {...commonProps} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-600">Đang tải bài học...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border-2 border-red-100">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Có lỗi xảy ra</h2>
                        <p className="text-slate-600">{error}</p>

                        {/* ✅ nút thoát luôn có */}
                        <button
                            onClick={handleExit}
                            className="mt-6 px-5 py-2 rounded-full font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                            ✕ Thoát
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Không có nội dung: vẫn có nút X ở header + GamesHub dùng onClose như bạn muốn
    if (contents.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border-2 border-amber-100 text-center relative"
                    >
                        {/* ✅ nút X */}
                        <button
                            type="button"
                            onClick={handleExit}
                            aria-label="Thoát"
                            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                            className="text-6xl mb-4"
                        >
                            🎮
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bài học chưa có nội dung</h2>
                        <p className="text-lg text-slate-600 mb-4">
                            Nhưng đừng lo! Hãy chơi mini game để rèn luyện kỹ năng nhé! 🚀
                        </p>
                    </motion.div>

                    <GamesHub
                        lessonId={lessonId}
                        onClose={() => {
                            // ✅ đúng như bạn yêu cầu
                            onComplete?.();
                        }}
                    />
                </div>
            </div>
        );
    }

    const progress = ((currentPage + 1) / totalPages) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Top Bar - Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* LEFT: X */}
                        <button
                            type="button"
                            onClick={handleExit}
                            aria-label="Thoát"
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0"
                            title="Thoát"
                        >
                            ✕
                        </button>

                        {/* CENTER: Progress bar */}
                        <div className="flex-1">
                            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* RIGHT: counter */}
                        <div className="text-sm font-semibold text-slate-600 shrink-0">
                            {currentPage + 1}/{totalPages}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {!showGames ? (
                    <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-green-100 relative">
                            {/* ✅ nút X ở màn hoàn thành */}
                            <button
                                type="button"
                                onClick={handleExit}
                                aria-label="Thoát"
                                className="absolute right-4 top-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                                className="text-8xl mb-4"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Chúc mừng!</h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Con đã hoàn thành bài học! Giờ hãy chơi mini game để ôn tập nhé! 🎮
                            </p>
                        </div>

                        <GamesHub
                            lessonId={lessonId}
                            onClose={() => {
                                setShowGames(false);
                                onComplete?.();
                            }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Navigation Buttons - Sticky Bottom */}
            <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <motion.button
                            onClick={goToPrevious}
                            disabled={isFirstPage}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all ${isFirstPage
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 cursor-pointer'
                                }`}
                            whileHover={!isFirstPage ? { scale: 1.05 } : {}}
                            whileTap={!isFirstPage ? { scale: 0.95 } : {}}
                        >
                            <span>←</span>
                            <span>Quay lại</span>
                        </motion.button>

                        <motion.button
                            onClick={goToNext}
                            disabled={!canContinue}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-all ${canContinue
                                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg cursor-pointer'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            whileHover={canContinue ? { scale: 1.05 } : {}}
                            whileTap={canContinue ? { scale: 0.95 } : {}}
                        >
                            <span>{isLastPage ? 'Hoàn thành' : 'Tiếp tục'}</span>
                            <span>→</span>
                        </motion.button>
                    </div>

                    {!canContinue && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-sm text-amber-600 mt-3"
                        >
                            ⚠️ Hãy hoàn thành hoạt động trên trang này trước khi tiếp tục
                        </motion.p>
                    )}
                </div>
            </div>
        </div>
    );
}
