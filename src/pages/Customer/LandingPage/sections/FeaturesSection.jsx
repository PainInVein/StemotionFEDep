// src/pages/LandingPage/sections/FeaturesSection.jsx
import React, { lazy, Suspense } from "react";
import { Card } from "antd";
import { FaLightbulb, FaCode, FaRocket } from "react-icons/fa";
import { HiOutlineBolt, HiBolt } from "react-icons/hi2";

import Backround_01 from "../../../../assets/bg-01.webp";
import math from "../../../../assets/math.webp";

// ✅ Lazy load Lesson
const Lesson = lazy(() => import("../../../../components/common/Lesson"));

export default function FeaturesSection() {
    const features = [
        {
            icon: FaLightbulb,
            title: "Học tương tác",
            description: "Khám phá khoa học qua hình ảnh và hoạt động thực hành",
            gradient: "from-purple-500 to-blue-500",
        },
        {
            icon: FaCode,
            title: "Lập trình trực quan",
            description: "Học lập trình qua giao diện đơn giản, dễ hiểu",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: FaRocket,
            title: "Tiến bộ từng bước",
            description: "Nắm vững từng khái niệm trước khi chuyển sang bài tiếp theo",
            gradient: "from-orange-500 to-yellow-500",
        },
    ];

    const progress = {
        lesson1: "done",
        lesson2: "doing",
        lesson3: "not_started",
    };

    return (
        <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center p-10 rounded-xl" style={{ backgroundImage: `url(${Backround_01})` }}>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white">Tại sao chọn STEMotion?</h2>
                    <p className="text-gray-500">Phương pháp học hiện đại và hiệu quả</p>
                </div>

                {/* Block 1 (giữ nguyên layout của bạn nếu muốn thêm hình ở đây) */}
                <div className="flex flex-col md:flex-row bg-white">
                    <div className="flex-1 p-6 md:p-10 flex justify-center">
                        <img src={math}
                            alt="Minh hoạ bài học toán học"
                            width={700}
                            height={500}
                            className="w-full max-w-xs md:max-w-full"
                            loading="lazy"
                            decoding="async" />
                    </div>

                    <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left">
                        <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Học tương tác</h2>
                        <p className="text-base sm:text-lg">Khám phá khoa học qua hình ảnh và hoạt động thực hành</p>
                    </div>
                </div>

                {/* Block 2: Tiến bộ từng bước */}
                <div className="flex flex-col md:flex-row bg-gradient-to-br from-white to-blue-100">
                    <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left">
                        <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Tiến bộ từng bước</h2>
                        <p className="text-base sm:text-lg">Nắm vững từng khái niệm trước khi chuyển sang bài tiếp theo</p>
                    </div>

                    <div className="flex-1 p-6 md:p-10 flex flex-col items-center md:items-start space-y-6">
                        <Suspense fallback={<div className="text-gray-500">Đang tải lộ trình...</div>}>
                            <div>
                                <Lesson status={progress.lesson1} to="#" />
                            </div>
                            <div className="md:ml-60">
                                <Lesson status={progress.lesson2} to="#" />
                            </div>
                            <div>
                                <Lesson status={progress.lesson3} to="#" />
                            </div>
                        </Suspense>
                    </div>
                </div>

                {/* Block 3: Giữ vững động lực (giữ nguyên) */}
                <div className="flex flex-col md:flex-row bg-gray-100">
                    <div className="flex-1 px-6 py-16 md:px-10 md:py-40 flex justify-center md:justify-start">
                        <div className="flex gap-4 sm:gap-6">
                            <div className="flex-col justify-center items-center translate-y-10 md:translate-y-20">
                                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-full flex justify-center items-center">
                                    <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] bg-white rounded-full flex justify-center items-center">
                                        <HiOutlineBolt className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] text-[#7E82E4]" />
                                    </div>
                                </div>
                                <p className="text-[#7E82E4] font-bold text-center mt-2">T2</p>
                            </div>

                            <div className="flex-col justify-center items-center translate-y-0">
                                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-full flex justify-center items-center">
                                    <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] bg-white rounded-full flex justify-center items-center">
                                        <HiOutlineBolt className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] text-[#7E82E4]" />
                                    </div>
                                </div>
                                <p className="text-[#7E82E4] font-bold text-center mt-2">T3</p>
                            </div>

                            <div className="flex-col justify-center items-center -translate-y-10 md:-translate-y-20">
                                <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] bg-[#C2C2C2] rounded-full flex justify-center items-center">
                                    <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] bg-white rounded-full flex justify-center items-center">
                                        <HiBolt className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] text-[#E5E5E5]" />
                                    </div>
                                </div>
                                <p className="text-[#C2C2C2] font-bold text-center mt-2">T4</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center space-y-4 md:space-y-6 text-center md:text-left">
                        <h2 className="font-semibold text-3xl sm:text-4xl md:text-6xl">Giữ vững động lực</h2>
                        <p className="text-base sm:text-lg">
                            Kết thúc mỗi ngày thông minh hơn với những bài học thú vị, tính năng thi đua hấp dẫn và lời khích lệ mỗi ngày
                        </p>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="grid md:grid-cols-3 gap-8 mt-5">
                    {features.map((feature, index) => (
                        <Card key={index} className="overflow-hidden group hover:shadow-2xl transition-all p-0" styles={{ body: { padding: 0 } }}>
                            <div className={`bg-gradient-to-br ${feature.gradient} p-12 flex items-center justify-center`}>
                                <feature.icon className="text-7xl text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
