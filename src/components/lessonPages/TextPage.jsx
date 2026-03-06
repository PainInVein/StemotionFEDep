import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from '../common/AudioPlayer';
import SpeakButton from '../common/SpeakButton';
import owlMascot from '../../assets/owl_mascot.png';

/**
 * TextPage – Duolingo-Kids-inspired reading page
 * Candy gradient + pastel, circular mascot, confetti, speech bubble
 */
export default function TextPage({ textContent, mediaUrl, orderIndex }) {
  const content = textContent || '';
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const confettiPieces = ['⭐', '🌟', '✨', '💛', '💜', '💙', '🧡', '💚'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-[70vh] px-4 relative"
    >
      {/* ── Confetti on page load ── */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(14)].map((_, i) => (
              <motion.span
                key={i}
                className="fixed text-xl sm:text-2xl pointer-events-none select-none z-50"
                initial={{
                  x: '50vw', y: '30vh', scale: 0, opacity: 1,
                }}
                animate={{
                  x: `${8 + Math.random() * 84}vw`,
                  y: `${5 + Math.random() * 70}vh`,
                  scale: [0, 1.4, 1],
                  rotate: Math.random() * 600 - 300,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.8 + Math.random() * 0.8,
                  ease: 'easeOut',
                  delay: Math.random() * 0.4,
                }}
              >
                {confettiPieces[i % confettiPieces.length]}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="max-w-3xl w-full">
        {/* ── Mascot row ── */}
        <div className="flex items-end justify-center gap-4 mb-2 relative" style={{ zIndex: 2 }}>
          {/* Mascot in colorful circle */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #C084FC, #818CF8, #60A5FA)',
                boxShadow: '0 8px 30px rgba(129, 140, 248, 0.45), 0 0 0 5px rgba(192, 132, 252, 0.25)',
              }}
            >
              <img
                src={owlMascot}
                alt="Cú mèo thầy giáo"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </motion.div>
            {/* Sparkle */}
            <motion.span
              className="absolute -top-1 -right-1 text-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7], rotate: [0, 180, 360] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >✨</motion.span>
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="relative mb-6"
          >
            <div
              className="relative px-5 py-3 rounded-2xl text-sm font-extrabold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FEF08A, #FDE68A)',
                color: '#92400e',
                border: '3px solid #FBBF24',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
              }}
            >
              Đọc thật kỹ nhé bạn ơi! ⭐
              <div
                className="absolute -left-3 bottom-3 w-0 h-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '12px solid #FBBF24',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Main card — candy gradient border ── */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="relative rounded-[2.2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FBBF24, #F472B6, #818CF8, #34D399)',
            padding: '4px',
            boxShadow: '0 10px 40px rgba(244, 114, 182, 0.25), 0 4px 15px rgba(129, 140, 248, 0.2)',
          }}
        >
          <div
            className="rounded-[2rem] p-7 sm:p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #FFFEF5 0%, #FFF0F6 40%, #EFF6FF 70%, #F0FDF4 100%)',
            }}
          >
            {/* Floating decorations */}
            <motion.span className="absolute top-4 right-6 text-2xl opacity-65 select-none pointer-events-none"
              animate={{ y: [0, -10, 0], rotate: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>⭐</motion.span>
            <motion.span className="absolute top-14 right-14 text-lg opacity-45 select-none pointer-events-none"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}>🌈</motion.span>
            <motion.span className="absolute bottom-5 left-5 text-xl opacity-50 select-none pointer-events-none"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>🎈</motion.span>
            <motion.span className="absolute bottom-12 right-8 text-lg opacity-40 select-none pointer-events-none"
              animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}>🦋</motion.span>
            <motion.span className="absolute top-6 left-6 text-xl opacity-40 select-none pointer-events-none"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}>☁️</motion.span>

            {/* Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <span
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold shadow-lg tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #818CF8, #6366F1)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4), 0 0 0 3px rgba(129, 140, 248, 0.2)',
                }}
              >
                📖 BÀI ĐỌC
              </span>
            </motion.div>

            {/* Audio from backend */}
            {mediaUrl && <AudioPlayer src={mediaUrl} />}

            {/* ── Listen button — large, glowing, candy ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-4 mb-5"
            >
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full"
                style={{
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.15), 0 6px 20px rgba(99, 102, 241, 0.25)',
                }}
              >
                <SpeakButton
                  text={content}
                  label="🔊 Bấm để nghe"
                  rate={0.85}
                />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: '#7C3AED' }}>
                Nhấn để nghe đọc nội dung 🎧
              </span>
            </motion.div>

            {/* Colorful candy divider */}
            <div className="relative h-2.5 mb-6 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #FBBF24, #F472B6, #818CF8, #34D399, #FBBF24)',
                backgroundSize: '200% 100%',
                animation: 'rainbow-shimmer 4s ease infinite',
                boxShadow: '0 2px 8px rgba(244, 114, 182, 0.2)',
              }}
            />

            {/* ── Text content — speech bubble card ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="relative"
            >
              {/* Triangle */}
              <div className="flex justify-start ml-10 mb-0" style={{ marginBottom: '-1px' }}>
                <div className="w-0 h-0"
                  style={{
                    borderLeft: '14px solid transparent',
                    borderRight: '14px solid transparent',
                    borderBottom: '14px solid white',
                  }} />
              </div>
              <div
                className="rounded-[1.5rem] p-7 sm:p-8"
                style={{
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.07), inset 0 0 0 2px #F3F4F6',
                }}
              >
                <div
                  className="prose prose-xl max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{
                    fontSize: '1.35rem',
                    lineHeight: '2.2',
                    color: '#1e293b',
                    fontWeight: 600,
                  }}
                />
              </div>
            </motion.div>

            {/* ── Encouragement footer — candy badge ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="mt-6 text-center"
            >
              <span
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-extrabold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #FEF08A, #FBBF24)',
                  color: '#92400e',
                  border: '2px solid #F59E0B',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.35)',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 20, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >⭐</motion.span>
                Bạn đang làm rất tốt!
                <motion.span
                  animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                >🌟</motion.span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
