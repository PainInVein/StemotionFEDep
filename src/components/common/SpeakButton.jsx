import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * SpeakButton – đọc to văn bản bằng giọng tiếng Việt.
 * Thứ tự ưu tiên:
 *   1. ResponsiveVoice (Vietnamese Female) – nếu CDN đã load
 *   2. Google Translate TTS qua Vite proxy  – /api/tts (bypass CORS)
 *   3. Web Speech API (lang=vi-VN)          – last resort
 */

// ─── Strip HTML → plain text ───────────────────────────────────
function stripHtml(raw) {
    try {
        const tmp = document.createElement('div');
        tmp.innerHTML = raw;
        return (tmp.textContent || tmp.innerText || '').trim();
    } catch {
        return raw;
    }
}

// ─── Google TTS qua Vite proxy (không bị CORS) ────────────────
async function fetchGoogleTTSBlob(text) {
    const chunk = text.slice(0, 200);
    // Gọi qua /api/tts – Vite proxy sẽ forward tới translate.google.com
    const params = new URLSearchParams({
        ie: 'UTF-8',
        q: chunk,
        tl: 'vi',
        client: 'tw-ob',
        ttsspeed: '0.8',
    });
    const res = await fetch(`/api/tts?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

export default function SpeakButton({
    text = '',
    label = 'Nghe',
    rate = 0.9,
    className = '',
    style = {},
}) {
    const [speaking, setSpeaking] = useState(false);
    const [rvReady, setRvReady] = useState(false);
    const audioRef = useRef(null);
    const blobUrlRef = useRef(null);
    const cancelRef = useRef(false);

    // Chờ ResponsiveVoice load
    useEffect(() => {
        if (window.responsiveVoice) { setRvReady(true); return; }
        const check = setInterval(() => {
            if (window.responsiveVoice) { setRvReady(true); clearInterval(check); }
        }, 300);
        return () => clearInterval(check);
    }, []);

    const revokeBlobUrl = () => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
    };

    const stopAll = () => {
        cancelRef.current = true;
        window.responsiveVoice?.cancel();
        window.speechSynthesis?.cancel();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        revokeBlobUrl();
        setSpeaking(false);
    };

    // ── Web Speech API – chỉ set lang, không ép buộc giọng cụ thể ─
    const speakViaWebSpeech = useCallback((plain) => {
        if (!('speechSynthesis' in window)) { setSpeaking(false); return; }
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(plain);
        utt.lang = 'vi-VN';
        utt.rate = rate;
        utt.onstart = () => { if (!cancelRef.current) setSpeaking(true); };
        utt.onend = () => { if (!cancelRef.current) setSpeaking(false); };
        utt.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utt);
    }, [rate]);

    // ── Google TTS qua proxy → play Blob ───────────────────────
    const speakViaGoogle = useCallback(async (plain) => {
        try {
            const blobUrl = await fetchGoogleTTSBlob(plain);
            if (cancelRef.current) { URL.revokeObjectURL(blobUrl); return; }
            blobUrlRef.current = blobUrl;
            const audio = new Audio(blobUrl);
            audioRef.current = audio;
            audio.onplay = () => { if (!cancelRef.current) setSpeaking(true); };
            audio.onended = () => { revokeBlobUrl(); if (!cancelRef.current) setSpeaking(false); };
            audio.onerror = () => { revokeBlobUrl(); speakViaWebSpeech(plain); };
            await audio.play();
        } catch {
            speakViaWebSpeech(plain);
        }
    }, [speakViaWebSpeech]);

    const handleClick = () => {
        if (speaking) { stopAll(); return; }
        const plain = stripHtml(text);
        if (!plain) return;
        cancelRef.current = false;

        // 1. ResponsiveVoice
        if (rvReady && window.responsiveVoice) {
            setSpeaking(true);
            window.responsiveVoice.speak(plain, 'Vietnamese Female', {
                rate,
                onend: () => { if (!cancelRef.current) setSpeaking(false); },
                onerror: () => { setSpeaking(false); speakViaGoogle(plain); },
            });
            return;
        }

        // 2. Google TTS proxy → 3. Web Speech
        setSpeaking(true);
        speakViaGoogle(plain);
    };

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            title={speaking ? 'Dừng' : 'Bấm để nghe'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 40,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                border: 'none',
                transition: 'background .2s, box-shadow .2s',
                background: speaking
                    ? 'linear-gradient(135deg,#EF4444,#DC2626)'
                    : 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
                color: '#fff',
                boxShadow: speaking
                    ? '0 6px 20px rgba(239,68,68,.45)'
                    : '0 6px 20px rgba(14,165,233,.45)',
                ...style,
            }}
        >
            <span style={{ fontSize: 20 }}>{speaking ? '⏹' : '🔊'}</span>
            <span>{speaking ? 'Dừng' : label}</span>

            {speaking && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[0, 1, 2].map(i => (
                        <span key={i} style={{
                            display: 'inline-block', width: 3, borderRadius: 2,
                            background: '#fff', height: [10, 16, 10][i],
                            animation: `rv-wave 0.7s ease-in-out ${i * 0.15}s infinite alternate`,
                        }} />
                    ))}
                </span>
            )}

            <style>{`
                @keyframes rv-wave {
                    from { transform: scaleY(0.35); opacity: 0.6; }
                    to   { transform: scaleY(1);    opacity: 1;   }
                }
            `}</style>
        </motion.button>
    );
}
