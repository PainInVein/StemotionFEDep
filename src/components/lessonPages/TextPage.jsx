import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextPage Component - Hiển thị nội dung văn bản
 * Dùng cho các trang giới thiệu lý thuyết, khái niệm
 */
export default function TextPage({ textContent, orderIndex }) {
  // Parse HTML content nếu có
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
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-slate-100"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          {/* Content area */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#1e293b'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
