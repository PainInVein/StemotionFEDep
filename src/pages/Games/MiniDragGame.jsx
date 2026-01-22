import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Tạo layout auto theo W/H (tất cả đều theo tỉ lệ -> responsive).
 * Không còn hardcode x=520 nữa.
 */
function makeLayout(W, H) {
  // kích thước khối theo % (điều chỉnh ở đây nếu muốn)
  const pieceW = Math.round(W * 0.32);
  const pieceH = Math.round(H * 0.18);

  const targetW = pieceW;
  const targetH = pieceH;

  // padding 2 bên
  const padX = Math.round(W * 0.06);
  const gapY = Math.round(H * 0.06);

  // chia 2 cột: trái là pieces, phải là targets
  const leftX = padX;
  const rightX = W - padX - targetW;

  // Canh 3 hàng dọc, tính top sao cho nằm giữa tổng chiều cao
  const stackH = pieceH * 3 + gapY * 2;
  const topY = Math.round((H - stackH) / 2);

  const targets = [
    { id: "t1", x: rightX, y: topY + 0 * (pieceH + gapY), w: targetW, h: targetH, label: "ĐÍCH A" },
    { id: "t2", x: rightX, y: topY + 1 * (pieceH + gapY), w: targetW, h: targetH, label: "ĐÍCH B" },
    { id: "t3", x: rightX, y: topY + 2 * (pieceH + gapY), w: targetW, h: targetH, label: "ĐÍCH C" },
  ];

  // Pieces bên trái (xê dịch nhẹ để “tự nhiên”)
  const pieces = [
    { id: "p1", targetId: "t1", x: leftX, y: topY + 0 * (pieceH + gapY), w: pieceW, h: pieceH, text: "KHỐI 1" },
    { id: "p2", targetId: "t2", x: leftX + Math.round(W * 0.01), y: topY + 1 * (pieceH + gapY), w: pieceW, h: pieceH, text: "KHỐI 2" },
    { id: "p3", targetId: "t3", x: leftX + Math.round(W * 0.02), y: topY + 2 * (pieceH + gapY), w: pieceW, h: pieceH, text: "KHỐI 3" },
  ];

  return { targets, pieces };
}

export default function MiniDragGame({ height = 260, className = "", onComplete }) {
  // Base coordinate system (vẽ theo hệ tọa độ này, sau đó scale theo container)
  // Bạn có thể giữ W/H như này, layout vẫn auto theo %.
  const W = 720;
  const H = 360;

  const { targets, initialPieces } = useMemo(() => {
    const { targets, pieces } = makeLayout(W, H);
    return { targets, initialPieces: pieces };
  }, [W, H]);

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const [pieces, setPieces] = useState(() =>
    initialPieces.map((p) => ({ ...p, placed: false }))
  );
  const [drag, setDrag] = useState(null); // { id, pointerId, offsetX, offsetY }
  const [message, setMessage] = useState("Kéo thả các khối vào đúng đích 🙂");

  // ResizeObserver: scale để fit theo width/height của container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const s = Math.min(rect.width / W, rect.height / H);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H]);

  const fromClientToGame = (clientX, clientY) => {
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    const xPx = clientX - rect.left;
    const yPx = clientY - rect.top;
    return { x: xPx / scale, y: yPx / scale };
  };

  const isInside = (piece, target) => {
    const cx = piece.x + piece.w / 2;
    const cy = piece.y + piece.h / 2;
    return cx >= target.x && cx <= target.x + target.w && cy >= target.y && cy <= target.y + target.h;
  };

  const snapToTarget = (piece, target) => {
    const nx = target.x + (target.w - piece.w) / 2;
    const ny = target.y + (target.h - piece.h) / 2;
    return { ...piece, x: nx, y: ny, placed: true };
  };

  const checkComplete = (nextPieces) => {
    const done = nextPieces.every((p) => p.placed);
    if (done) {
      setMessage("🎉 Hoàn thành! Bạn giỏi quá!");
      onComplete?.();
    }
  };

  const reset = () => {
    setPieces(initialPieces.map((p) => ({ ...p, placed: false })));
    setMessage("Kéo thả các khối vào đúng đích 🙂");
    setDrag(null);
  };

  // Throttle move bằng RAF
  const rafRef = useRef(null);
  const pendingRef = useRef(null);

  const applyMove = () => {
    rafRef.current = null;
    if (!pendingRef.current) return;

    const { id, x, y, offsetX, offsetY } = pendingRef.current;

    setPieces((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;

      const p = prev[idx];
      const nx = clamp(x - offsetX, 0, W - p.w);
      const ny = clamp(y - offsetY, 0, H - p.h);

      const next = [...prev];
      next[idx] = { ...p, x: nx, y: ny };
      return next;
    });
  };

  const onPointerDown = (e, pieceId) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.placed) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const { x, y } = fromClientToGame(e.clientX, e.clientY);
    setDrag({
      id: pieceId,
      pointerId: e.pointerId,
      offsetX: x - piece.x,
      offsetY: y - piece.y,
    });
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;

    const { x, y } = fromClientToGame(e.clientX, e.clientY);
    pendingRef.current = { id: drag.id, x, y, offsetX: drag.offsetX, offsetY: drag.offsetY };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyMove);
    }
  };

  const onPointerUp = (e) => {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;

    setPieces((prev) => {
      const idx = prev.findIndex((p) => p.id === drag.id);
      if (idx === -1) return prev;

      const p = prev[idx];
      const target = targets.find((t) => t.id === p.targetId);

      let nextPiece = p;
      if (target && isInside(p, target)) {
        nextPiece = snapToTarget(p, target);
        setMessage("✅ Đúng rồi!");
      } else {
        setMessage("❌ Chưa đúng, thử lại nha!");
      }

      const next = [...prev];
      next[idx] = nextPiece;

      queueMicrotask(() => checkComplete(next));
      return next;
    });

    setDrag(null);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-sm font-medium text-gray-700">{message}</div>
        <button
          type="button"
          onClick={reset}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-[0.99]"
        >
          Reset
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden touch-none select-none"
        style={{ height }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Targets */}
          {targets.map((t) => (
            <div
              key={t.id}
              className="absolute rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
              style={{
                transform: `translate3d(${t.x}px, ${t.y}px, 0)`,
                width: t.w,
                height: t.h,
              }}
            >
              <span className="text-xs font-semibold text-gray-500 tracking-wide">{t.label}</span>
            </div>
          ))}

          {/* Pieces */}
          {pieces.map((p) => {
            const isDragging = drag?.id === p.id;
            return (
              <div
                key={p.id}
                onPointerDown={(e) => onPointerDown(e, p.id)}
                className={[
                  "absolute rounded-2xl shadow-md flex items-center justify-center",
                  "border border-gray-200 bg-gradient-to-br from-indigo-100 to-pink-100",
                  "cursor-grab active:cursor-grabbing",
                  p.placed ? "opacity-90" : "opacity-100",
                  isDragging ? "ring-4 ring-indigo-200" : "",
                ].join(" ")}
                style={{
                  transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
                  width: p.w,
                  height: p.h,
                  transition: p.placed ? "transform 180ms ease" : "none",
                  zIndex: isDragging ? 50 : 10,
                  willChange: isDragging ? "transform" : "auto",
                }}
              >
                <span className="text-sm font-bold text-gray-700">{p.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Tip: Kéo <b>KHỐI 1</b> vào <b>ĐÍCH A</b>, <b>KHỐI 2</b> vào <b>ĐÍCH B</b>, <b>KHỐI 3</b> vào <b>ĐÍCH C</b>.
      </div>
    </div>
  );
}
