import React, { useRef } from "react";
import gsap from "gsap";

function cn(...xs) {
    return xs.filter(Boolean).join(" ");
}

/** Enhanced fish SVG with more details */
function FishSvg({ className, variant = "player", flip = false, number }) {
    const colors =
        variant === "good"
            ? { body1: "#34d399", body2: "#10b981", fin: "#059669", stroke: "#065f46", accent: "#d1fae5" }
            : variant === "bad"
                ? { body1: "#fb7185", body2: "#ef4444", fin: "#e11d48", stroke: "#881337", accent: "#ffe4e6" }
                : { body1: "#60a5fa", body2: "#3b82f6", fin: "#2563eb", stroke: "#1e3a8a", accent: "#dbeafe" };

    const gid = React.useMemo(() => `fish_${Math.random().toString(16).slice(2)}`, []);

    return (
        <svg
            viewBox="0 0 160 96"
            className={className}
            aria-hidden="true"
            style={{ transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
        >
            <defs>
                <linearGradient id={`${gid}_g`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={colors.body1} />
                    <stop offset="0.6" stopColor={colors.body2} />
                    <stop offset="1" stopColor={colors.body1} />
                </linearGradient>
                <radialGradient id={`${gid}_shine`}>
                    <stop offset="0" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
            </defs>

            {/* Tail */}
            <path
                d="M26 48c-14 10-18 22-18 22s20 0 30-10c4 8 2 18 2 18s18-10 18-30-18-30-18-30 2 10-2 18C38 26 20 26 20 26s4 12 18 22z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="3"
                strokeLinejoin="round"
            />

            {/* Body */}
            <ellipse
                cx="100"
                cy="48"
                rx="45"
                ry="28"
                fill={`url(#${gid}_g)`}
                stroke={colors.stroke}
                strokeWidth="3"
            />

            {/* Shine effect */}
            <ellipse
                cx="105"
                cy="38"
                rx="20"
                ry="12"
                fill={`url(#${gid}_shine)`}
                opacity="0.7"
            />

            {/* Top fin */}
            <path
                d="M95 22c8-8 18-10 28-6-6 6-8 14-8 14-7-3-14-5-20-8z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />

            {/* Bottom fin */}
            <path
                d="M88 74c9 2 16 5 23 10-14 5-25 2-30-8 2 0 4-1 7-2z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />

            {/* Scales pattern */}
            <g opacity="0.2" fill={colors.stroke}>
                <circle cx="85" cy="45" r="4" />
                <circle cx="95" cy="50" r="4" />
                <circle cx="105" cy="52" r="4" />
                <circle cx="85" cy="55" r="4" />
            </g>

            {/* Mouth - smile */}
            <path
                d="M140 50c6-1 10 1 12 5-6 2-12 2-18 0"
                fill="none"
                stroke={colors.stroke}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Eye */}
            <circle cx="120" cy="40" r="11" fill="white" />
            <circle cx="123" cy="41" r="6" fill="#111827" />
            <circle cx="125" cy="38" r="3" fill="white" />

            {/* Number badge */}
            {number && (
                <g>
                    <ellipse cx="100" cy="72" rx="16" ry="8" fill="white" opacity="0.95" stroke={colors.stroke} strokeWidth="2" />
                    <text x="100" y="76" fontSize="12" fontWeight="bold" fill={colors.stroke} textAnchor="middle">
                        {number}
                    </text>
                </g>
            )}
        </svg>
    );
}

/** Bubble animation component */
function BubbleBackground() {
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        size: 10 + Math.random() * 30,
    }));

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {bubbles.map((b) => (
                <div
                    key={b.id}
                    className="absolute bottom-0 animate-bubble rounded-full bg-white/30 blur-sm"
                    style={{
                        left: b.left,
                        width: b.size,
                        height: b.size,
                        animationDelay: `${b.delay}s`,
                        animationDuration: `${b.duration}s`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes bubble {
                    0% { transform: translateY(0) scale(0); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
                }
                .animate-bubble {
                    animation: bubble linear infinite;
                }
            `}</style>
        </div>
    );
}

/** Particle burst effect */
function createParticleBurst(container, x, y, color = "#10b981") {
    const count = 12;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full pointer-events-none";
        particle.style.width = "8px";
        particle.style.height = "8px";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        container.appendChild(particle);

        const angle = (Math.PI * 2 * i) / count;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        gsap.to(particle, {
            x: tx,
            y: ty,
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => particle.remove(),
        });
    }
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function aabb(a, b) {
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

export default function BigFishEatSmallGame({
    game,
    config,
    onExit,
    onFinish,
    submitting,
    submitMsg,
}) {
    // -------- Config --------
    const tickRef = useRef(null);
    const playerNumberBase = Number(config?.playerFishNumber ?? 0);
    const enemiesSource = Array.isArray(config?.enemyFish) ? config.enemyFish : [];
    const totalQuestions = enemiesSource.length;

    const rangeArr = Array.isArray(config?.numberRange) ? config.numberRange : [1, 50];
    const rangeMin = Number(rangeArr?.[0] ?? 1);
    const rangeMax = Number(rangeArr?.[1] ?? 50);

    const powerUpsEnabled = !!config?.powerUps;
    const speedMode = String(config?.gameSpeed || "normal").toLowerCase();

    const spawnEveryMs = speedMode === "fast" ? 650 : speedMode === "slow" ? 1100 : 850;
    const maxOnScreen = speedMode === "fast" ? 5 : speedMode === "slow" ? 3 : 4;

    // -------- State --------
    const [lives, setLives] = React.useState(Number(config?.lives ?? 3));
    const [correct, setCorrect] = React.useState(0);
    const [shield, setShield] = React.useState(0);
    const [done, setDone] = React.useState(false);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [playerNumber, setPlayerNumber] = React.useState(playerNumberBase);
    const playerNumberRef = React.useRef(playerNumberBase);
    const [actors, setActors] = React.useState([]);

    // -------- Refs --------
    const arenaRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const actorElsRef = React.useRef(new Map());
    const actorStateRef = React.useRef(new Map());
    const playerStateRef = React.useRef({
        x: 60,
        y: 80,
        w: 100,
        h: 60,
        baseScale: 1,
        growth: 0,
    });
    const pointerRef = React.useRef({ dragging: false, pointerId: null });
    const spawnedIndexRef = React.useRef(0);
    const startAtRef = React.useRef(Date.now());

    const scaleFromNumber = React.useCallback(
        (num) => {
            const t = rangeMax === rangeMin ? 0.5 : (Number(num) - rangeMin) / (rangeMax - rangeMin);
            return lerp(0.8, 1.6, clamp(t, 0, 1));
        },
        [rangeMin, rangeMax]
    );

    // Fullscreen toggle
    const toggleFullscreen = () => {
        const elem = containerRef.current;
        if (!document.fullscreenElement) {
            elem?.requestFullscreen?.();
            setFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setFullscreen(false);
        }
    };

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // ---- Setup ----
    React.useEffect(() => {
        setPlayerNumber(playerNumberBase);
        playerNumberRef.current = playerNumberBase;
    }, [playerNumberBase, game?.gameId]);

    React.useEffect(() => {
        const arena = arenaRef.current;
        const playerEl = playerRef.current;
        if (!arena || !playerEl) return;

        const init = () => {
            const r = arena.getBoundingClientRect();
            const baseScale = scaleFromNumber(playerNumberBase);
            playerStateRef.current.baseScale = baseScale;
            const baseW = 100;
            const baseH = 60;
            playerStateRef.current.w = baseW * baseScale;
            playerStateRef.current.h = baseH * baseScale;
            const x = r.width * 0.2;
            const y = r.height * 0.5;
            playerStateRef.current.x = clamp(x, 0, r.width - playerStateRef.current.w);
            playerStateRef.current.y = clamp(y, 0, r.height - playerStateRef.current.h);
            gsap.set(playerEl, {
                x: playerStateRef.current.x,
                y: playerStateRef.current.y,
                scale: baseScale,
            });
        };

        init();
        const ro = new ResizeObserver(() => init());
        ro.observe(arena);
        return () => ro.disconnect();
    }, [playerNumberBase, scaleFromNumber]);

    // ---- Drag controls ----
    React.useEffect(() => {
        const arena = arenaRef.current;
        const playerEl = playerRef.current;
        if (!arena || !playerEl) return;

        const xTo = gsap.quickTo(playerEl, "x", { duration: 0.15, ease: "power2.out" });
        const yTo = gsap.quickTo(playerEl, "y", { duration: 0.15, ease: "power2.out" });

        const setFromClient = (clientX, clientY) => {
            if (done) return;
            const r = arena.getBoundingClientRect();
            const p = playerStateRef.current;
            const x = clientX - r.left - p.w / 2;
            const y = clientY - r.top - p.h / 2;
            p.x = clamp(x, 0, r.width - p.w);
            p.y = clamp(y, 0, r.height - p.h);
            xTo(p.x);
            yTo(p.y);
        };

        const onPointerDown = (e) => {
            if (done) return;
            pointerRef.current.dragging = true;
            pointerRef.current.pointerId = e.pointerId;
            arena.setPointerCapture?.(e.pointerId);
            setFromClient(e.clientX, e.clientY);
            gsap.to(playerEl, { scale: playerStateRef.current.baseScale * 1.08, duration: 0.12 });
        };

        const onPointerMove = (e) => {
            if (!pointerRef.current.dragging || pointerRef.current.pointerId !== e.pointerId) return;
            setFromClient(e.clientX, e.clientY);
        };

        const onPointerUp = (e) => {
            if (pointerRef.current.pointerId !== e.pointerId) return;
            pointerRef.current.dragging = false;
            pointerRef.current.pointerId = null;
            gsap.to(playerEl, { scale: playerStateRef.current.baseScale, duration: 0.14 });
        };

        arena.addEventListener("pointerdown", onPointerDown);
        arena.addEventListener("pointermove", onPointerMove);
        arena.addEventListener("pointerup", onPointerUp);
        arena.addEventListener("pointercancel", onPointerUp);
        return () => {
            arena.removeEventListener("pointerdown", onPointerDown);
            arena.removeEventListener("pointermove", onPointerMove);
            arena.removeEventListener("pointerup", onPointerUp);
            arena.removeEventListener("pointercancel", onPointerUp);
        };
    }, [done]);

    const registerActorEl = React.useCallback((id, el) => {
        if (!el) {
            actorElsRef.current.delete(id);
            return;
        }
        actorElsRef.current.set(id, el);
    }, []);

    const killActor = React.useCallback((id, withPop = true) => {
        const el = actorElsRef.current.get(id);
        const st = actorStateRef.current.get(id);
        if (!el || !st) {
            actorElsRef.current.delete(id);
            actorStateRef.current.delete(id);
            setActors((xs) => xs.filter((a) => a.id !== id));
            return;
        }

        st.alive = false;

        if (withPop) {
            gsap.to(el, {
                scale: 0,
                opacity: 0,
                rotation: 180,
                duration: 0.25,
                ease: "back.in(2)",
                onComplete: () => {
                    actorElsRef.current.delete(id);
                    actorStateRef.current.delete(id);
                    setActors((xs) => xs.filter((a) => a.id !== id));
                },
            });
        } else {
            actorElsRef.current.delete(id);
            actorStateRef.current.delete(id);
            setActors((xs) => xs.filter((a) => a.id !== id));
        }
    }, []);

    // ---- Spawn ----
    React.useEffect(() => {
        if (done || !arenaRef.current || totalQuestions === 0) return;

        const spawnEnemy = () => {
            const arena = arenaRef.current;
            if (!arena || spawnedIndexRef.current >= enemiesSource.length) return;

            const aliveCount = [...actorStateRef.current.values()].filter((a) => a.alive && a.type === "enemy").length;
            if (aliveCount >= maxOnScreen) return;

            const r = arena.getBoundingClientRect();
            const enemy = enemiesSource[spawnedIndexRef.current++];
            const num = Number(enemy?.number ?? 0);
            const spd = Number(enemy?.speed ?? 2);
            const scale = scaleFromNumber(num);
            const baseW = 90;
            const baseH = 55;
            const w = baseW * scale;
            const h = baseH * scale;
            const x = r.width + w + 12;
            const y = clamp(20 + Math.random() * (r.height - h - 40), 10, r.height - h - 10);
            const vx = -(200 + spd * 100) * (speedMode === "fast" ? 1.3 : speedMode === "slow" ? 0.85 : 1);
            const id = `e_${Date.now()}_${Math.random().toString(16).slice(2)}`;

            actorStateRef.current.set(id, {
                id,
                type: "enemy",
                number: num,
                x,
                y,
                w,
                h,
                vx,
                vy: 0,
                scale,
                alive: true,
            });

            setActors((xs) => [...xs, { id, type: "enemy", number: num }]);

            if (powerUpsEnabled && Math.random() < 0.2) {
                const pid = `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                const pw = 50;
                const ph = 50;
                const px = r.width + pw + 12;
                const py = clamp(20 + Math.random() * (r.height - ph - 40), 10, r.height - ph - 10);

                actorStateRef.current.set(pid, {
                    id: pid,
                    type: "power",
                    kind: "shield",
                    number: 0,
                    x: px,
                    y: py,
                    w: pw,
                    h: ph,
                    vx: -220,
                    vy: 0,
                    scale: 1,
                    alive: true,
                });
                setActors((xs) => [...xs, { id: pid, type: "power", kind: "shield" }]);
            }
        };

        const timer = setInterval(spawnEnemy, spawnEveryMs);
        return () => clearInterval(timer);
    }, [done, totalQuestions, enemiesSource, maxOnScreen, spawnEveryMs, powerUpsEnabled, scaleFromNumber, speedMode]);

    // ---- Game loop ----
    React.useEffect(() => {
        if (done) return;

        const tick = () => {
            const arena = arenaRef.current;
            if (!arena) return;

            const p = playerStateRef.current;
            const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };
            const dt = gsap.ticker.deltaRatio() / 60;
            const removeIds = [];

            actorStateRef.current.forEach((a) => {
                if (!a.alive) return;

                a.x += a.vx * dt;
                a.y += a.vy * dt;

                const el = actorElsRef.current.get(a.id);
                if (el) gsap.set(el, { x: a.x, y: a.y, scale: a.scale });

                if (a.x < -a.w - 50) {
                    removeIds.push(a.id);
                    return;
                }

                if (aabb(pBox, a)) {
                    if (a.type === "power") {
                        setShield((s) => s + 1);
                        if (arenaRef.current) {
                            createParticleBurst(arenaRef.current, a.x + a.w / 2, a.y + a.h / 2, "#10b981");
                        }
                        killActor(a.id, true);
                        return;
                    }

                    const currentPlayerNumber = playerNumberRef.current;
                    const canEat = Number(a.number) < currentPlayerNumber;

                    if (canEat) {
                        setCorrect((c) => c + 1);
                        const eaten = Number(a.number) || 0;
                        const nextNum = playerNumberRef.current + eaten;
                        playerNumberRef.current = nextNum;
                        setPlayerNumber(nextNum);

                        const newBaseScale = scaleFromNumber(nextNum);
                        playerStateRef.current.baseScale = newBaseScale;
                        p.growth = clamp(p.growth + 0.01, 0, 0.15);
                        const finalScale = newBaseScale * (1 + p.growth);
                        p.w = 100 * finalScale;
                        p.h = 60 * finalScale;

                        if (playerRef.current) {
                            gsap.to(playerRef.current, { scale: finalScale, duration: 0.2, ease: "back.out(1.4)" });
                        }

                        if (arenaRef.current) {
                            createParticleBurst(arenaRef.current, a.x + a.w / 2, a.y + a.h / 2, "#3b82f6");
                        }

                        killActor(a.id, true);
                    } else {
                        if (shield > 0) {
                            setShield((s) => Math.max(0, s - 1));
                            if (arenaRef.current) {
                                gsap.fromTo(arenaRef.current, { x: 0 }, {
                                    x: 10,
                                    yoyo: true,
                                    repeat: 5,
                                    duration: 0.05,
                                    ease: "power1.inOut",
                                    onComplete: () => gsap.set(arenaRef.current, { x: 0 })
                                });
                            }
                            killActor(a.id, true);
                        } else {
                            setLives((lv) => Math.max(0, lv - 1));
                            if (arenaRef.current) {
                                gsap.fromTo(arenaRef.current, { x: 0 }, {
                                    x: 14,
                                    yoyo: true,
                                    repeat: 8,
                                    duration: 0.04,
                                    ease: "power1.inOut",
                                    onComplete: () => gsap.set(arenaRef.current, { x: 0 })
                                });
                            }
                            if (playerRef.current) {
                                gsap.fromTo(playerRef.current, { opacity: 1 }, {
                                    opacity: 0.3,
                                    duration: 0.1,
                                    yoyo: true,
                                    repeat: 5
                                });
                            }
                            killActor(a.id, true);
                        }
                    }
                }
            });

            if (removeIds.length) {
                removeIds.forEach((id) => killActor(id, false));
            }
        };

        tickRef.current = tick;
        gsap.ticker.add(tick);

        return () => {
            if (tickRef.current) {
                gsap.ticker.remove(tickRef.current);
                tickRef.current = null;
            }
        };
    }, [done, killActor, shield, scaleFromNumber]);

    // ---- Finish ----
    React.useEffect(() => {
        if (done) return;

        const allSpawned = spawnedIndexRef.current >= enemiesSource.length;
        const aliveEnemies = [...actorStateRef.current.values()].some((a) => a.alive && a.type === "enemy");

        if (lives <= 0 || (allSpawned && !aliveEnemies)) {
            setDone(true);
            const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
            onFinish?.({
                correctAnswers: correct,
                totalQuestions,
                playDurations,
            });
        }
    }, [lives, correct, done, enemiesSource.length, onFinish, totalQuestions]);

    const maxLives = Number(config?.lives ?? 3);

    return (
        <div ref={containerRef} className={cn("relative", fullscreen ? "fixed inset-0 z-50 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700" : "rounded-2xl border border-slate-200/70 bg-white shadow-lg p-4 sm:p-6")}>
            {/* Header */}
            {!fullscreen && (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            🐟 {game?.name || "Cá Lớn Nuốt Cá Bé"}
                        </div>
                        <div className="mt-1 text-lg font-extrabold text-slate-900">
                            Biển Xanh Thần Tiên 🌊
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 shadow-md"
                        >
                            <i className="fa-solid fa-expand mr-2" />
                            Toàn màn hình
                        </button>
                        <button
                            onClick={onExit}
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <i className="fa-solid fa-arrow-left mr-2" />
                            Thoát
                        </button>
                    </div>
                </div>
            )}

            {/* Arena */}
            <div
                ref={arenaRef}
                className={cn(
                    "relative overflow-hidden rounded-3xl border-4 border-blue-300",
                    "bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600",
                    fullscreen ? "h-screen" : "h-[500px]"
                )}
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)
                    `
                }}
            >
                {/* Animated bubbles */}
                <BubbleBackground />

                {/* Underwater light rays */}
                <div className="pointer-events-none absolute inset-0 opacity-20">
                    <div className="absolute left-[10%] top-0 h-full w-20 bg-gradient-to-b from-white/40 to-transparent blur-sm rotate-12" />
                    <div className="absolute left-[40%] top-0 h-full w-16 bg-gradient-to-b from-white/30 to-transparent blur-sm -rotate-6" />
                    <div className="absolute right-[20%] top-0 h-full w-24 bg-gradient-to-b from-white/35 to-transparent blur-sm rotate-6" />
                </div>

                {/* Player */}
                <div ref={playerRef} className="absolute left-0 top-0 transition-opacity cursor-move">
                    <FishSvg className="h-16 w-[130px]" variant="player" number={playerNumber} />
                </div>

                {/* Actors */}
                {actors.map((a) => {
                    if (a.type === "enemy") {
                        const variant = a.number < playerNumber ? "good" : "bad";
                        return (
                            <div
                                key={a.id}
                                ref={(el) => registerActorEl(a.id, el)}
                                className="absolute left-0 top-0 will-change-transform"
                            >
                                <FishSvg className="h-14 w-[120px]" variant={variant} flip={true} number={a.number} />
                            </div>
                        );
                    }

                    return (
                        <div
                            key={a.id}
                            ref={(el) => registerActorEl(a.id, el)}
                            className="absolute left-0 top-0 will-change-transform animate-pulse"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-emerald-300 bg-gradient-to-br from-emerald-200 to-emerald-400 shadow-lg">
                                <span className="text-2xl">🛡️</span>
                            </div>
                        </div>
                    );
                })}

                {/* HUD Overlay */}
                <div className="pointer-events-none absolute top-4 left-4 right-4 z-20 flex flex-wrap justify-between gap-3">
                    {/* Left: Lives & Score */}
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 rounded-2xl border-3 border-rose-300 bg-gradient-to-r from-rose-100 to-pink-100 backdrop-blur-sm px-4 py-2.5 shadow-lg">
                            {Array.from({ length: maxLives }).map((_, i) => (
                                <i key={i} className={`fa-solid fa-heart text-xl ${i < lives ? "text-rose-500 animate-pulse" : "text-rose-200"}`} />
                            ))}
                            <span className="text-sm font-extrabold text-rose-700">{lives} HP</span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl border-3 border-emerald-300 bg-gradient-to-r from-emerald-100 to-green-100 backdrop-blur-sm px-4 py-2.5 shadow-lg">
                            <i className="fa-solid fa-star text-amber-500 text-xl" />
                            <span className="text-sm font-extrabold text-emerald-700">{correct}/{totalQuestions}</span>
                        </div>
                    </div>

                    {/* Right: Shield */}
                    {shield > 0 && (
                        <div className="inline-flex items-center gap-2 rounded-2xl border-3 border-purple-300 bg-gradient-to-r from-purple-100 to-violet-100 backdrop-blur-sm px-4 py-2.5 shadow-lg animate-bounce">
                            <i className="fa-solid fa-shield text-purple-600 text-xl" />
                            <span className="text-sm font-extrabold text-purple-700">x{shield}</span>
                        </div>
                    )}
                </div>

                {/* Bottom hint */}
                {!done && (
                    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 shadow-xl border-2 border-blue-200">
                            <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                <i className="fa-solid fa-hand-pointer text-blue-600" />
                                Nhấn giữ và kéo để di chuyển cá! 🐠
                            </p>
                        </div>
                    </div>
                )}

                {/* Game over overlay */}
                {done && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md">
                        <div className="rounded-3xl border-4 border-amber-300 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 shadow-2xl max-w-md mx-4 transform scale-110">
                            <div className="text-center">
                                <div className="mb-4 animate-bounce">
                                    <i className={`text-7xl ${lives > 0 ? "fa-solid fa-trophy text-amber-400" : "fa-solid fa-heart-crack text-rose-500"}`} />
                                </div>
                                <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {lives > 0 ? "🎉 Chiến Thắng!" : "💔 Hết Mạng"}
                                </h2>
                                <p className="text-base text-slate-700 mb-6 font-semibold">
                                    {lives > 0 ? "Bạn đã ăn hết tất cả các con cá! Giỏi lắm! 🌟" : "Ôi không! Cố gắng lần sau nhé! 💪"}
                                </p>

                                <div className="flex justify-center gap-8 mb-8 bg-white/60 rounded-2xl p-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-extrabold text-emerald-600">{correct}</div>
                                        <div className="text-xs font-bold text-slate-600">Cá đã ăn 🐟</div>
                                    </div>
                                    <div className="text-3xl text-slate-300">/</div>
                                    <div className="text-center">
                                        <div className="text-4xl font-extrabold text-slate-700">{totalQuestions}</div>
                                        <div className="text-xs font-bold text-slate-600">Tổng số cá 🌊</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        <i className="fa-solid fa-rotate-right mr-2" />
                                        Chơi Lại
                                    </button>
                                    <button
                                        onClick={onExit}
                                        className="flex-1 rounded-2xl border-3 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 hover:bg-slate-100 hover:scale-105 transition-all shadow-lg"
                                    >
                                        <i className="fa-solid fa-home mr-2" />
                                        Về Nhà
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fullscreen exit button */}
                {fullscreen && !done && (
                    <button
                        onClick={toggleFullscreen}
                        className="pointer-events-auto absolute top-4 right-4 z-30 rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-lg hover:bg-white hover:scale-110 transition-all border-2 border-blue-200"
                    >
                        <i className="fa-solid fa-compress text-blue-600 text-xl" />
                    </button>
                )}
            </div>

            {/* Footer */}
            {!fullscreen && (
                <div className="mt-4 text-sm text-slate-600 text-center">
                    {submitting ? "Đang lưu kết quả…" : submitMsg || `🐠 Spawned: ${spawnedIndexRef.current}/${totalQuestions} • Đang bơi: ${actors.filter((x) => x.type === "enemy").length}`}
                </div>
            )}
        </div>
    );
}
