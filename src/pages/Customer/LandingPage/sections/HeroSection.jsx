// src/pages/LandingPage/sections/HeroSection.jsx
import React, { lazy, Suspense } from "react";
// import { Card } from "antd";
import { FaRobot, FaCode, FaRocket, FaLightbulb, FaRegHeart, FaRegUserCircle } from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";

// ✅ Lazy load modal (mở modal mới tải)
const LoginModal = lazy(() => import("../../LoginPage/LoginPage"));

export default function HeroSection({ openLogin, modalConfig, closeLogin }) {
    return (
        <section className="relative py-20 md:py-32 px-6 overflow-hidden bg-gradient-hero">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left space-y-6">
                        <h1 className="text-4xl md:text-6xl font-semibold text-foreground leading-tight">
                            Học, chơi và chinh phục STEM cùng STEMotion!
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground">
                            Bài học khoa học và toán học tương tác qua việc học dựa trên sự tò mò.
                        </p>

                        <div className="space-y-4 pt-4">
                            <p className="text-sm font-medium text-muted-foreground">Chọn lộ trình của bạn:</p>

                            <div className="flex flex-col sm:flex-row md:flex-row gap-4 sm:justify-center h-auto">
                                <button
                                    type="button"
                                    onClick={() => openLogin("student")}
                                    className="w-full text-left"
                                >
                                    {/* <Card className="border-2 border-indigo-100 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group rounded-xl"> */}
                                    <div className="border-2 border-indigo-100 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group rounded-xl bg-white">
                                        <div className="p-4 text-center h-fix">
                                            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                                <FaRegUserCircle className="text-2xl text-indigo-600" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">Đăng nhập học sinh</h3>
                                            <p className="text-sm text-gray-500">Truy cập lộ trình học tập của bạn</p>
                                        </div>
                                    </div>
                                    {/* </Card> */}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => openLogin("parent")}
                                    className="w-full text-left"
                                >
                                    {/* <Card className="border-2 border-pink-100 hover:border-pink-500 hover:shadow-lg transition-all cursor-pointer group rounded-xl"> */}
                                    <div className="border-2 border-pink-100 hover:border-pink-500 hover:shadow-lg transition-all cursor-pointer group rounded-xl bg-white">
                                        <div className="p-4 text-center h-fix">
                                            <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                                <FaRegHeart className="text-2xl text-pink-600" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">Đăng nhập phụ huynh</h3>
                                            <p className="text-sm text-gray-500">Theo dõi tiến độ học tập của con</p>
                                        </div>
                                    </div>
                                    {/* </Card> */}
                                </button>
                            </div>

                            {/* ✅ chỉ mount khi mở + suspense */}
                            {modalConfig.isOpen && (
                                <Suspense
                                    fallback={
                                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                            <div className="bg-white rounded-xl px-6 py-4 shadow-lg">Đang tải đăng nhập...</div>
                                        </div>
                                    }
                                >
                                    <LoginModal isOpen={modalConfig.isOpen} onClose={closeLogin} role={modalConfig.role} />
                                </Suspense>
                            )}
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-full max-w-md">
                            <div className="relative bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-3xl p-8">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
                                        <FaRobot className="text-5xl text-indigo-600 mb-2" />
                                        <div className="h-2 bg-gray-100 rounded w-3/4 mb-1" />
                                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                                    </div>

                                    <div className="bg-orange-400 rounded-2xl p-4 flex items-center justify-center shadow-md">
                                        <FaLightbulb className="text-4xl text-white" />
                                    </div>

                                    <div className="bg-indigo-500 rounded-2xl p-4 flex items-center justify-center shadow-md">
                                        <FaCode className="text-4xl text-white" />
                                    </div>

                                    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
                                        <FaRocket className="text-5xl text-pink-500 mb-2" />
                                        <div className="h-2 bg-gray-100 rounded w-2/3 mb-1" />
                                        <div className="h-2 bg-gray-100 rounded w-1/3" />
                                    </div>
                                </div>

                                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
                                    <HiOutlineSparkles className="text-2xl text-white" />
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-indigo-600 rounded-full p-3 shadow-lg animate-pulse">
                                    <HiOutlineLightningBolt className="text-2xl text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
