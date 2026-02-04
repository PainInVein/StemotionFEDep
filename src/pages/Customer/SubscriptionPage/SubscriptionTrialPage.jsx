import React from "react";
import Button from "../../../components/common/Button";

function Badge({ children, variant = "cool" }) {
    const styles =
        variant === "cool"
            ? "bg-indigo-100 text-indigo-700"
            : "bg-amber-100 text-amber-800";
    return (
        <span
            className={`inline-flex items-center rounded-md px-3 py-1 text-[11px] font-semibold tracking-wide ${styles}`}
        >
            {children}
        </span>
    );
}

export default function SubscriptionTrialPage() {
    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4">
            <div className="container-pad pt-16 pb-20 md:pt-20 md:pb-28">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-zinc-900">
                        Cách gói dùng thử{" "}
                        <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                            Premium
                        </span>
                        <br />
                        hoạt động
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-zinc-600">
                        Không ràng buộc. Bạn có thể hủy bất cứ lúc nào.
                    </p>
                </div>

                {/* Timeline pill */}
                <div className="mt-12">
                    <div className="relative">
                        {/* pill track */}
                        <div className="h-12 w-full rounded-full border border-zinc-300/80 bg-white/55 backdrop-blur" />

                        {/* center label */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-between md:justify-center">
                            <span className="text-sm font-semibold text-zinc-600 pl-20 md:pl-0 sm:pl-50">
                                1 Khóa học miễn phí
                            </span>
                        </div>

                        {/* right CTA on track */}
                        <div className="absolute inset-y-0 right-1 flex items-center">
                            {/* <GradientButton className="h-10 px-6 py-0">
                                Bắt đầu đăng ký
                            </GradientButton> */}
                            <Button size="sm" className="h-10 px-10 py-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300">
                                Bắt đầu đăng ký
                            </Button>
                        </div>
                    </div>

                    {/* under-track markers + descriptions */}
                    <div className="relative mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
                        {/* Left block */}
                        <div className="relative">
                            <div className="mb-3">
                                <Badge variant="cool">BÀI HỌC ĐẦU TIÊN</Badge>
                            </div>
                            <h3 className="text-base font-bold text-zinc-900">
                                Mở khóa Premium
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                Nhận quyền truy cập không giới hạn vào tất cả các khóa học tương
                                tác và nhiều nội dung hấp dẫn khác.
                            </p>
                        </div>

                        {/* Right block */}
                        <div className="relative sm:text-left">
                            <div className="mb-3 sm:flex sm:justify-end">
                                <Badge variant="warm">BÀI HỌC CUỐI CÙNG</Badge>
                            </div>
                            <h3 className="text-base font-bold text-zinc-900 sm:text-right">
                                Hết thời gian dùng thử
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-right">
                                Tài khoản của bạn sẽ được tự động gia hạn gói Premium. Bạn có thể
                                hủy bất cứ lúc nào trước khi bị tính phí.
                            </p>
                        </div>
                    </div>

                    {/* Middle CTA */}
                    <div className="mt-12 flex flex-col items-center gap-3">
                        <div className="w-auto mx-auto">
                            <Button size="sm" className="h-10 px-10 py-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300">
                                Bắt đầu 1 bài học dùng thử miễn phí
                            </Button>
                        </div>
                        <p className="text-xs text-zinc-500">
                            <span className="font-bold text-black">₫100.000/tháng</span> sau khi dùng gói trải nghiệm (tính phí hàng năm)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
