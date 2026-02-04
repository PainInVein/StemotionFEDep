import React from "react";
import gsap from "gsap";

/**
 * Math Racing - Pixel Map (React + GSAP)
 * - UI kiểu pixel top-down như hình
 * - A/D (hoặc ←/→) để đổi lane trái/phải
 * - Va chạm CPU => trừ máu + knockback + iFrame
 * - Trả lời toán => ảnh hưởng trực tiếp tốc độ (boost / brake)
 * - CPU auto-answer (70–85% accuracy + delay)
 * - HẾT CÂU HỎI => tất cả "dash" tới đích (winner theo progress thực tại thời điểm dash)
 */

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
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
function Chip({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}

function opSymbol(op) {
  return op === "subtract" ? "−" : "+";
}

/** Pixel car sprite (DOM) */
function PixelCar({ color = "red", label, carRef, isPlayer }) {
  const body =
    color === "blue"
      ? "bg-blue-500"
      : color === "gray"
      ? "bg-slate-400"
      : color === "yellow"
      ? "bg-amber-400"
      : color === "green"
      ? "bg-emerald-500"
      : "bg-rose-500";

  // pixel-ish: hard edges, border, small window
  return (
    <div
      ref={carRef}
      className={cn(
        "absolute left-0 top-0 will-change-transform select-none",
        "z-[5]"
      )}
      style={{ imageRendering: "pixelated" }}
    >
      <div className="relative">
        {/* label */}
        <div
          className={cn(
            "absolute -top-5 left-1/2 -translate-x-1/2 rounded-md px-2 py-0.5 text-[10px] font-extrabold",
            isPlayer ? "bg-white text-slate-900" : "bg-white/90 text-slate-800"
          )}
          style={{ border: "2px solid rgba(15,23,42,0.15)" }}
        >
          {label}
        </div>

        {/* car */}
        <div
          className={cn(
            "relative h-[52px] w-[28px] rounded-[6px]",
            body
          )}
          style={{
            border: "3px solid rgba(15,23,42,0.35)",
            boxShadow: "0 6px 0 rgba(15,23,42,0.10)",
          }}
        >
          {/* windshield */}
          <div
            className="absolute left-1/2 top-[8px] h-[14px] w-[16px] -translate-x-1/2 rounded-[4px] bg-sky-100/90"
            style={{ border: "2px solid rgba(15,23,42,0.18)" }}
          />
          {/* hood stripe */}
          <div className="absolute left-1/2 top-[28px] h-[10px] w-[6px] -translate-x-1/2 rounded bg-white/60" />
          {/* wheels */}
          <div
            className="absolute -left-[6px] top-[10px] h-[10px] w-[6px] rounded bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.15)" }}
          />
          <div
            className="absolute -right-[6px] top-[10px] h-[10px] w-[6px] rounded bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.15)" }}
          />
          <div
            className="absolute -left-[6px] top-[34px] h-[10px] w-[6px] rounded bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.15)" }}
          />
          <div
            className="absolute -right-[6px] top-[34px] h-[10px] w-[6px] rounded bg-slate-900"
            style={{ border: "2px solid rgba(255,255,255,0.15)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MathRacingPixelGame({
  game,
  config,
  onExit,
  onFinish,
  submitting,
  submitMsg,
}) {
  // ===== CONFIG =====
  const raceLength = Number(config?.raceLength ?? 100); // units
  const opponentsCount = clamp(Number(config?.opponents ?? 3), 1, 6);
  const questions = Array.isArray(config?.questions) ? config.questions : [];
  const totalQuestions = questions.length;
  const timePerQuestion = clamp(Number(config?.timePerQuestion ?? 12), 6, 60);

  const lanesCount = 4; // kiểu pixel racer thường 3-4 lane
  const maxHp = clamp(Number(config?.lives ?? 3), 1, 9);

  // end-of-questions dash
  const dashDuration = 1.15; // seconds

  // ===== UI STATE =====
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [winner, setWinner] = React.useState(""); // "player" | "cpu"
  const [timeLeft, setTimeLeft] = React.useState(timePerQuestion);
  const [hp, setHp] = React.useState(maxHp);

  // ===== REFS =====
  const arenaRef = React.useRef(null);
  const roadRef = React.useRef(null);
  const roadScrollRef = React.useRef(null);
  const grassScrollRef = React.useRef(null);

  const playerElRef = React.useRef(null);
  const cpuElRefs = React.useRef([]);

  const tickRef = React.useRef(null);
  const startAtRef = React.useRef(Date.now());
  const finishOnceRef = React.useRef(false);

  const questionLockRef = React.useRef(false);
  const aiTimersRef = React.useRef({}); // qIndex -> {cpuId: tid}

  // lane control
  const heldRef = React.useRef({ left: false, right: false });
  const playerLaneRef = React.useRef(1);
  const laneCentersRef = React.useRef([]); // px centers
  const xToRef = React.useRef(null);

  // iFrame collision
  const invulnRef = React.useRef(false);
  const invulnUntilRef = React.useRef(0);

  // game state (no rerender each frame)
  const carsRef = React.useRef([]); // [{id, kind, lane, progress, speed, targetSpeed, accel, drag, skill, accuracy, lastBoostAt}]

  const currentQ = questions[idx] || null;
  const promptText = React.useMemo(() => {
    if (!currentQ) return "";
    return `${currentQ.num1} ${opSymbol(currentQ.operation)} ${currentQ.num2} = ?`;
  }, [currentQ]);

  // ===== helpers =====
  const buildCars = React.useCallback(() => {
    const makeCar = (id, kind, lane) => ({
      id,
      kind, // "player" | "cpu"
      lane,
      progress: 0,
      speed: kind === "player" ? 14 : 13 + Math.random() * 2,
      targetSpeed: kind === "player" ? 14 : 13 + Math.random() * 2,
      accel: kind === "player" ? 26 : 20,
      drag: 0.988,
      skill: kind === "player" ? 1 : 0.92 + Math.random() * 0.18,
      accuracy: kind === "player" ? 1 : 0.7 + Math.random() * 0.15,
      lastBoostAt: 0,
      dashTween: null,
    });

    const arr = [];
    arr.push(makeCar("player", "player", 1));
    for (let i = 0; i < opponentsCount; i++) {
      // random lane start, avoid player lane if possible
      let lane = Math.floor(Math.random() * lanesCount);
      if (lane === 1) lane = (lane + 1) % lanesCount;
      arr.push(makeCar(`cpu_${i}`, "cpu", lane));
    }
    carsRef.current = arr;
  }, [lanesCount, opponentsCount]);

  const layoutLanes = React.useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const r = arena.getBoundingClientRect();

    // road width area
    const roadPad = 22;
    const roadW = r.width - roadPad * 2;
    const laneW = roadW / lanesCount;

    const centers = [];
    for (let i = 0; i < lanesCount; i++) {
      centers.push(roadPad + laneW * i + laneW / 2);
    }
    laneCentersRef.current = centers;

    // init quickTo for player x once
    if (playerElRef.current && !xToRef.current) {
      xToRef.current = gsap.quickTo(playerElRef.current, "x", {
        duration: 0.12,
        ease: "power3.out",
      });
    }
  }, [lanesCount]);

  const setPlayerLane = React.useCallback(
    (lane) => {
      const L = clamp(lane, 0, lanesCount - 1);
      playerLaneRef.current = L;

      const xCenter = laneCentersRef.current[L] ?? 100;
      // car width ~ 28 => center align
      const x = xCenter - 14;

      if (xToRef.current) xToRef.current(x);

      const player = carsRef.current.find((c) => c.kind === "player");
      if (player) player.lane = L;
    },
    [lanesCount]
  );

  const carYFromProgress = React.useCallback((car) => {
    // pixel racer: player stays near bottom, others move relative
    const player = carsRef.current.find((c) => c.kind === "player");
    const cam = player ? player.progress : 0;
    const dy = car.progress - cam; // ahead => positive
    // units->px: tune for pixel feel
    const ppu = 7.2;

    // player anchor Y
    const arena = arenaRef.current;
    const h = arena ? arena.getBoundingClientRect().height : 460;
    const playerY = h - 88;

    return playerY - dy * ppu;
  }, []);

  const setCarDomXY = React.useCallback((car, x, y) => {
    const el =
      car.kind === "player"
        ? playerElRef.current
        : cpuElRefs.current[Number(car.id.split("_")[1])] || null;
    if (!el) return;
    gsap.set(el, { x, y });
  }, []);

  const applyAnswerEffect = React.useCallback((car, isCorrect) => {
    const now = Date.now();
    car.lastBoostAt = now;

    const baseCruise = car.kind === "player" ? 14 : 13.2 * car.skill;
    const boost = car.kind === "player" ? 22 : 20.5 * car.skill;
    const brake = car.kind === "player" ? 7 : 8 * car.skill;

    if (isCorrect) {
      car.targetSpeed = boost;
      gsap.delayedCall(0.55, () => {
        if (Date.now() - car.lastBoostAt < 520) return;
        car.targetSpeed = baseCruise;
      });
    } else {
      car.targetSpeed = brake;
      gsap.delayedCall(0.45, () => {
        if (Date.now() - car.lastBoostAt < 420) return;
        car.targetSpeed = baseCruise;
      });
    }

    const el =
      car.kind === "player"
        ? playerElRef.current
        : cpuElRefs.current[Number(car.id.split("_")[1])] || null;

    if (el) {
      gsap.fromTo(
        el,
        { y: "+=0" },
        { y: isCorrect ? "-=6" : "+=4", duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
      );
      if (!isCorrect) {
        gsap.fromTo(el, { rotation: 0 }, { rotation: (Math.random() < 0.5 ? -1 : 1) * 6, duration: 0.09, yoyo: true, repeat: 2 });
      }
    }
  }, []);

  const checkCollision = React.useCallback(() => {
    const now = Date.now();
    if (invulnRef.current && now < invulnUntilRef.current) return;

    const player = carsRef.current.find((c) => c.kind === "player");
    if (!player) return;

    // collision if same lane and y overlap range
    const playerY = carYFromProgress(player);

    for (const cpu of carsRef.current.filter((c) => c.kind === "cpu")) {
      if (cpu.lane !== player.lane) continue;

      const cpuY = carYFromProgress(cpu);
      const dy = Math.abs(cpuY - playerY);

      // car height ~52 => threshold
      if (dy < 38) {
        // HIT!
        invulnRef.current = true;
        invulnUntilRef.current = now + 900;

        // reduce hp
        setHp((h) => Math.max(0, h - 1));

        // knockback & slow
        player.targetSpeed = Math.max(6, player.targetSpeed - 6);
        player.speed = Math.max(5, player.speed - 4);

        // visual blink
        if (playerElRef.current) {
          gsap.fromTo(
            playerElRef.current,
            { opacity: 1 },
            { opacity: 0.25, duration: 0.08, yoyo: true, repeat: 7, ease: "none" }
          );
        }

        // small bounce lane shift (stay same lane but shake)
        if (roadRef.current) {
          gsap.fromTo(
            roadRef.current,
            { x: 0 },
            { x: 10, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => gsap.set(roadRef.current, { x: 0 }) }
          );
        }
        break;
      }
    }
  }, [carYFromProgress]);

  const finishGame = React.useCallback(
    (win) => {
      if (finishOnceRef.current) return;
      finishOnceRef.current = true;

      setDone(true);
      setWinner(win);

      const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
      onFinish?.({
        correctAnswers: correct,
        totalQuestions,
        playDurations,
      });
    },
    [correct, onFinish, totalQuestions]
  );

  const dashToFinish = React.useCallback(() => {
    if (finishOnceRef.current) return;

    // winner by real progress BEFORE dash
    const leader = carsRef.current.slice().sort((a, b) => b.progress - a.progress)[0];
    const win = leader?.kind === "player" ? "player" : "cpu";

    setDone(true);
    setWinner(win);
    finishOnceRef.current = true;

    carsRef.current.forEach((car) => {
      try {
        car.dashTween?.kill?.();
      } catch {}
      const obj = { p: car.progress };
      car.dashTween = gsap.to(obj, {
        p: raceLength,
        duration: dashDuration,
        ease: "power3.inOut",
        onUpdate: () => {
          car.progress = obj.p;
        },
      });
    });

    gsap.delayedCall(dashDuration + 0.05, () => {
      const playDurations = Math.floor((Date.now() - startAtRef.current) / 1000);
      onFinish?.({
        correctAnswers: correct,
        totalQuestions,
        playDurations,
      });
    });
  }, [dashDuration, onFinish, raceLength, totalQuestions]);

  // ===== INIT / RESET =====
  React.useEffect(() => {
    // reset
    finishOnceRef.current = false;
    questionLockRef.current = false;
    startAtRef.current = Date.now();

    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
    setWinner("");
    setTimeLeft(timePerQuestion);
    setHp(maxHp);

    invulnRef.current = false;
    invulnUntilRef.current = 0;

    heldRef.current = { left: false, right: false };
    playerLaneRef.current = 1;

    // clear AI timers
    Object.values(aiTimersRef.current).forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((tid) => tid && clearTimeout(tid));
    });
    aiTimersRef.current = {};

    buildCars();

    requestAnimationFrame(() => {
      layoutLanes();
      setPlayerLane(1);

      // place initial cars
      carsRef.current.forEach((car) => {
        const xCenter = laneCentersRef.current[car.lane] ?? 100;
        const x = xCenter - 14;

        // screen Y: put cpu slightly ahead randomly
        if (car.kind === "cpu") car.progress = 6 + Math.random() * 10;

        const y = carYFromProgress(car);
        setCarDomXY(car, x, y);
      });

      // init scroll backgrounds
      if (roadScrollRef.current) gsap.set(roadScrollRef.current, { y: 0 });
      if (grassScrollRef.current) gsap.set(grassScrollRef.current, { y: 0 });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.gameId]);

  // ===== RESIZE =====
  React.useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    layoutLanes();
    const ro = new ResizeObserver(() => {
      layoutLanes();
      setPlayerLane(playerLaneRef.current);
    });
    ro.observe(arena);
    return () => ro.disconnect();
  }, [layoutLanes, setPlayerLane]);

  // ===== KEYBOARD (A/D, arrows) =====
  React.useEffect(() => {
    const onDown = (e) => {
      if (done) return;
      const k = e.key.toLowerCase();
      if (k === "a" || e.key === "ArrowLeft") {
        heldRef.current.left = true;
      }
      if (k === "d" || e.key === "ArrowRight") {
        heldRef.current.right = true;
      }
    };
    const onUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === "a" || e.key === "ArrowLeft") heldRef.current.left = false;
      if (k === "d" || e.key === "ArrowRight") heldRef.current.right = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [done]);

  // ===== QUESTION TIMER =====
  React.useEffect(() => {
    if (done) return;
    if (!currentQ) return;

    setTimeLeft(timePerQuestion);
    questionLockRef.current = false;

    const started = Date.now();
    const t = setInterval(() => {
      const passed = Math.floor((Date.now() - started) / 1000);
      const left = timePerQuestion - passed;
      setTimeLeft(left);

      if (left <= 0) {
        clearInterval(t);
        if (!questionLockRef.current) handlePlayerAnswer(null, { isTimeout: true });
      }
    }, 200);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done]);

  // ===== AI answers per question =====
  React.useEffect(() => {
    if (done) return;
    if (!currentQ) return;

    const qIndex = idx;
    aiTimersRef.current[qIndex] = aiTimersRef.current[qIndex] || {};
    const correctAns = Number(currentQ.correctAnswer);
    const answers = Array.isArray(currentQ.answers) ? currentQ.answers : [];

    carsRef.current.forEach((car) => {
      if (car.kind !== "cpu") return;

      const delay = clamp(520 + Math.random() * 1100 + (1.15 - car.skill) * 220, 380, 2100);
      const acc = clamp(car.accuracy + (Math.random() * 0.06 - 0.03), 0.7, 0.85);
      const willCorrect = Math.random() < acc;

      const tid = setTimeout(() => {
        if (done) return;
        if (idx !== qIndex) return;

        const chosen = willCorrect
          ? correctAns
          : (() => {
              const wrongs = answers.filter((a) => Number(a) !== correctAns);
              return wrongs.length
                ? Number(wrongs[Math.floor(Math.random() * wrongs.length)])
                : correctAns + 1;
            })();

        applyAnswerEffect(car, Number(chosen) === correctAns);

        // AI thỉnh thoảng đổi lane để tạo va chạm
        if (Math.random() < 0.28) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          car.lane = clamp(car.lane + dir, 0, lanesCount - 1);
        }
      }, delay);

      aiTimersRef.current[qIndex][car.id] = tid;
    });

    return () => {
      const m = aiTimersRef.current[qIndex];
      if (!m) return;
      Object.values(m).forEach((tid) => tid && clearTimeout(tid));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done]);

  // ===== PLAYER answer =====
  const handlePlayerAnswer = React.useCallback(
    (ans, { isTimeout = false } = {}) => {
      if (done) return;
      if (!currentQ) return;
      if (questionLockRef.current) return;

      questionLockRef.current = true;
      setPicked(ans);

      const correctAns = Number(currentQ.correctAnswer);
      const ok = !isTimeout && ans != null && Number(ans) === correctAns;

      const player = carsRef.current.find((c) => c.kind === "player");
      if (player) applyAnswerEffect(player, ok);

      if (ok) setCorrect((c) => c + 1);

      gsap.delayedCall(0.7, () => {
        if (done) return;
        const next = idx + 1;
        if (next >= totalQuestions) {
          // hết câu => dash cán đích
          dashToFinish();
        } else {
          setIdx(next);
          setPicked(null);
        }
      });
    },
    [applyAnswerEffect, currentQ, dashToFinish, done, idx, totalQuestions]
  );

  // ===== MAIN LOOP =====
  React.useEffect(() => {
    if (done) return;

    const tick = () => {
      const dt = gsap.ticker.deltaRatio() / 60;

      // lane input (đổi lane kiểu step)
      // (giữ phím -> mỗi 120ms đổi 1 lane cho cảm giác arcade)
      const hold = heldRef.current;
      if (!tick._lastLaneMoveAt) tick._lastLaneMoveAt = 0;
      tick._lastLaneMoveAt += dt;

      if (tick._lastLaneMoveAt > 0.12) {
        if (hold.left) setPlayerLane(playerLaneRef.current - 1);
        if (hold.right) setPlayerLane(playerLaneRef.current + 1);
        if (hold.left || hold.right) tick._lastLaneMoveAt = 0;
      }

      // physics + progress
      carsRef.current.forEach((car) => {
        car.speed = lerp(car.speed, car.targetSpeed, clamp(car.accel * dt * 0.12, 0, 1));
        car.speed *= car.drag;
        car.progress = clamp(car.progress + car.speed * dt, 0, raceLength);

        // nếu ai chạm finish trước khi hết câu => thắng luôn
        if (!finishOnceRef.current && car.progress >= raceLength) {
          finishGame(car.kind === "player" ? "player" : "cpu");
        }
      });

      // scroll road/grass (pixel)
      const player = carsRef.current.find((c) => c.kind === "player");
      const pxPerSec = (player ? player.speed : 0) * 20; // tune speed feel
      const roadV = 120 + pxPerSec * 0.9;
      const grassV = 90 + pxPerSec * 0.65;

      if (!tick._roadY) tick._roadY = 0;
      if (!tick._grassY) tick._grassY = 0;
      tick._roadY += roadV * dt;
      tick._grassY += grassV * dt;

      // modulo repeat
      const mod = (v, m) => ((v % m) + m) % m;
      const roadY = mod(tick._roadY, 120);
      const grassY = mod(tick._grassY, 96);

      if (roadScrollRef.current) gsap.set(roadScrollRef.current, { y: roadY });
      if (grassScrollRef.current) gsap.set(grassScrollRef.current, { y: grassY });

      // update DOM positions
      carsRef.current.forEach((car) => {
        const xCenter = laneCentersRef.current[car.lane] ?? 100;
        const x = xCenter - 14;
        const y = carYFromProgress(car);

        // clamp y visible a bit
        const arena = arenaRef.current;
        const h = arena ? arena.getBoundingClientRect().height : 460;
        const yy = clamp(y, 24, h - 78);

        setCarDomXY(car, x, yy);
      });

      // collision check
      checkCollision();

      // hp 0 => CPU wins immediately
      if (!finishOnceRef.current && hp <= 0) {
        finishGame("cpu");
      }

      // if invuln expired
      if (invulnRef.current && Date.now() >= invulnUntilRef.current) {
        invulnRef.current = false;
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
  }, [carYFromProgress, checkCollision, done, finishGame, hp, lanesCount, raceLength, setPlayerLane, setCarDomXY]);

  // ===== derived HUD =====
  const player = carsRef.current.find((c) => c.kind === "player");
  const bestCpu = Math.max(0, ...carsRef.current.filter((c) => c.kind === "cpu").map((c) => c.progress));
  const bestAll = Math.max(0, ...carsRef.current.map((c) => c.progress));

  return (
    <Card className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {game?.name || "Math Racing"}
          </div>
          <div className="mt-1 text-lg font-extrabold text-slate-900">
            Math Racing — Pixel Road (A/D để lái)
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Đúng: boost • Sai/timeout: khựng • Va chạm: trừ máu • Hết câu: dash cán đích.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip>{idx + 1}/{Math.max(1, totalQuestions)} câu</Chip>
          <Chip className={cn(timeLeft <= 3 ? "border-rose-200 bg-rose-50 text-rose-700" : "")}>
            ⏱ {Math.max(0, timeLeft)}s
          </Chip>
          <Chip>✅ {correct}</Chip>
          <Chip className={cn(hp <= 1 ? "border-rose-200 bg-rose-50 text-rose-700" : "")}>
            ❤️ {hp}/{maxHp}
          </Chip>

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
        className="relative mt-6 h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-sky-100"
      >
        {/* grass sides (pixel tiles) */}
        <div className="absolute inset-0">
          <div
            ref={grassScrollRef}
            className="absolute inset-0 will-change-transform"
            style={{ imageRendering: "pixelated" }}
          >
            {/* repeat blocks to look tiled */}
            <div className="absolute inset-0">
              <div
                className="absolute left-0 top-0 bottom-0 w-[22%]"
                style={{
                  backgroundImage:
                    "linear-gradient(#16a34a 0 0), radial-gradient(circle at 20% 30%, rgba(0,0,0,0.18) 0 2px, transparent 3px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.14) 0 2px, transparent 3px)",
                  backgroundSize: "100% 100%, 24px 24px, 28px 28px",
                  backgroundPosition: "0 0, 0 0, 0 0",
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-[22%]"
                style={{
                  backgroundImage:
                    "linear-gradient(#16a34a 0 0), radial-gradient(circle at 30% 40%, rgba(0,0,0,0.18) 0 2px, transparent 3px), radial-gradient(circle at 70% 65%, rgba(255,255,255,0.14) 0 2px, transparent 3px)",
                  backgroundSize: "100% 100%, 24px 24px, 28px 28px",
                  backgroundPosition: "0 0, 0 0, 0 0",
                }}
              />
            </div>
          </div>
        </div>

        {/* Road */}
        <div
          ref={roadRef}
          className="absolute inset-y-0 left-1/2 w-[56%] -translate-x-1/2 overflow-hidden rounded-2xl border"
          style={{
            borderColor: "rgba(15,23,42,0.25)",
            backgroundColor: "#111827",
            imageRendering: "pixelated",
          }}
        >
          {/* road scroll layer */}
          <div ref={roadScrollRef} className="absolute inset-0 will-change-transform">
            {/* lane markings (repeat) */}
            <div className="absolute inset-0">
              {/* side borders */}
              <div className="absolute left-1 top-0 bottom-0 w-[4px] bg-white/35" />
              <div className="absolute right-1 top-0 bottom-0 w-[4px] bg-white/35" />

              {/* lane dashed lines: create 3 dashed columns for 4 lanes */}
              {Array.from({ length: lanesCount - 1 }).map((_, col) => (
                <div
                  key={col}
                  className="absolute top-[-120px] bottom-[-120px] w-[4px] opacity-80"
                  style={{
                    left: `${((col + 1) / lanesCount) * 100}%`,
                    transform: "translateX(-2px)",
                  }}
                >
                  {Array.from({ length: 14 }).map((__, i) => (
                    <div
                      key={i}
                      className="mx-auto my-[10px] h-[18px] w-[4px] rounded bg-white/85"
                      style={{ marginTop: i === 0 ? 0 : 12 }}
                    />
                  ))}
                </div>
              ))}

              {/* slight grain */}
              <div
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.55) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.55) 0 1px, transparent 2px)",
                  backgroundSize: "26px 26px",
                }}
              />
            </div>
          </div>

          {/* Finish flag (top) */}
          <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 z-[8]">
            <div
              className="rounded-md bg-white px-3 py-1 text-[10px] font-extrabold text-slate-900"
              style={{ border: "2px solid rgba(15,23,42,0.2)" }}
            >
              FINISH
            </div>
          </div>

          {/* Cars */}
          <PixelCar
            isPlayer
            color="red"
            label={`YOU • ${Math.round(player?.progress ?? 0)}/${raceLength}`}
            carRef={playerElRef}
          />
          {Array.from({ length: opponentsCount }).map((_, i) => (
            <PixelCar
              key={i}
              isPlayer={false}
              color={i % 3 === 0 ? "blue" : i % 3 === 1 ? "gray" : "yellow"}
              label={`CPU ${i + 1} • ${Math.round(
                carsRef.current.find((c) => c.id === `cpu_${i}`)?.progress ?? 0
              )}`}
              carRef={(el) => (cpuElRefs.current[i] = el)}
            />
          ))}
        </div>

        {/* HUD overlay */}
        <div className="pointer-events-none absolute left-4 top-4 z-[20] flex flex-wrap gap-2">
          <div className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm">
            Speed: <span className="font-extrabold">{Math.round(player?.speed ?? 0)}</span>
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm">
            Lead: <span className="font-extrabold">{Math.round(bestAll)}</span> / {raceLength}
          </div>
          <div className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm">
            CPU best: <span className="font-extrabold">{Math.round(bestCpu)}</span>
          </div>
          {!done ? (
            <div className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm">
              ⌨ A/D (←/→) để đổi làn
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-extrabold shadow-sm",
                winner === "player" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              )}
            >
              🏁 {winner === "player" ? "Bạn thắng!" : "CPU thắng!"}
            </div>
          )}
        </div>
      </div>

      {/* Question Panel */}
      <div className="mt-6">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-slate-900">
              {currentQ ? promptText : "Không có câu hỏi"}
            </div>
            <Chip className={cn(picked != null ? "border-slate-300" : "")}>
              {picked == null ? "Chọn đáp án" : "Đã chọn"}
            </Chip>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(currentQ?.answers || []).map((a) => {
              const locked = picked != null || done;
              const isPicked = picked != null && Number(picked) === Number(a);
              const isCorrect = Number(a) === Number(currentQ?.correctAnswer);

              return (
                <button
                  key={a}
                  type="button"
                  disabled={locked}
                  onClick={() => handlePlayerAnswer(a)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm font-extrabold shadow-sm transition active:scale-[0.99]",
                    !locked && "hover:bg-slate-50",
                    locked && isPicked && isCorrect && "border-emerald-200 bg-emerald-50",
                    locked && isPicked && !isCorrect && "border-rose-200 bg-rose-50",
                    locked && !isPicked && "opacity-70",
                    !locked && "border-slate-200 bg-white"
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>

          {!done && picked == null ? (
            <div className="mt-3 text-xs text-slate-500">
              Timeout sau <b>{timePerQuestion}s</b> → tính sai (xe khựng).
            </div>
          ) : null}

          {done ? (
            <div className="mt-3 text-xs text-slate-600">
              *Hết câu hỏi → tất cả sẽ <b>dash</b> cán đích, nhưng winner dựa trên progress thật trước dash.
            </div>
          ) : null}
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {submitting ? (
          <div className="text-sm text-slate-600">Đang lưu kết quả…</div>
        ) : submitMsg ? (
          <div className="text-sm text-slate-700">{submitMsg}</div>
        ) : done ? (
          <div className="text-sm font-semibold text-slate-800">
            Kết thúc:{" "}
            <span className={winner === "player" ? "text-emerald-700" : "text-rose-700"}>
              {winner === "player" ? "Bạn thắng" : "CPU thắng"}
            </span>
          </div>
        ) : (
          <div className="text-sm text-slate-600">
            YOU {Math.round(player?.progress ?? 0)}/{raceLength} • CPU best {Math.round(bestCpu)}/{raceLength}
          </div>
        )}
      </div>
    </Card>
  );
}
