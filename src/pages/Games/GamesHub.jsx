import React from "react";
import {
    getGamesByLessonIdService,
    submitGameResultService,
} from "../../services/games/games.service";

import CountingFishGame from "../Games/CountingFishGame";
import NumberMatchingGame from "../Games/NumberMatchingGame";
import ShapeMatchingGame from "../Games/ShapeMatchingGame";
import AdditionTo10Game from "./AdditionTo10Game";
import BigFishEatSmallGame from "./BigFishEatSmallGame";
import MathRacingGame from "./MathRacingGame";

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

function Chip({ children, className }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm",
                className
            )}
        >
            {children}
        </span>
    );
}

function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

function calcScore(correct, total) {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
}

export default function GamesHub({ lessonId, onClose }) {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [games, setGames] = React.useState([]);

    const [activeGame, setActiveGame] = React.useState(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitMsg, setSubmitMsg] = React.useState("");

    React.useEffect(() => {
        let alive = true;

        const run = async () => {
            try {
                setLoading(true);
                setError("");

                // ✅ dùng service -> trả về array games
                const list = await getGamesByLessonIdService(lessonId);

                if (!alive) return;
                setGames(Array.isArray(list) ? list : []);
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "Load games failed");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        };

        if (lessonId) run();
        else {
            setLoading(false);
            setError("lessonId is missing");
        }

        return () => {
            alive = false;
        };
    }, [lessonId]);

    const renderActiveGame = () => {
        if (!activeGame) return null;

        const cfg = safeJsonParse(activeGame?.configData, {}) || {};

        const commonProps = {
            game: activeGame,
            config: cfg,
            onExit: () => {
                setActiveGame(null);
                setSubmitMsg("");
            },
            onFinish: async ({ correctAnswers, totalQuestions, playDurations }) => {
                const score = calcScore(correctAnswers, totalQuestions);

                const userStr = localStorage.getItem("user");
                console.log("🔍 [DEBUG] userStr from localStorage:", userStr);

                const user = userStr ? JSON.parse(userStr) : null;
                console.log("🔍 [DEBUG] parsed user:", user);

                // ✅ localStorage có studentId (chữ thường) vì JSON serialization từ C# API tự động convert sang camelCase
                const studentId = user?.studentId;
                console.log("🔍 [DEBUG] studentId:", studentId);

                if (!studentId) {
                    setSubmitMsg("❌ Không tìm thấy thông tin học sinh. Vui lòng đăng nhập lại.");
                    return;
                }

                try {
                    setSubmitting(true);
                    setSubmitMsg("");

                    const payload = {
                        studentId,
                        gameId: activeGame.gameId,
                        score,
                        correctAnswers,
                        totalQuestions,
                        playDurations,
                    };

                    console.log("🔍 [DEBUG] Submitting game result payload:", payload);

                    await submitGameResultService(payload);

                    setSubmitMsg("✅ Đã lưu kết quả chơi game!");
                    console.log("✅ [DEBUG] Game result submitted successfully");
                } catch (e) {
                    console.error("❌ [DEBUG] Error submitting game result:", e);
                    console.error("❌ [DEBUG] Error details:", e?.response?.data || e?.message);
                    setSubmitMsg(e?.message || "❌ Lưu kết quả thất bại");
                } finally {
                    setSubmitting(false);
                }
            },
            submitting,
            submitMsg,
        };

        const code = (activeGame?.gameCode || "").toLowerCase();

        if (code === "counting_fish") return <CountingFishGame {...commonProps} />;
        if (code === "number_matching") return <NumberMatchingGame {...commonProps} />;
        if (code === "shape_matching") return <ShapeMatchingGame {...commonProps} />;
        if (code === "addition_to_10") return <AdditionTo10Game {...commonProps} />;
        if (code === "big_fish_eat_small") return <BigFishEatSmallGame {...commonProps} />;
        if (code === "math_racing") return <MathRacingGame {...commonProps} />

        return (
            <Card className="p-6">
                <div className="text-sm font-semibold text-slate-900">Chưa hỗ trợ game</div>
                <div className="mt-2 text-sm text-slate-600">
                    gameCode: <span className="font-mono">{activeGame?.gameCode}</span>
                </div>
                <button
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    onClick={() => setActiveGame(null)}
                    type="button"
                >
                    Quay lại
                </button>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Mini Games
                        </div>
                        <div className="mt-1 text-lg font-extrabold text-slate-900">
                            Chọn game để bắt đầu
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Chip>{games.length} games</Chip>
                        <button
                            onClick={onClose}
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </Card>

            {/* Body */}
            {loading && (
                <Card className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 w-40 rounded bg-slate-200" />
                        <div className="h-3 w-full rounded bg-slate-200" />
                        <div className="h-3 w-5/6 rounded bg-slate-200" />
                    </div>
                    <div className="mt-4 text-sm text-slate-600">Đang tải danh sách game…</div>
                </Card>
            )}

            {!loading && error && (
                <Card className="border-rose-200 bg-rose-50/60 p-6">
                    <div className="text-sm font-semibold text-rose-700">Có lỗi</div>
                    <div className="mt-1 text-sm text-rose-700/90">{error}</div>
                </Card>
            )}

            {!loading && !error && activeGame && renderActiveGame()}

            {!loading && !error && !activeGame && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {games.map((g) => (
                        <Card key={g.gameId} className="overflow-hidden">
                            <div className="aspect-[16/9] w-full bg-slate-100">
                                {g.thumbnailUrl ? (
                                    <img
                                        src={g.thumbnailUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-extrabold text-slate-900">
                                            {g.name}
                                        </div>
                                        <div className="mt-1 line-clamp-2 text-xs text-slate-600">
                                            {g.description}
                                        </div>
                                    </div>
                                    <Chip className="shrink-0">{g.gameCode}</Chip>
                                </div>

                                <button
                                    onClick={() => {
                                        setSubmitMsg("");
                                        setActiveGame(g);
                                    }}
                                    type="button"
                                    className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99]"
                                >
                                    Bắt đầu
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
