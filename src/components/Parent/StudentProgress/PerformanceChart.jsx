import React from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Card } from "antd";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const PerformanceChart = ({ data }) => {
    if (!data || !data.subjectPerformance) return null;

    const subjects = Object.keys(data.subjectPerformance);
    const scores = Object.values(data.subjectPerformance);

    const chartData = {
        labels: subjects,
        datasets: [
            {
                label: "Performance Score",
                data: scores,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <Card title="Subject Performance" bordered={false} className="h-full">
            <div style={{ height: "300px", display: "flex", justifyContent: "center" }}>
                <Radar data={chartData} options={options} />
            </div>
            <div className="mt-4">
                <strong>Strengths:</strong> {data.strengths.join(", ") || "N/A"}
            </div>
            <div className="mt-2">
                <strong>Weaknesses:</strong> {data.weaknesses.join(", ") || "None"}
            </div>
        </Card>
    );
};

export default PerformanceChart;
