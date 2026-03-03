import React from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from '../common/AudioPlayer';
import SpeakButton from '../common/SpeakButton';

/**
 * TextPage – hiển thị nội dung văn bản bài học
 * Luôn có nút "🔊 Nghe" để học sinh bấm nghe (dùng Web Speech API).
 * Nếu có mediaUrl thì hiện AudioPlayer thêm.
 */
export default function TextPage({ textContent, mediaUrl, orderIndex }) {
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
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-slate-100 relative"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}
        >
          {/* Audio from backend (if available) */}
          {mediaUrl && <AudioPlayer src={mediaUrl} />}

          {/* TTS Speak button – always visible */}
          <div className="flex items-center gap-3 mb-6">
            <SpeakButton
              text={content}
              label="Bấm để nghe"
              rate={0.85}
            />
            <span className="text-sm text-slate-400 font-medium">
              Nhấn để nghe đọc nội dung 🎧
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 mb-6" />

          {/* Text content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#1e293b',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
