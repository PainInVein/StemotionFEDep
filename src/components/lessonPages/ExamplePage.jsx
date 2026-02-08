import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ExamplePage Component - Hiển thị ví dụ minh họa với animation từng bước
 */
export default function ExamplePage({ textContent, orderIndex }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    // Auto-advance steps
    useEffect(() => {
        if (currentStep < 3) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Show answer after all steps
            const timer = setTimeout(() => setShowAnswer(true), 500);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const content = textContent || '';

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
                    className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-green-100"
                >
                    {/* Icon & Title */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <span className="text-6xl">💡</span>
                    </motion.div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Ví dụ minh họa
                        </h2>
                    </div>

                    {/* Example content with step animation */}
                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Animated steps indicator */}
                        <div className="mt-8 flex justify-center gap-2">
                            {[0, 1, 2, 3].map((step) => (
                                <motion.div
                                    key={step}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: currentStep >= step ? 1 : 0,
                                        backgroundColor: currentStep >= step ? '#4CAF50' : '#e2e8f0'
                                    }}
                                    transition={{ duration: 0.3, delay: step * 0.2 }}
                                    className="w-3 h-3 rounded-full"
                                />
                            ))}
                        </div>

                        {/* Final answer with celebration */}
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                                className="mt-6 text-center"
                            >
                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full text-lg font-bold">
                                    <span className="text-2xl">🎉</span>
                                    <span>Như vậy là hiểu rồi!</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
