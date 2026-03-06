import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SpeakButton from '../common/SpeakButton';
import owlMascot from '../../assets/owl_mascot.png';

/**
 * ImagePage – Candy-colored ocean theme with circular mascot
 */
export default function ImagePage({ mediaUrl, textContent, orderIndex }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const caption = textContent || '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[70vh] px-4"
        >
            <div className="max-w-4xl w-full">
                {/* Mascot in circle */}
                <div className="flex items-end gap-4 mb-2 relative" style={{ zIndex: 2 }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                        <motion.div
                            animate={{ y: [0, -7, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #67E8F9, #38BDF8, #6366F1)',
                                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4), 0 0 0 4px rgba(103, 232, 249, 0.25)',
                            }}>
                            <img src={owlMascot} alt="Cú mèo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }} className="relative mb-5">
                        <div className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #E0F2FE, #CFFAFE)',
                                color: '#0369a1',
                                border: '3px solid #38BDF8',
                                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
                            }}>
                            Quan sát thật kỹ nhé! 👀
                            <div className="absolute -left-3 bottom-3 w-0 h-0"
                                style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #38BDF8' }} />
                        </div>
                    </motion.div>
                </div>

                {/* Main card */}
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring' }}
                    className="rounded-[2.2rem] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #67E8F9, #38BDF8, #A78BFA, #F9A8D4)',
                        padding: '4px',
                        boxShadow: '0 10px 40px rgba(56, 189, 248, 0.2), 0 4px 15px rgba(167, 139, 250, 0.15)',
                    }}>
                    <div className="rounded-[2rem] p-6 sm:p-10 relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #FDF4FF 50%, #FFFEF5 100%)' }}>

                        <motion.span className="absolute top-4 right-5 text-xl opacity-55 select-none pointer-events-none"
                            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>🐬</motion.span>
                        <motion.span className="absolute bottom-4 left-5 text-lg opacity-40 select-none pointer-events-none"
                            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>🌊</motion.span>

                        <div className="mb-5">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                                }}>📸 HÌNH ẢNH</span>
                        </div>

                        {caption && (
                            <div className="flex items-center gap-3 mb-5">
                                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="rounded-full"
                                    style={{ boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.2)' }}>
                                    <SpeakButton text={caption} label="🔊 Nghe mô tả" rate={0.85} />
                                </motion.div>
                            </div>
                        )}

                        {/* Image with candy border */}
                        <div className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(90deg, #67E8F9, #A78BFA, #F9A8D4, #FDE68A, #67E8F9)',
                                backgroundSize: '300% 100%',
                                animation: 'rainbow-shimmer 5s ease infinite',
                                padding: '4px',
                                boxShadow: '0 6px 25px rgba(167, 139, 250, 0.2)',
                            }}>
                            <div className="rounded-xl overflow-hidden bg-white">
                                {mediaUrl ? (
                                    <motion.img src={mediaUrl} alt={caption}
                                        className="w-full h-auto object-contain max-h-[500px]"
                                        onLoad={() => setImageLoaded(true)}
                                        initial={{ opacity: 0, scale: 1.03 }}
                                        animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.03 }}
                                        transition={{ duration: 0.5 }} />
                                ) : (
                                    <div className="flex items-center justify-center h-64">
                                        <motion.div animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }} className="text-6xl">🖼️</motion.div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {caption && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }} className="mt-5 flex justify-center">
                                <div className="relative max-w-lg">
                                    <div className="flex justify-center mb-0" style={{ marginBottom: '-1px' }}>
                                        <div className="w-0 h-0"
                                            style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '12px solid white' }} />
                                    </div>
                                    <div className="bg-white rounded-2xl px-6 py-4 shadow-lg text-center"
                                        style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.07), inset 0 0 0 2px #F0F9FF' }}>
                                        <p className="text-lg text-slate-700 font-bold leading-relaxed">{caption}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
