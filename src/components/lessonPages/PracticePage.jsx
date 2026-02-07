import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PracticePage Component - Trang luyện tập tương tác
 * Yêu cầu học sinh trả lời đúng mới được tiếp tục
 */
export default function PracticePage({ textContent, onCorrect }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shake, setShake] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Parse practice data from textContent
    const [practiceData, setPracticeData] = useState(null);

    useEffect(() => {
        try {
            // Try to parse JSON from textContent
            const parsed = JSON.parse(textContent || '{}');
            setPracticeData(parsed);
        } catch {
            // Fallback to default practice
            setPracticeData({
                question: 'Hãy chọn đáp án đúng!',
                type: 'multiple-choice',
                options: ['Đáp án A', 'Đáp án B', 'Đáp án C'],
                correct: 0
            });
        }
    }, [textContent]);

    const handleAnswer = (index) => {
        setSelectedAnswer(index);

        const correctIndex = typeof practiceData.correct === 'number'
            ? practiceData.correct
            : practiceData.options.indexOf(practiceData.correct);

        if (index === correctIndex) {
            setIsCorrect(true);
            setShowConfetti(true);
            onCorrect?.();

            // Hide confetti after animation
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            setIsCorrect(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    if (!practiceData) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-slate-400">Đang tải...</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[70vh] px-4 relative"
        >
            {/* Confetti effect */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50"
                    >
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: '50vw',
                                    y: '50vh',
                                    scale: 0
                                }}
                                animate={{
                                    x: `${Math.random() * 100}vw`,
                                    y: `${Math.random() * 100}vh`,
                                    scale: 1,
                                    rotate: Math.random() * 360
                                }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'][Math.floor(Math.random() * 4)]
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-3xl w-full">
                <motion.div
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-yellow-100"
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    {/* Icon & Title */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <span className="text-6xl">✏️</span>
                    </motion.div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">
                            Luyện tập
                        </h2>
                        <p className="text-xl text-slate-700 font-medium leading-relaxed">
                            {practiceData.question}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        {practiceData.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const correctIndex = typeof practiceData.correct === 'number'
                                ? practiceData.correct
                                : practiceData.options.indexOf(practiceData.correct);
                            const isThisCorrect = index === correctIndex;

                            let buttonClass = 'bg-white border-2 border-slate-200 hover:border-slate-300';

                            if (isSelected) {
                                if (isCorrect) {
                                    buttonClass = 'bg-green-100 border-2 border-green-400';
                                } else {
                                    buttonClass = 'bg-red-100 border-2 border-red-400';
                                }
                            }

                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => !selectedAnswer && handleAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-6 rounded-2xl text-left transition-all ${buttonClass} ${selectedAnswer === null ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                                        }`}
                                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${isSelected
                                                ? isCorrect
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div className="text-lg font-medium text-slate-800">
                                            {option}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {selectedAnswer !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-6 text-center"
                            >
                                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${isCorrect
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                                    <span>{isCorrect ? 'Đúng rồi! Giỏi lắm!' : 'Chưa đúng, thử lại nhé!'}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
}
