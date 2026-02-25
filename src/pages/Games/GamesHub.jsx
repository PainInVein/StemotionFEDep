import React from "react";
import {
    getGamesByLessonIdService,
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

function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

export default function GamesHub({ lessonId, onClose }) {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [games, setGames] = React.useState([]);

    const [activeGame, setActiveGame] = React.useState(null);

    React.useEffect(() => {
        let alive = true;

        const run = async () => {
            try {
                setLoading(true);
                setError("");

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
            },
            onFinish: () => {
                // No-op: game result saving removed
            },
        };

        const code = (activeGame?.gameCode || "").toLowerCase();

        if (code === "counting_fish") return <CountingFishGame {...commonProps} />;
        if (code === "number_matching") return <NumberMatchingGame {...commonProps} />;
        if (code === "shape_matching") return <ShapeMatchingGame {...commonProps} />;
        if (code === "addition_to_10") return <AdditionTo10Game {...commonProps} />;
        if (code === "big_fish_eat_small") return <BigFishEatSmallGame {...commonProps} />;
        if (code === "math_racing") return <MathRacingGame {...commonProps} />

        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                    🕹️
                </div>
                <h3 className="text-xl font-bold text-slate-800">Chưa hỗ trợ game này</h3>
                <p className="mt-2 text-slate-500 font-mono text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                    gameCode: {activeGame?.gameCode}
                </p>
                <button
                    className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    onClick={() => setActiveGame(null)}
                    type="button"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    };

    if (activeGame) {
        return renderActiveGame();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                            Mini Games Zone
                        </span>
                        {games.length > 0 && (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                                {games.length} trò chơi có sẵn
                            </span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                        Chọn Game Để Bắt Đầu 🎮
                    </h2>
                    <p className="mt-2 text-slate-500">
                        Vừa học vừa chơi, tích lũy điểm thưởng và leo bảng xếp hạng!
                    </p>
                </div>

                <button
                    onClick={onClose}
                    type="button"
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm hover:shadow-md"
                >
                    <span>Đóng</span>
                    <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform duration-300"></i>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-4 h-64 border border-slate-100 shadow-sm animate-pulse">
                            <div className="w-full h-32 bg-slate-100 rounded-[1.5rem] mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-50 rounded-full w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 bg-rose-50/50 rounded-[2rem] border border-rose-100 text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-2xl mb-4">
                        ⚠️
                    </div>
                    <h3 className="text-lg font-bold text-rose-700">Không tải được danh sách game</h3>
                    <p className="text-rose-600/80 mt-1">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {games.map((g) => (
                        <div
                            key={g.gameId}
                            onClick={() => {
                                setActiveGame(g);
                            }}
                            className="group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                {g.thumbnailUrl ? (
                                    <img
                                        src={g.thumbnailUrl}
                                        alt={g.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                        <span className="text-4xl">🎮</span>
                                    </div>
                                )}
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/50 shadow-2xl">
                                        <i className="fa-solid fa-play text-2xl ml-1"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                                    {g.name}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10 mb-6">
                                    {g.description || "Hãy thử thách bản thân với trò chơi này nhé!"}
                                </p>

                                <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200 flex items-center justify-center gap-2">
                                    <span>Bắt đầu chơi</span>
                                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
