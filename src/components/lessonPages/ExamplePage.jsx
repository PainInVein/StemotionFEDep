import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from '../common/AudioPlayer';
import SpeakButton from '../common/SpeakButton';
import owlMascot from '../../assets/owl_mascot.png';

/**
 * ExamplePage – Discovery candy theme with circular mascot
 */
export default function ExamplePage({ textContent, mediaUrl, orderIndex }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (currentStep < 3) {
            const t = setTimeout(() => setCurrentStep(p => p + 1), 1000);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => setShowAnswer(true), 500);
            return () => clearTimeout(t);
        }
    }, [currentStep]);

    const content = textContent || '';
    const stepGradients = [
        { bg: 'linear-gradient(135deg, #60A5FA, #3B82F6)', shadow: 'rgba(59, 130, 246, 0.4)' },
        { bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)', shadow: 'rgba(245, 158, 11, 0.4)' },
        { bg: 'linear-gradient(135deg, #F97316, #EA580C)', shadow: 'rgba(249, 115, 22, 0.4)' },
        { bg: 'linear-gradient(135deg, #34D399, #10B981)', shadow: 'rgba(16, 185, 129, 0.4)' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-3xl w-full">
                {/* Mascot in circle */}
                <div className="flex items-end gap-4 mb-2 relative" style={{ zIndex: 2 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                        <motion.div animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #FBBF24, #F97316, #EA580C)',
                                boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(251, 191, 36, 0.25)',
                            }}>
                            <img src={owlMascot} alt="Cú mèo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }} className="relative mb-5">
                        <div className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #FEF9C3, #FEF3C7)',
                                color: '#92400e',
                                border: '3px solid #FBBF24',
                                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                            }}>
                            {showAnswer ? 'Tuyệt vời! Hiểu rồi! 🎉' : 'Cùng xem ví dụ nhé! 🔍'}
                            <div className="absolute -left-3 bottom-3 w-0 h-0"
                                style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #FBBF24' }} />
                        </div>
                    </motion.div>
                </div>

                {/* Main card */}
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring' }}
                    className="rounded-[2.2rem] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #FBBF24, #F97316, #EF4444)',
                        padding: '4px',
                        boxShadow: '0 10px 40px rgba(249, 115, 22, 0.2)',
                    }}>
                    <div className="rounded-[2rem] p-8 sm:p-12 relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #FFFEF5 0%, #FFF7ED 50%, #FEF2F2 100%)' }}>

                        <motion.span className="absolute top-4 right-5 text-xl opacity-55 select-none pointer-events-none"
                            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>🔬</motion.span>
                        <motion.span className="absolute bottom-4 left-5 text-xl opacity-45 select-none pointer-events-none"
                            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>💡</motion.span>

                        <div className="mb-5">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #F97316, #EA580C)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)',
                                }}>🔍 VÍ DỤ MINH HỌA</span>
                        </div>

                        {mediaUrl && <AudioPlayer src={mediaUrl} />}

                        {content && (
                            <div className="flex items-center gap-3 mb-5">
                                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="rounded-full"
                                    style={{ boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.2)' }}>
                                    <SpeakButton text={content} label="🔊 Nghe ví dụ" rate={0.85} />
                                </motion.div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-lg"
                            style={{ boxShadow: '0 6px 25px rgba(0,0,0,0.06), inset 0 0 0 2px #FFF7ED' }}>
                            <div className="prose prose-xl max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                                style={{ fontSize: '1.2rem', lineHeight: '2', color: '#1e293b', fontWeight: 500 }} />

                            {/* Step progress */}
                            <div className="mt-8 flex justify-center gap-3">
                                {[0, 1, 2, 3].map((step) => (
                                    <motion.div key={step}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: currentStep >= step ? 1 : 0.5, opacity: currentStep >= step ? 1 : 0.3 }}
                                        transition={{ duration: 0.4, delay: step * 0.15, type: 'spring' }}
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-lg"
                                        style={{
                                            background: currentStep >= step ? stepGradients[step].bg : '#e2e8f0',
                                            boxShadow: currentStep >= step ? `0 4px 14px ${stepGradients[step].shadow}` : 'none',
                                        }}>
                                        {currentStep >= step ? '✓' : step + 1}
                                    </motion.div>
                                ))}
                            </div>

                            {showAnswer && (
                                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }} className="mt-6 text-center relative">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.span key={i} className="absolute text-lg pointer-events-none"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.2, 0], x: Math.cos(i * 1.047) * 60, y: Math.sin(i * 1.047) * 60 }}
                                            transition={{ duration: 1.2, delay: 0.2 + i * 0.1 }}
                                            style={{ left: '50%', top: '50%' }}>⭐</motion.span>
                                    ))}
                                    <span className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-extrabold text-white shadow-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #34D399, #10B981)',
                                            boxShadow: '0 6px 25px rgba(16, 185, 129, 0.45)',
                                        }}>
                                        <motion.span animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 2, repeat: Infinity }}>🎉</motion.span>
                                        Như vậy là hiểu rồi!
                                        <motion.span animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}>🏆</motion.span>
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
