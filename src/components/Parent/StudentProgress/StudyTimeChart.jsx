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
import { Card } from "antd";

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

    const dates = Object.keys(data).map(date => new Date(date).toLocaleDateString());
    const times = Object.values(data);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: "Study Time (minutes)",
                data: times,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Study Time Last 7 Days',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <Card title="Study Time (Last 7 Days)" variant="borderless" className="h-full">
            <div style={{ height: "300px" }}>
                <Bar options={options} data={chartData} />
            </div>
        </Card>
    );
};

export default StudyTimeChart;
