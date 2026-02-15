import React from "react";
import StatCard from "../../common/StatCard";

const OverviewCards = ({ data }) => {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Tổng bài học"
                value={data.totalLessons}
                icon="fa-book-open"
                iconColor="text-blue-600"
                iconBg="bg-blue-50"
            />
            <StatCard
                title="Đã hoàn thành"
                value={data.completedLessons}
                suffix={`/ ${data.totalLessons}`}
                icon="fa-circle-check"
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
            />
            <StatCard
                title="Chuỗi ngày học"
                value={data.learningStreak}
                suffix="ngày"
                icon="fa-fire"
                iconColor="text-orange-500"
                iconBg="bg-orange-50"
            />
            <StatCard
                title="Tổng điểm"
                value={data.totalPoints}
                icon="fa-trophy"
                iconColor="text-yellow-500"
                iconBg="bg-yellow-50"
            />
        </div>
    );
};

export default OverviewCards;
