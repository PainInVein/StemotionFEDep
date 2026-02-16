import React, { useEffect, useState } from "react";
import { getLeaderboardService } from "../../../services/games/games.service";
import CupIcon from "../../common/CupIcon";

export default function LeaderboardModal({ onClose }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await getLeaderboardService(10); // Top 10
                setLeaderboard(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
                setError("Không thể tải bảng xếp hạng lúc này.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/30 p-3 rounded-full mb-3 backdrop-blur-sm shadow-sm ring-4 ring-white/20">
                            <CupIcon className="w-10 h-10 text-white drop-shadow-md" />
                        </div>
                        <h2 className="text-2xl font-bold text-white drop-shadow-sm font-brilliant">
                            Bảng Xếp Hạng
                        </h2>
                        <p className="text-white/90 text-sm font-medium mt-1">Top 10 Nhà Leo Núi Xuất Sắc</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 text-sm">Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center text-rose-500 px-6">
                            <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                            </div>
                            <p>{error}</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            <p>Chưa có dữ liệu xếp hạng.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {leaderboard.map((item, index) => {
                                let rankColor = "bg-slate-100 text-slate-600";
                                if (index === 0) rankColor = "bg-yellow-100 text-yellow-600 border border-yellow-200";
                                if (index === 1) rankColor = "bg-slate-200 text-slate-600 border border-slate-300";
                                if (index === 2) rankColor = "bg-amber-100 text-amber-700 border border-amber-200";

                                return (
                                    <div key={item.studentId} className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-white to-slate-50/50' : ''}`}>
                                        {/* Rank */}
                                        <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full font-bold text-sm ${rankColor}`}>
                                            {index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <div className="shrink-0 relative">
                                            <img
                                                src={item.avatarUrl || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${item.studentName}`}
                                                alt={item.studentName}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-slate-100 object-cover"
                                            />
                                            {index === 0 && (
                                                <div className="absolute -top-3 -right-2 text-xl filter drop-shadow-sm">👑</div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-800 truncate text-sm sm:text-base">
                                                {item.studentName}
                                            </h3>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <span>Học viên Siêu Đẳng</span>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right shrink-0">
                                            <div className="font-extrabold text-indigo-600 text-base sm:text-lg">
                                                {item.totalScore?.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">Điểm</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                    <p className="text-xs text-slate-400">
                        Bảng xếp hạng được cập nhật theo thời gian thực 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}
