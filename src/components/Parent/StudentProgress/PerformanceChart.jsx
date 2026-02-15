import React from "react";
import Card from "../../common/Card";
import CircularProgress from "../../common/CircularProgress";

const PerformanceChart = ({ data }) => {
    if (!data) return null;

    const subjects = data.subjectPerformance ? Object.entries(data.subjectPerformance) : [];
    const hasSubjects = subjects.length > 0;

    // Sort subjects by score descending mostly
    if (hasSubjects) {
        subjects.sort((a, b) => b[1] - a[1]);
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-orange-500';
        return 'text-rose-500';
    };

    const getBgColor = (score) => {
        if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (score >= 60) return 'bg-blue-50 text-blue-700 border-blue-100';
        if (score >= 40) return 'bg-orange-50 text-orange-700 border-orange-100';
        return 'bg-rose-50 text-rose-700 border-rose-100';
    };

    const getLabel = (score) => {
        if (score >= 80) return 'Xuất sắc';
        if (score >= 60) return 'Tốt';
        if (score >= 40) return 'Trung bình';
        return 'Yếu';
    };

    return (
        <Card title="Hiệu suất học tập" className="h-full shadow-md border-gray-100 flex flex-col">
            <div className={`flex-1 ${!hasSubjects ? 'flex items-center justify-center' : ''}`}>
                {!hasSubjects ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-solid fa-chart-pie text-gray-300 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium">Chưa có dữ liệu môn học</p>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                            Biểu đồ sẽ hiển thị khi học sinh hoàn thành các bài học.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {subjects.map(([subject, score]) => (
                            <div key={subject} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-blue-50 transition-all bg-white group select-none">
                                <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    <CircularProgress
                                        value={score}
                                        size={52}
                                        strokeWidth={5}
                                        color={getScoreColor(score)}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-gray-800 break-words line-clamp-2" title={subject}>
                                        {subject}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${getBgColor(score)}`}>
                                            {getLabel(score)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Strengths and Weaknesses Section - Always show if available, even if no subjects */}
            {(data.strengths?.length > 0 || data.weaknesses?.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">
                    {data.strengths?.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-star text-yellow-400"></i> Thế mạnh
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.strengths.map((item, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-100 shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.weaknesses?.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-arrow-trend-up text-blue-500"></i> Cần cải thiện
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {data.weaknesses.map((item, idx) => (
                                    <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-orange-100 shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PerformanceChart;
