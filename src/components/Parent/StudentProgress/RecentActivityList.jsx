import React from "react";
import Card from "../../common/Card";

const RecentActivityList = ({ activities }) => {
    return (
        <Card title="Hoạt động gần đây" className="h-full shadow-md border-gray-100">
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-regular fa-folder-open text-2xl text-gray-300"></i>
                        </div>
                        <p className="text-sm font-medium">Chưa có hoạt động nào</p>
                    </div>
                ) : (
                    activities.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all bg-white group cursor-default">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${item.activityType === "Game" ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100 group-hover:scale-110" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110"
                                }`}>
                                <i className={`fa-solid ${item.activityType === "Game" ? "fa-gamepad" : "fa-book-open"} text-lg`}></i>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-800 truncate" title={item.activityName}>
                                    {item.activityName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 font-medium">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 border border-gray-200">
                                        {new Date(item.activityDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span>•</span>
                                    <span>{item.durationMinutes} phút</span>
                                </div>
                            </div>

                            <div className="text-right">
                                {item.score > 0 ? (
                                    <div className="flex flex-col items-end">
                                        <span className={`text-base font-extrabold ${item.score >= 80 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                            {item.score}
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Điểm</span>
                                    </div>
                                ) : (
                                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${item.status === "Completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-orange-50 text-orange-700 border-orange-100"
                                        }`}>
                                        {item.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {activities.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto hover:underline">
                        Xem tất cả lịch sử <i className="fa-solid fa-arrow-right-long"></i>
                    </button>
                </div>
            )}
        </Card>
    );
};

export default RecentActivityList;
