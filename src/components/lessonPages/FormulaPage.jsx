import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from '../common/AudioPlayer';

/**
 * FormulaPage Component - Hiển thị công thức toán học
 * Với animation từng bước
 */
export default function FormulaPage({ formulaLatex, textContent, mediaUrl, orderIndex }) {
    const [showSteps, setShowSteps] = useState(false);

    useEffect(() => {
        // Delay để show animation
        const timer = setTimeout(() => setShowSteps(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const formula = formulaLatex || textContent || '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[70vh] px-4"
        >
            <div className="max-w-3xl w-full">
                <div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-blue-100"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <span className="text-6xl">📐</span>
                    </motion.div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Công thức
                        </h2>
                    </div>

                    {/* Audio Player if available */}
                    {mediaUrl && <AudioPlayer src={mediaUrl} />}

                    {/* Formula display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: showSteps ? 1 : 0, scale: showSteps ? 1 : 0.9 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-white rounded-2xl p-8 shadow-md"
                    >
                        <div
                            className="text-center text-xl font-mono whitespace-pre-wrap leading-relaxed"
                            style={{
                                fontSize: '1.25rem',
                                color: '#334155'
                            }}
                            dangerouslySetInnerHTML={{ __html: formula }}
                        />
                    </motion.div>

                    {/* Explanation */}
                    {textContent && formulaLatex && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="mt-6 text-center text-slate-700"
                        >
                            <p className="text-base leading-relaxed">
                                {textContent}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
