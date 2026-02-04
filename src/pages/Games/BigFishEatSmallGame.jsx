import React, { useRef } from "react";
import gsap from "gsap";

function cn(...xs) {
    return xs.filter(Boolean).join(" ");
}
function Card({ className, children }) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]",
                className
            )}
        >
            {children}
        </div>
    );
}

function FishBadge({ label, tone = "blue" }) {
    const toneCls =
        tone === "danger"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : tone === "ok"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200";

    return (
        <div className={cn("inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5", toneCls)}>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                {label}
            </span>
        </div>
    );
}

/** fish svg */
function FishSvg({ className, variant = "player", flip = false }) {
    // variant: "player" | "good" | "bad"
    const colors =
        variant === "good"
            ? { body1: "#34d399", body2: "#10b981", fin: "#059669", stroke: "#065f46" }
            : variant === "bad"
                ? { body1: "#fb7185", body2: "#ef4444", fin: "#e11d48", stroke: "#881337" }
                : { body1: "#111827", body2: "#334155", fin: "#0f172a", stroke: "#0b1220" };

    const gid = React.useMemo(
        () => `fish_${Math.random().toString(16).slice(2)}`,
        []
    );

    return (
        <svg
            viewBox="0 0 160 96"
            className={className}
            aria-hidden="true"
            style={{ transform: flip ? "scaleX(-1)" : undefined }}
        >
            <defs>
                <linearGradient id={`${gid}_g`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={colors.body1} />
                    <stop offset="1" stopColor={colors.body2} />
                </linearGradient>
                <filter id={`${gid}_shadow`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(2,6,23,0.25)" />
                </filter>
            </defs>

            {/* Tail */}
            <path
                d="M26 48c-14 10-18 22-18 22s20 0 30-10c4 8 2 18 2 18s18-10 18-30-18-30-18-30 2 10-2 18C38 26 20 26 20 26s4 12 18 22z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="4"
                strokeLinejoin="round"
                filter={`url(#${gid}_shadow)`}
            />

            {/* Body */}
            <path
                d="M54 48c10-18 34-30 64-30 18 0 32 6 42 18 10 12 10 24 0 36-10 12-24 18-42 18-30 0-54-12-64-30z"
                fill={`url(#${gid}_g)`}
                stroke={colors.stroke}
                strokeWidth="5"
                strokeLinejoin="round"
                filter={`url(#${gid}_shadow)`}
            />

            {/* Top fin */}
            <path
                d="M84 24c8-10 20-14 34-10-8 8-10 18-10 18-8-4-16-6-24-8z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="4"
                strokeLinejoin="round"
                opacity="0.95"
            />

            {/* Bottom fin */}
            <path
                d="M86 74c10 2 18 6 26 12-16 6-28 2-34-10 2 0 4-1 8-2z"
                fill={colors.fin}
                stroke={colors.stroke}
                strokeWidth="4"
                strokeLinejoin="round"
                opacity="0.95"
            />

            {/* Mouth */}
            <path
                d="M140 50c6 0 10 2 12 6-6 2-12 2-18 0"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Eye */}
            <circle cx="118" cy="40" r="10" fill="white" opacity="0.95" />
            <circle cx="121" cy="41" r="5.5" fill="#111827" opacity="0.85" />
            <circle cx="123" cy="39" r="2" fill="white" opacity="0.9" />

            {/* Cheek highlight */}
            <path
                d="M96 52c10 8 14 16 10 24"
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function aabb(a, b) {
    return !(
        a.x + a.w < b.x ||
        a.x > b.x + b.w ||
        a.y + a.h < b.y ||
        a.y > b.y + b.h
    );
}

function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

/**
 * Game behavior:
 * - Drag to move player fish
 * - Spawn multiple enemies concurrently
 * - Eat smaller, hit bigger => lose life (or consume shield)
 * - Optional power-ups: shield (config.powerUps)
 */
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
    const speedMode = String(config?.gameSpeed || "normal").toLowerCase(); // slow | normal | fast

    const spawnEveryMs =
        speedMode === "fast" ? 650 : speedMode === "slow" ? 1100 : 850;

    const maxOnScreen =
        speedMode === "fast" ? 5 : speedMode === "slow" ? 3 : 4;

    // -------- React state (UI only) --------
    const [lives, setLives] = React.useState(Number(config?.lives ?? 3));
    const [correct, setCorrect] = React.useState(0);
    const [shield, setShield] = React.useState(0); // powerup: block 1 hit
    const [done, setDone] = React.useState(false);

    const [playerNumber, setPlayerNumber] = React.useState(playerNumberBase);
    const playerNumberRef = React.useRef(playerNumberBase);

    // list only for mounting/unmounting DOM nodes (positions updated by GSAP without re-render each frame)
    const [actors, setActors] = React.useState([]); // {id, type:'enemy'|'power', number, speed, kind}

    // -------- Refs (game loop state) --------
    const arenaRef = React.useRef(null);
    const playerRef = React.useRef(null);

    const actorElsRef = React.useRef(new Map()); // id -> element
    const actorStateRef = React.useRef(new Map()); // id -> {x,y,w,h,vx,vy,scale,type,number,kind,alive}

    const playerStateRef = React.useRef({
        x: 60,
        y: 80,
        w: 76,
        h: 48,
        baseScale: 1,
        growth: 0, // grows slightly per eat
    });

    const pointerRef = React.useRef({
        dragging: false,
        pointerId: null,
    });

    const spawnedIndexRef = React.useRef(0); // spawn from enemiesSource sequentially
    const startAtRef = React.useRef(Date.now());

    // ---- Compute scale based on number in range ----
    const scaleFromNumber = React.useCallback(
        (num) => {
            const t = rangeMax === rangeMin ? 0.5 : (Number(num) - rangeMin) / (rangeMax - rangeMin);
            // smaller range => 0.75 .. 1.55
            return lerp(0.75, 1.55, clamp(t, 0, 1));
        },
        [rangeMin, rangeMax]
    );

    // ---- Setup arena size + initial player ----
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

            // base scale from player number
            const baseScale = scaleFromNumber(playerNumberBase);
            playerStateRef.current.baseScale = baseScale;

            // base size (will apply scale)
            const baseW = 76;
            const baseH = 48;
            playerStateRef.current.w = baseW * baseScale;
            playerStateRef.current.h = baseH * baseScale;

            // init pos
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

    // ---- Drag controls (pointer events) ----
    React.useEffect(() => {
        const arena = arenaRef.current;
        const playerEl = playerRef.current;
        if (!arena || !playerEl) return;

        const xTo = gsap.quickTo(playerEl, "x", { duration: 0.12, ease: "power3.out" });
        const yTo = gsap.quickTo(playerEl, "y", { duration: 0.12, ease: "power3.out" });

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
            // Only start dragging if pressed inside arena
            pointerRef.current.dragging = true;
            pointerRef.current.pointerId = e.pointerId;
            arena.setPointerCapture?.(e.pointerId);
            setFromClient(e.clientX, e.clientY);

            // little “grab” feedback
            gsap.to(playerEl, { scale: playerStateRef.current.baseScale * 1.05, duration: 0.12, ease: "power2.out" });
        };

        const onPointerMove = (e) => {
            if (!pointerRef.current.dragging) return;
            if (pointerRef.current.pointerId !== e.pointerId) return;
            setFromClient(e.clientX, e.clientY);
        };

        const onPointerUp = (e) => {
            if (pointerRef.current.pointerId !== e.pointerId) return;
            pointerRef.current.dragging = false;
            pointerRef.current.pointerId = null;

            gsap.to(playerEl, { scale: playerStateRef.current.baseScale, duration: 0.14, ease: "power2.out" });
        };

        arena.addEventListener("pointerdown", onPointerDown);
        arena.addEventListener("pointermove", onPointerMove);
        arena.addEventListener("pointerup", onPointerUp);
        arena.addEventListener("pointercancel", onPointerUp);
        arena.addEventListener("pointerleave", onPointerUp);

        return () => {
            arena.removeEventListener("pointerdown", onPointerDown);
            arena.removeEventListener("pointermove", onPointerMove);
            arena.removeEventListener("pointerup", onPointerUp);
            arena.removeEventListener("pointercancel", onPointerUp);
            arena.removeEventListener("pointerleave", onPointerUp);
        };
    }, [done]);

    // ---- Helpers to mount/unmount actors ----
    // const registerActorEl = React.useCallback((id, el) => {
    //     if (!el) {
    //         actorElsRef.current.delete(id);
    //         actorStateRef.current.delete(id);
    //         return;
    //     }
    //     actorElsRef.current.set(id, el);
    // }, []);
    const registerActorEl = React.useCallback((id, el) => {
        if (!el) {
            actorElsRef.current.delete(id);
            return; // ✅ không đụng actorStateRef ở đây
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
                duration: 0.18,
                ease: "back.in(1.6)",
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

    // ---- Spawn logic: multiple enemies + powerups ----
    React.useEffect(() => {
        if (done) return;
        if (!arenaRef.current) return;
        if (totalQuestions === 0) return;

        let timer = null;

        const spawnEnemy = () => {
            const arena = arenaRef.current;
            if (!arena) return;

            // stop if all source spawned
            if (spawnedIndexRef.current >= enemiesSource.length) return;

            // limit on screen
            const aliveCount = [...actorStateRef.current.values()].filter((a) => a.alive && a.type === "enemy").length;
            if (aliveCount >= maxOnScreen) return;

            const r = arena.getBoundingClientRect();

            const enemy = enemiesSource[spawnedIndexRef.current++];
            const num = Number(enemy?.number ?? 0);
            const spd = Number(enemy?.speed ?? 2);

            const scale = scaleFromNumber(num);
            const baseW = 72;
            const baseH = 44;
            const w = baseW * scale;
            const h = baseH * scale;

            // start from right
            const x = r.width + w + 12;
            const y = clamp(10 + Math.random() * (r.height - h - 20), 8, r.height - h - 8);

            // velocity px/sec (speed affects)
            const vx = -(180 + spd * 90) * (speedMode === "fast" ? 1.25 : speedMode === "slow" ? 0.9 : 1);

            const id = `e_${Date.now()}_${Math.random().toString(16).slice(2)}`;

            // create state
            actorStateRef.current.set(id, {
                id,
                type: "enemy",
                number: num,
                kind: "fish",
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

            // chance spawn powerup (if enabled)
            if (powerUpsEnabled && Math.random() < 0.22) {
                const pid = `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                const pScale = 1;
                const pw = 44;
                const ph = 44;
                const px = r.width + pw + 12;
                const py = clamp(10 + Math.random() * (r.height - ph - 20), 8, r.height - ph - 8);

                actorStateRef.current.set(pid, {
                    id: pid,
                    type: "power",
                    kind: "shield",
                    number: 0,
                    x: px,
                    y: py,
                    w: pw,
                    h: ph,
                    vx: -(220) * (speedMode === "fast" ? 1.2 : 1),
                    vy: 0,
                    scale: pScale,
                    alive: true,
                });
                setActors((xs) => [...xs, { id: pid, type: "power", kind: "shield" }]);
            }
        };

        timer = setInterval(spawnEnemy, spawnEveryMs);
        return () => clearInterval(timer);
    }, [
        done,
        totalQuestions,
        enemiesSource,
        maxOnScreen,
        spawnEveryMs,
        powerUpsEnabled,
        scaleFromNumber,
        speedMode,
    ]);

    // ---- Game loop: move actors + collision ----
    React.useEffect(() => {
        if (done) return;

        const tick = () => {
            const arena = arenaRef.current;
            if (!arena) return;

            const r = arena.getBoundingClientRect();

            const p = playerStateRef.current;
            const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };

            const dt = gsap.ticker.deltaRatio() / 60; // normalize (approx seconds factor)
            const removeIds = [];

            actorStateRef.current.forEach((a, id) => {
                if (!a.alive) return;

                // move
                a.x += a.vx * dt;
                a.y += a.vy * dt;

                // apply to DOM
                const el = actorElsRef.current.get(id);
                if (el) gsap.set(el, { x: a.x, y: a.y, scale: a.scale });

                // offscreen -> remove (no penalty)
                if (a.x < -a.w - 40) {
                    removeIds.push(id);
                    return;
                }

                // collision
                if (aabb(pBox, a)) {
                    if (a.type === "power") {
                        // collect shield
                        setShield((s) => s + 1);
                        // feedback
                        if (playerRef.current) {
                            gsap.fromTo(
                                playerRef.current,
                                { filter: "drop-shadow(0 0 0 rgba(16,185,129,0))" },
                                { filter: "drop-shadow(0 0 14px rgba(16,185,129,0.55))", duration: 0.18, yoyo: true, repeat: 1 }
                            );
                        }
                        killActor(id, true);
                        return;
                    }

                    // enemy fish
                    const currentPlayerNumber = playerNumberRef.current;
                    const canEat = Number(a.number) < currentPlayerNumber;

                    if (canEat) {
                        // eat
                        setCorrect((c) => c + 1);

                        // ✅ cộng số của cá lớn
                        const eaten = Number(a.number) || 0;
                        const nextNum = playerNumberRef.current + eaten;
                        playerNumberRef.current = nextNum;
                        setPlayerNumber(nextNum);

                        // ✅ update scale theo số mới (size theo numberRange)
                        const newBaseScale = scaleFromNumber(nextNum);
                        playerStateRef.current.baseScale = newBaseScale;

                        // (optional) vẫn cho “growth” nhẹ để feel đã ăn
                        p.growth = clamp(p.growth + 0.01, 0, 0.12);

                        const finalScale = newBaseScale * (1 + p.growth);
                        p.w = 76 * finalScale;
                        p.h = 48 * finalScale;

                        if (playerRef.current) {
                            gsap.to(playerRef.current, { scale: finalScale, duration: 0.12, ease: "power2.out" });
                        }

                        killActor(id, true);
                    } else {
                        // hit bigger fish
                        if (shield > 0) {
                            // consume shield
                            setShield((s) => Math.max(0, s - 1));
                            // knockback flash
                            if (arenaRef.current) {
                                gsap.fromTo(
                                    arenaRef.current,
                                    { x: 0 },
                                    { x: 10, yoyo: true, repeat: 5, duration: 0.05, ease: "power1.inOut", onComplete: () => gsap.set(arenaRef.current, { x: 0 }) }
                                );
                            }
                            killActor(id, true);
                        } else {
                            setLives((lv) => Math.max(0, lv - 1));
                            if (arenaRef.current) {
                                gsap.fromTo(
                                    arenaRef.current,
                                    { x: 0 },
                                    { x: 12, yoyo: true, repeat: 7, duration: 0.045, ease: "power1.inOut", onComplete: () => gsap.set(arenaRef.current, { x: 0 }) }
                                );
                            }
                            killActor(id, true);
                        }
                    }
                }
            });

            // clean removals
            if (removeIds.length) {
                removeIds.forEach((id) => killActor(id, false));
            }
        };

        // gsap.ticker.add(tick);
        // return () => gsap.ticker.remove(tick);
        tickRef.current = tick;
        gsap.ticker.add(tick);

        return () => {
            if (tickRef.current) {
                gsap.ticker.remove(tickRef.current);
                tickRef.current = null;
            }
        };

    }, [done, killActor, playerNumberBase, shield]);

    // ---- finish condition ----
    React.useEffect(() => {
        if (done) return;

        const allSpawned = spawnedIndexRef.current >= enemiesSource.length;
        const aliveEnemies = [...actorStateRef.current.values()].some(
            (a) => a.alive && a.type === "enemy"
        );

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

    //   // ---- reset when game changes ----
    //   React.useEffect(() => {
    //     return () => {
    //     //   gsap.ticker.removeAll();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, []);

    const progressText = `${correct}/${totalQuestions || 0}`;
    const rangeText = `${rangeMin}-${rangeMax}`;

    return (
        <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {game?.name || "Big Fish Eat Small"}
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900">
                        Cá lớn nuốt cá bé (drag to move)
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                        Nhấn giữ & kéo để điều khiển cá. Ăn cá nhỏ hơn, tránh cá lớn hơn.
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <FishBadge label={`Lives: ${lives}`} tone={lives <= 1 ? "danger" : "blue"} />
                    <FishBadge label={`Correct: ${progressText}`} tone="ok" />
                    {powerUpsEnabled ? (
                        <FishBadge label={`Shield: ${shield}`} tone={shield ? "ok" : "blue"} />
                    ) : null}

                    <button
                        onClick={onExit}
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Quay lại
                    </button>
                </div>
            </div>

            {/* Arena */}
            <div
                ref={arenaRef}
                className="relative mt-6 h-[380px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-sky-50 to-blue-100"
            >
                {/* background bubbles */}
                <div className="pointer-events-none absolute inset-0 opacity-35">
                    <div className="absolute left-6 top-10 h-16 w-16 rounded-full bg-white/40 blur-sm" />
                    <div className="absolute right-10 top-24 h-10 w-10 rounded-full bg-white/35 blur-sm" />
                    <div className="absolute left-24 bottom-10 h-12 w-12 rounded-full bg-white/30 blur-sm" />
                </div>

                {/* Player */}
                <div ref={playerRef} className="absolute left-0 top-0">
                    <div className="relative">
                        <FishSvg className="h-14 w-[120px]" variant="player" />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-extrabold text-slate-800">
                            {playerNumber}
                        </div>
                    </div>
                </div>

                {/* Actors */}
                {actors.map((a) => {
                    if (a.type === "enemy") {
                        const num = a.number;
                       const variant = num < playerNumber ? "good" : "bad";
                        return (
                            <div
                                key={a.id}
                                ref={(el) => registerActorEl(a.id, el)}
                                className="absolute left-0 top-0 will-change-transform"
                                style={{ opacity: 1 }}
                            >
                                <div className="relative">
                                    <FishSvg className="h-12 w-[110px]"
                                        variant={variant}
                                        flip={true} />
                                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-extrabold text-slate-800">
                                        {num}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // powerup shield
                    return (
                        <div
                            key={a.id}
                            ref={(el) => registerActorEl(a.id, el)}
                            className="absolute left-0 top-0 will-change-transform"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
                                <span className="text-xl">🛡️</span>
                            </div>
                        </div>
                    );
                })}

                {/* HUD overlay */}
                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                    Range {rangeText} • Speed {speedMode} • {powerUpsEnabled ? "PowerUps ON" : "PowerUps OFF"}
                </div>

                {!done ? (
                    <div className="pointer-events-none absolute top-3 left-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700">
                        Tip: nhấn giữ & kéo để bơi ✨
                    </div>
                ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                {submitting ? (
                    <div className="text-sm text-slate-600">Đang lưu kết quả…</div>
                ) : submitMsg ? (
                    <div className="text-sm text-slate-700">{submitMsg}</div>
                ) : done ? (
                    <div className="text-sm font-semibold text-emerald-700">✅ Kết thúc game!</div>
                ) : (
                    <div className="text-sm text-slate-600">
                        Spawned: {spawnedIndexRef.current}/{totalQuestions} • On screen:{" "}
                        {actors.filter((x) => x.type === "enemy").length}
                    </div>
                )}
            </div>
        </Card>
    );
}
