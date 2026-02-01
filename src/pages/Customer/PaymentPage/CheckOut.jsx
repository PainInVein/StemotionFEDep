export default function CheckOut() {
    return (
        <div className="min-h-screen md:max-h-screen bg-white">
            {/* Max height = 1 screen, nếu content dài sẽ cuộn trong main */}
            <main className="relative min-h-screen md:max-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
                {/* Overlay */}
                <div className="absolute md:h-screen inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/70 pointer-events-none" />

                <div className="h-auto relative mx-auto px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left section */}
                    <div className="space-y-6">
                        {/* Hero heading */}
                        <div className="flex flex-col gap-4 ml-20">
                            <h1 className="font-bold text-4xl md:text-6xl leading-[0.95] text-black">
                                Nâng cấp trải nghiệm học tập
                            </h1>

                            {/* Features list */}
                            <div className="space-y-2 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 flex-shrink-0">
                                        <i className="fa-solid fa-chart-line text-[24px] text-red-500" />
                                    </div>
                                    <p className="font-brilliant text-xl text-black font-medium">
                                        Truy cập toàn bộ nội dung học
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                        <i className="fa-solid fa-ban text-[24px] text-red-500" />
                                    </div>
                                    <p className="font-brilliant text-xl text-black font-medium">
                                        Không quảng cáo
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 flex-shrink-0">
                                        <img
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/84856b8eac8b73b97b6b462411dcbc7b36c263e0?width=62"
                                            alt=""
                                            className="w-8 h-8"
                                        />
                                    </div>
                                    <p className="font-brilliant text-xl text-black font-medium">
                                        Nội dung mới được cập nhật thường xuyên
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Illustration image */}
                        <div className="mt-8 md:mt-12">
                            <img
                                src="https://api.builder.io/api/v1/image/assets/TEMP/f4e820e2f9dbfd0df91c4737233f5d706d0262a3?width=1870"
                                alt="Học tập minh họa"
                                className="w-full max-w-2xl rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col items-center justify-center md:justify-start md:pt-32">
                        <div className="w-full max-w-md space-y-8">
                            <h2 className="font-brilliant text-3xl md:text-4xl text-black text-center font-medium">
                                Phương thức thanh toán
                            </h2>

                            <div className="space-y-6">
                                <button className="w-full px-2 md:px-5 py-2 md:py-5 border-2 border-black bg-white rounded-[54px] shadow-lg hover:shadow-xl transition-shadow">
                                    <span className="font-brilliant text-lg md:text-xl text-gray-custom font-medium">
                                        <i className="fa-regular fa-credit-card"></i> Thẻ tín dụng & thẻ ghi nợ
                                    </span>
                                </button>

                                <button className="w-full px-2 md:px-5 py-2 md:py-5 border-2 border-black bg-white rounded-[54px] shadow-lg hover:shadow-xl transition-shadow">
                                    <span className="font-brilliant text-lg md:text-xl text-gray-custom font-medium">
                                        <i className="fa-solid fa-qrcode"></i> Thanh toán bằng mã QR
                                    </span>
                                </button>
                            </div>

                            <div className="space-y-2 text-center opacity-70">
                                <p className="font-brilliant text-base text-black font-medium">
                                    Thanh toán định kỳ, hủy bất cứ lúc nào
                                </p>
                                <p className="font-brilliant text-sm text-black leading-relaxed">
                                    Gói đăng ký sẽ tự động gia hạn khi hết hạn. Bạn có thể tắt tự
                                    động gia hạn trong phần cài đặt hoặc hủy gói bất kỳ lúc nào.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
