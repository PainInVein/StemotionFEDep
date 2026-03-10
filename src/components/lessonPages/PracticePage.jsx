import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import owlMascot from '../../assets/owl_mascot.png';
import owlCelebrating from '../../assets/owl_celebrating.png';

/**
 * PracticePage – Game show candy theme with circular mascot
 */
export default function PracticePage({ textContent, onCorrect }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shake, setShake] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [practiceData, setPracticeData] = useState(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(textContent || '{}');
            setPracticeData(parsed);
        } catch {
            setPracticeData({
                question: 'Hãy chọn đáp án đúng!',
                type: 'multiple-choice',
                options: ['Đáp án A', 'Đáp án B', 'Đáp án C'],
                correct: 0,
            });
        }
    }, [textContent]);

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        const ci = typeof practiceData.correct === 'number'
            ? practiceData.correct
            : practiceData.options.indexOf(practiceData.correct);
        if (index === ci) {
            setIsCorrect(true); setShowConfetti(true);
            onCorrect?.();
            setTimeout(() => setShowConfetti(false), 3500);
        } else {
            setIsCorrect(false); setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    const optionLetters = ['A', 'B', 'C', 'D'];
    const optionStyles = [
        { bg: 'linear-gradient(135deg, #60A5FA, #3B82F6)', shadow: 'rgba(59, 130, 246, 0.35)' },
        { bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)', shadow: 'rgba(245, 158, 11, 0.35)' },
        { bg: 'linear-gradient(135deg, #34D399, #10B981)', shadow: 'rgba(16, 185, 129, 0.35)' },
        { bg: 'linear-gradient(135deg, #F472B6, #EC4899)', shadow: 'rgba(236, 72, 153, 0.35)' },
    ];
    const confettiEmojis = ['🎉', '🎊', '⭐', '🌟', '💫', '🏆', '✨', '🎈'];

    if (!practiceData) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="text-6xl">🎮</motion.div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[70vh] px-4 relative">

            {/* Confetti */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        className="fixed inset-0 pointer-events-none z-50">
                        {[...Array(20)].map((_, i) => (
                            <motion.div key={i}
                                initial={{ x: '50vw', y: '40vh', scale: 0, opacity: 1 }}
                                animate={{
                                    x: `${10 + Math.random() * 80}vw`, y: `${Math.random() * 100}vh`,
                                    scale: [0, 1.5, 1], rotate: Math.random() * 720 - 360, opacity: [1, 1, 0],
                                }}
                                transition={{ duration: 2 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.3 }}
                                className="absolute text-2xl sm:text-3xl select-none">
                                {confettiEmojis[i % confettiEmojis.length]}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-3xl w-full">
                {/* Mascot in circle */}
                <div className="flex items-end gap-4 mb-2 relative" style={{ zIndex: 2 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                        <motion.div
                            animate={isCorrect ? { y: [0, -12, 0], scale: [1, 1.1, 1] } : { y: [0, -6, 0] }}
                            transition={{ duration: isCorrect ? 0.8 : 2.5, repeat: isCorrect ? 3 : Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{
                                background: isCorrect
                                    ? 'linear-gradient(135deg, #34D399, #10B981, #059669)'
                                    : 'linear-gradient(135deg, #34D399, #10B981)',
                                boxShadow: isCorrect
                                    ? '0 8px 30px rgba(16, 185, 129, 0.5), 0 0 0 5px rgba(52, 211, 153, 0.3)'
                                    : '0 8px 25px rgba(16, 185, 129, 0.4), 0 0 0 4px rgba(52, 211, 153, 0.25)',
                            }}>
                            <img src={isCorrect ? owlCelebrating : owlMascot} alt="Cú mèo"
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }} className="relative mb-5">
                        <div className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
                            style={{
                                background: isCorrect
                                    ? 'linear-gradient(135deg, #D1FAE5, #ECFDF5)'
                                    : isCorrect === false
                                        ? 'linear-gradient(135deg, #FEF9C3, #FFFBEB)'
                                        : 'linear-gradient(135deg, #D1FAE5, #ECFDF5)',
                                color: isCorrect ? '#065f46' : isCorrect === false ? '#92400e' : '#065f46',
                                border: `3px solid ${isCorrect ? '#34D399' : isCorrect === false ? '#FBBF24' : '#34D399'}`,
                                boxShadow: `0 4px 12px ${isCorrect ? 'rgba(52,211,153,0.3)' : isCorrect === false ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'}`,
                            }}>
                            {isCorrect ? 'Đúng rồi! Giỏi quá! 🎉🏆' : isCorrect === false ? 'Gần đúng rồi! Cố lên! 💪' : 'Chọn đáp án đúng nhé! 🎯'}
                            <div className="absolute -left-3 bottom-3 w-0 h-0"
                                style={{
                                    borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
                                    borderRight: `12px solid ${isCorrect ? '#34D399' : isCorrect === false ? '#FBBF24' : '#34D399'}`,
                                }} />
                        </div>
                    </motion.div>
                </div>

                {/* Main card */}
                <motion.div className="rounded-[2.2rem] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #34D399, #10B981, #059669)',
                        padding: '4px',
                        boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)',
                    }}
                    animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                    transition={{ duration: 0.6 }}>
                    <div className="rounded-[2rem] p-8 sm:p-12 relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #ECFDF5 0%, #F0FDF4 50%, #FFFEF5 100%)' }}>

                        <motion.span className="absolute top-4 right-5 text-xl opacity-55 select-none pointer-events-none"
                            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>🎯</motion.span>
                        <motion.span className="absolute bottom-4 left-5 text-xl opacity-45 select-none pointer-events-none"
                            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>🏆</motion.span>

                        <div className="mb-5">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #34D399, #10B981)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                }}>🎮 LUYỆN TẬP</span>
                        </div>

                        {/* Question */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }} className="mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg"
                                style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06), inset 0 0 0 2px #D1FAE5' }}>
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl mt-0.5">❓</span>
                                    <p className="text-xl sm:text-2xl text-slate-800 font-bold leading-relaxed">
                                        {practiceData.question}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Options */}
                        <div className="space-y-4">
                            {practiceData.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const ci = typeof practiceData.correct === 'number'
                                    ? practiceData.correct
                                    : practiceData.options.indexOf(practiceData.correct);
                                const os = optionStyles[index % 4];

                                let cardBg = 'white', cardBorder = '#E5E7EB';
                                if (isSelected) {
                                    cardBg = isCorrect ? '#ECFDF5' : '#FEF2F2';
                                    cardBorder = isCorrect ? '#34D399' : '#F87171';
                                }

                                return (
                                    <motion.button key={index}
                                        onClick={() => selectedAnswer === null && handleAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={selectedAnswer === null ? { scale: 1.03, y: -3 } : {}}
                                        whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                                        className="w-full p-5 rounded-2xl text-left transition-all"
                                        style={{
                                            background: cardBg,
                                            border: `3px solid ${cardBorder}`,
                                            cursor: selectedAnswer === null ? 'pointer' : 'default',
                                            boxShadow: '0 3px 12px rgba(0,0,0,0.05)',
                                        }}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shadow-lg"
                                                style={{
                                                    background: isSelected
                                                        ? isCorrect ? 'linear-gradient(135deg, #34D399, #10B981)' : 'linear-gradient(135deg, #F87171, #EF4444)'
                                                        : os.bg,
                                                    boxShadow: `0 4px 14px ${isSelected ? (isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)') : os.shadow}`,
                                                }}>
                                                {isSelected ? (isCorrect ? '✅' : '❌') : optionLetters[index]}
                                            </div>
                                            <div className="text-lg sm:text-xl font-bold text-slate-800">{option}</div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
