import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from '../common/AudioPlayer';
import owlMascot from '../../assets/owl_mascot.png';

/**
 * FormulaPage – Magic galaxy theme with circular mascot wizard
 */
export default function FormulaPage({ formulaLatex, textContent, mediaUrl, orderIndex }) {
    const [showSteps, setShowSteps] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowSteps(true), 400);
        return () => clearTimeout(t);
    }, []);

    const formula = formulaLatex || textContent || '';

    const sparkles = [
        { top: '10%', left: '8%', delay: 0 },
        { top: '15%', right: '10%', delay: 0.5 },
        { bottom: '20%', left: '5%', delay: 1 },
        { bottom: '15%', right: '8%', delay: 1.5 },
        { top: '50%', left: '3%', delay: 0.8 },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-3xl w-full">
                {/* Mascot wizard in circle */}
                <div className="flex items-end gap-4 mb-2 relative" style={{ zIndex: 2 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                        <motion.div animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #6366F1)',
                                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4), 0 0 0 4px rgba(167, 139, 250, 0.25)',
                            }}>
                            <img src={owlMascot} alt="Cú mèo phù thủy" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }} className="relative mb-5">
                        <div className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #EDE9FE, #E9D5FF)',
                                color: '#6b21a8',
                                border: '3px solid #C4B5FD',
                                boxShadow: '0 4px 12px rgba(196, 181, 253, 0.3)',
                            }}>
                            Ghi nhớ công thức phép thuật nhé! 🪄
                            <div className="absolute -left-3 bottom-3 w-0 h-0"
                                style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #C4B5FD' }} />
                        </div>
                    </motion.div>
                </div>

                {/* Main card */}
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring' }}
                    className="rounded-[2.2rem] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #A78BFA, #7C3AED, #4F46E5)',
                        padding: '4px',
                        boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)',
                    }}>
                    <div className="rounded-[2rem] p-8 sm:p-12 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}>

                        {sparkles.map((s, i) => (
                            <motion.div key={i} className="absolute select-none pointer-events-none text-lg"
                                style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right }}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}>✨</motion.div>
                        ))}

                        <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
                        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

                        <div className="mb-6">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #A78BFA, #818CF8)',
                                    color: 'white',
                                    boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
                                }}>🪄 CÔNG THỨC</span>
                        </div>

                        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8"
                            style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
                            ✨ Công thức phép thuật ✨
                        </motion.h2>

                        {mediaUrl && <AudioPlayer src={mediaUrl} />}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: showSteps ? 1 : 0, scale: showSteps ? 1 : 0.85 }}
                            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                            className="rounded-2xl p-8 sm:p-10 border-2 border-dashed"
                            style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                borderColor: 'rgba(148, 163, 184, 0.3)',
                                boxShadow: '0 0 35px rgba(99, 102, 241, 0.25)',
                            }}>
                            <div className="text-center font-mono whitespace-pre-wrap leading-relaxed"
                                style={{ fontSize: '1.4rem', color: '#e2e8f0', textShadow: '0 0 10px rgba(226, 232, 240, 0.3)' }}
                                dangerouslySetInnerHTML={{ __html: formula }} />
                        </motion.div>

                        {textContent && formulaLatex && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }} className="mt-6 text-center">
                                <div className="inline-block bg-white/10 backdrop-blur rounded-2xl px-6 py-4 border border-white/10">
                                    <p className="text-base text-indigo-200 leading-relaxed font-medium">{textContent}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
