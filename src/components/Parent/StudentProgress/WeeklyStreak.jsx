import React from "react";
import Card from "../../common/Card";

const WeeklyStreak = ({ studyTimeData }) => {
    // Helper to get dates for the current week (Monday to Sunday)
    const getCurrentWeekDays = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week + 1 (Monday)
        // If today is Sunday (0), curr.getDay() is 0, so we need to subtract 6 to get previous Monday
        const mondayOffset = curr.getDay() === 0 ? -6 : 1;
        const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + mondayOffset));

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(firstDay);
            day.setDate(firstDay.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const weekDays = getCurrentWeekDays();
    const today = new Date().toDateString();

    const getDayLabel = (date) => {
        const day = date.getDay();
        if (day === 0) return "CN";
        return `T${day + 1}`;
    };

    const isActive = (date) => {
        if (!studyTimeData) return false;
        // Check if there is any study time for this date
        // studyTimeData keys might be ISO strings or similar
        const dateString = date.toISOString().split('T')[0];

        // Find matching key in studyTimeData (keys might vary in format)
        const hasActivity = Object.keys(studyTimeData).some(key => key.startsWith(dateString) && studyTimeData[key] > 0);
        return hasActivity;
    };

    // Calculate current streak for display (simple logic based on available data)
    // For a real "current streak" number we should use the API's `learningStreak` from overview, 
    // but here we are visualizing the week.

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-indigo-50 hover:border-indigo-100 transition-all">
            <h3 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                Tuần {getWeekNumber(new Date())}
            </h3>

            <div className="flex justify-between items-center px-2">
                {weekDays.map((date, index) => {
                    const active = isActive(date);
                    const isToday = date.toDateString() === today;
                    const isFuture = date > new Date();

                    return (
                        <div key={index} className="flex flex-col items-center gap-3 group">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${active
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent shadow-lg shadow-indigo-200 transform scale-110"
                                        : "bg-white border-gray-100"
                                    }
                                    ${isToday && !active ? "border-indigo-300 animate-pulse" : ""}
                                `}
                            >
                                {active ? (
                                    <i className="fa-solid fa-bolt text-white text-xl"></i>
                                ) : (
                                    <div className={`w-10 h-10 rounded-full ${isFuture ? "bg-gray-50" : "bg-gray-100"}`}></div>
                                )}
                            </div>
                            <span
                                className={`text-sm font-bold ${isToday ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                {getDayLabel(date)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Helper to get week number
const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

export default WeeklyStreak;
