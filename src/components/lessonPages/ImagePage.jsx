import React, { useState } from 'react';
import SpeakButton from '../common/SpeakButton';
import { motion } from 'framer-motion';

/**
 * ImagePage Component - Hiển thị hình ảnh minh họa
 * Với caption và animation khi load
 */
export default function ImagePage({ mediaUrl, textContent, orderIndex }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const caption = textContent || '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[70vh] px-4"
        >
            <div className="max-w-4xl w-full">
                <div
                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-slate-100"
                >
                    {/* TTS button */}
                    {caption && (
                        <div className="flex items-center gap-3 mb-5">
                            <SpeakButton text={caption} label="Nghe mô tả" rate={0.85} />
                        </div>
                    )}

                    {/* Image container */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-50">
                        {mediaUrl ? (
                            <motion.img
                                src={mediaUrl}
                                alt={caption}
                                className="w-full h-auto object-contain max-h-[500px]"
                                onLoad={() => setImageLoaded(true)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: imageLoaded ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400">
                                <div className="text-center">
                                    <div className="text-6xl mb-3">🖼️</div>
                                    <div>Không có hình ảnh</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Caption */}
                    {caption && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-lg text-slate-700 font-medium">
                                {caption}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
