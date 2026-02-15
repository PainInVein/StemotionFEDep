import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Card from "../../common/Card";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StudyTimeChart = ({ data }) => {
    if (!data) return null;

    const dates = Object.keys(data).map(date => new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }));
    const times = Object.values(data);
    const totalTime = times.reduce((a, b) => a + b, 0);

    // Empty state check
    const isEmpty = totalTime === 0;

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: "Thời gian học (phút)",
                data: times,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(79, 70, 229, 0.9)"); // Indigo-600
                    gradient.addColorStop(1, "rgba(99, 102, 241, 0.2)"); // Indigo-500
                    return gradient;
                },
                borderRadius: 8,
                barPercentage: 0.5,
                hoverBackgroundColor: "#4338ca", // Indigo-700
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                padding: 14,
                cornerRadius: 12,
                titleFont: { family: 'Inter', size: 14, weight: '600' },
                bodyFont: { family: 'Inter', size: 13 },
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.raw} phút hôm nay`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                    borderDash: [5, 5],
                    drawBorder: false
                },
                ticks: {
                    font: { family: 'Inter', size: 12 },
                    color: '#9ca3af',
                    padding: 10
                },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 12, weight: '500' },
                    color: '#6b7280',
                    padding: 10
                },
                border: { display: false }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <Card title="Thời gian học (7 ngày qua)" className="h-full shadow-md border-gray-100">
            {isEmpty ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <i className="fa-solid fa-clock text-gray-300 text-2xl"></i>
                    </div>
                    <p className="text-gray-500 font-medium">Chưa có dữ liệu học tập</p>
                    <p className="text-gray-400 text-sm mt-1">Hãy khuyến khích con bạn bắt đầu học!</p>
                </div>
            ) : (
                <div className="h-64 relative">
                    <Bar options={options} data={chartData} />
                </div>
            )}

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-5">
                <span className="flex items-center gap-2">
                    <i className="fa-regular fa-calendar text-gray-400"></i>
                    Tổng tuần này
                </span>
                <span className="font-bold text-gray-900 text-lg">
                    {totalTime} <span className="text-xs text-gray-500 font-normal">phút</span>
                </span>
            </div>
        </Card>
    );
};

export default StudyTimeChart;
