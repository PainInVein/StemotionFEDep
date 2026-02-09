import React, { useState } from "react";
import Button from "../../../components/common/Button";
import { FlexibilityIcon, AchievementIcon, TargetIcon, JourneyIcon, CheckCircleIcon, ChartIcon, NoAdsIcon, StarIcon, MascotSVG } from "../../../components/ui/FeatureIcons";
import { Link } from "react-router-dom";

export default function SubscriptionPage() {

    const PLANS = [
        {
            id: "annual",
            title: "Hàng năm",
            price: "75.000",
            suffix: "/tháng",
            popular: true,
            featured: true,
        },
        {
            id: "monthly",
            title: "Hàng tháng",
            price: "100.000",
            suffix: "/tháng",
            popular: false,
            featured: false,
        },
    ];

    const [selectedPlan, setSelectedPlan] = useState("annual");

    return (
        <div className="min-h-screen bg-white">

            {/* Hero/Pricing Section */}
            <section className="md:max-h-screen max-h-auto relative py-10 overflow-hidden h-full">
                <div className="pointer-events-none absolute inset-0
                            bg-[linear-gradient(135deg,rgba(178,165,255,0.22)_0%,rgba(255,159,178,0.14)_45%,rgba(255,208,155,0.20)_100%)]
                            [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_60%,black_100%)]
                            " />
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-main"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white"></div>
                </div>
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 px-4">
                            <span className="font-semibold">
                                Mở khóa trải nghiệm đầy đủ cùng
                                <br />
                                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">STEMotion Premium</span>
                            </span>
                        </h1>
                        <p className="text-black text-base md:text-xl leading-[30px] max-w-2xl mx-auto px-4">
                            Với gói Premium, bạn sẽ có toàn quyền truy cập vào tất cả các khóa học và nhiều tính năng đặc biệt khác!
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mb-12 px-4">
                        {PLANS.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                selected={selectedPlan === plan.id}
                                onSelect={() => setSelectedPlan(plan.id)}
                            />
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center mb-8 w-[50%] mx-auto">
                        <Link to="/subscription-trial" >
                            <Button size="md" className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300">Cách Premium hoạt động</Button>
                        </Link>
                    </div>

                    <p className="text-center text-sm opacity-70 max-w-md mx-auto">
                        Thanh toán một lần cho cả năm. Tự động gia hạn, có thể hủy bất kỳ lúc nào. Bạn cũng có thể tắt tính năng tự gia hạn trong phần cài đặt.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-[#F8F8F8] md:max-h-screen max-h-auto h-full">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Nâng tầm việc học cùng Premium
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Feature List */}
                        <div className="flex-1">
                            <FeatureItem icon={<FlexibilityIcon className="w-12 h-12" />} title="Học hiệu quả hơn" />
                            <FeatureItem icon={<AchievementIcon className="w-12 h-12" />} title="Làm chủ các kiến thức nền tảng" />
                            <FeatureItem icon={<TargetIcon className="w-12 h-12" />} title="Ứng dụng ngay vào thực tế" />
                            <FeatureItem icon={<JourneyIcon className="w-12 h-12" />} title="Duy trì tiến độ học mỗi ngày" />
                        </div>

                        {/* Phone Mockup */}
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-[520px]">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    {/* Phone */}
                                    <div className="shrink-0 w-[220px] sm:w-[240px] md:w-[260px]">
                                        <div className="relative rounded-[28px] border-2 border-black shadow-[8px_8px_0_0_#000] overflow-hidden bg-white aspect-[281/500]">
                                            <div className="p-5 h-full flex flex-col">
                                                <div className="text-center mb-3">
                                                    <p className="text-xs text-gray-500">Output</p>
                                                    <div className="inline-flex items-center gap-2 mt-2 px-2 py-1 bg-purple-100 rounded">
                                                        <span className="text-sm">🎮 11 left</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 bg-[#1a1d3a] rounded-lg p-3 flex items-center justify-center">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {Array(9)
                                                            .fill(0)
                                                            .map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-10 h-10 md:w-11 md:h-11 bg-purple-500 rounded border-2 border-purple-300"
                                                                />
                                                            ))}
                                                    </div>
                                                </div>

                                                <div className="mt-3 space-y-2">
                                                    <div className="px-3 py-2 bg-green-100 rounded text-sm">while gems remain ✓</div>
                                                    <div className="px-3 py-2 bg-green-100 rounded text-sm">if tile ahead ✓</div>
                                                    <div className="px-3 py-2 bg-green-100 rounded text-sm">if front is visited ✓</div>
                                                    <div className="px-3 py-2 bg-gray-100 rounded text-sm">turn right</div>
                                                </div>

                                                <button className="mt-3 w-full py-2.5 bg-[#2d2d2d] text-white rounded-lg">
                                                    Check
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold mb-2">Học tương tác – Hiểu thật sâu</h3>
                                        <p className="text-sm text-gray-600">
                                            Truy cập không giới hạn hơn 40+ khóa học tương tác với phản hồi theo thời gian thực và giải thích trực quan,
                                            giúp việc học trở nên nhanh – dễ – thú vị hơn bao giờ hết.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Benefits Comparison Table */}
            <section className="relative py-20 overflow-hidden md:max-h-screen max-h-auto h-full">
                <div className="pointer-events-none absolute inset-0
                            bg-[linear-gradient(135deg,rgba(178,165,255,0.22)_0%,rgba(255,159,178,0.14)_45%,rgba(255,208,155,0.20)_100%)]
                            [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_60%,black_100%)]
                            " />
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-main"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/75 to-white"></div>
                </div>
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        <span className="text-gradient-main">Quyền lợi khi nâng cấp <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">Premium</span></span>
                    </h2>

                    <div className="flex gap-0 rounded-2xl overflow-hidden max-w-4xl mx-auto overflow-x-auto">
                        {/* Benefits Column */}
                        <div className="flex-[2] bg-white/80 min-w-[200px]">
                            <div className="h-[86px] flex items-center px-4 md:px-6 font-bold border-b-2 border-black/[0.02] text-lg">
                                Lợi ích
                            </div>
                            <BenefitRow text="Bài học mới mỗi ngày" />
                            <BenefitRow text="Truy cập toàn bộ nội dung học" />
                            <BenefitRow text="Không quảng cáo" />
                            <BenefitRow text="Học nhanh hơn, theo tốc độ riêng của bạn" />
                            <BenefitRow text="Nội dung mới được cập nhật thường xuyên" />
                        </div>

                        {/* Free Column */}
                        <div className="flex-1 bg-gray-200 min-w-[100px] ring-2 ring-gray-400 rounded-2xl my-2 ">
                            <div className="h-[86px] flex items-center justify-center px-2 md:px-4 font-bold border-b-2 border-black/[0.02] text-lg">
                                Miễn phí
                            </div>
                            <CheckCell checked />
                            <CheckCell />
                            <CheckCell />
                            <CheckCell />
                            <CheckCell />
                        </div>

                        {/* Premium Column */}
                        <div className="flex-1 relative min-w-[100px] rounded-2xl">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400"></div>
                            <div className="relative">
                                <div className="h-[86px] rounded-t-2xl flex items-center justify-center px-2 md:px-4 font-bold text-white text-lg bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400">
                                    Premium
                                </div>
                                <div className="mx-1 bg-white rounded-2xl">
                                    <PremiumCheckCell />
                                    <PremiumCheckCell />
                                    <PremiumCheckCell />
                                    <PremiumCheckCell />
                                    <PremiumCheckCell />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upgrade Experience Section */}
            <section className="py-20 bg-white md:max-h-screen max-h-auto h-full">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Left Content */}
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold mb-12">Nâng cấp trải nghiệm học tập</h2>

                            <div className="space-y-8 mb-12">
                                <UpgradeFeature icon={<ChartIcon />} text="Truy cập toàn bộ nội dung học" />
                                <UpgradeFeature icon={<NoAdsIcon />} text="Không quảng cáo" />
                                <UpgradeFeature icon={<StarIcon />} text="Nội dung mới được cập nhật thường xuyên" />
                                <UpgradeFeature icon={<CheckCircleIcon />} text="Bài học mới mỗi ngày" />
                            </div>


                            <Link to='/payment'>
                                <Button size="md" className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300">
                                    Đăng ký ngay
                                </Button>
                            </Link>
                        </div>

                        {/* Mascot */}
                        <div className="flex-1 flex justify-center">
                            <MascotSVG />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Components
function PlanCard({ plan, selected, onSelect }) {
    // border styles giống ảnh: featured = gradient border, normal = gray border
    const outerClass = plan.featured
        ? "bg-[linear-gradient(90deg,#6A7BFF_0%,#FF90E0_55%,#F7C325_100%)]"
        : "bg-[#EAEAEA]";

    return (
        <button
            type="button"
            onClick={onSelect}
            className="relative flex-1 w-full text-left focus:outline-none"
            aria-pressed={selected}
        >
            {/* Outer border */}
            <div
                className={[
                    "relative rounded-[28px] p-[3px]",
                    outerClass,
                    // selected state (không “hard”, chỉ là state UI)
                    selected ? "shadow-[0_10px_30px_rgba(0,0,0,0.08)]" : "shadow-none",
                    // hover feel
                    "transition-all duration-200",
                ].join(" ")}
            >
                {/* Badge */}
                {plan.popular && (
                    <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 z-10">
                        <div className="rounded-full px-6 py-[6px] bg-[linear-gradient(90deg,#6A7BFF_0%,#FF90E0_55%,#F7C325_100%)]">
                            <span className="text-[15px] font-bold text-white">
                                GÓI PHỔ BIẾN NHẤT
                            </span>
                        </div>
                    </div>
                )}

                {/* Inner card */}
                <div
                    className={[
                        "rounded-[26px] bg-white",
                        "px-10 py-9",
                        "min-h-[140px] md:min-h-[160px]",
                        "flex flex-col items-center justify-center",
                        // subtle inner border giống ảnh
                        "border border-black/[0.06]",
                    ].join(" ")}
                >
                    <div className="text-center">
                        <h3 className="text-[28px] leading-[34px] font-semibold text-[#1F1F1F] mb-2">
                            {plan.title}
                        </h3>

                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-[22px] font-semibold text-[#1F1F1F]">
                                {plan.price}
                            </span>
                            <span className="text-[18px] text-[#1F1F1F]/70">{plan.suffix}</span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

function FeatureItem({ icon, title }) {
    return (
        <div className="flex items-center gap-4 p-6 rounded-lg">
            <div className="flex-shrink-0 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="font-bold text-xl">{title}</h3>
        </div>
    );
}

function BenefitRow({ text }) {
    return (
        <div className="h-[60px] flex items-center px-4 md:px-6 border-t-2 border-black/[0.02]">
            <span className="text-sm  md:text-base">{text}</span>
        </div>
    );
}

function CheckCell({ checked = false }) {
    return (
        <div className="h-[60px] flex items-center justify-center border-t-2 border-black/[0.02]">
            {checked ? (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle
                        cx="14"
                        cy="14"
                        r="12"
                        fill="#FFCC9C"
                        stroke="url(#gradient1)"
                        strokeWidth="4"
                    />
                    <path
                        d="M21.0718 10.1095L19.6576 8.69531L11.8794 16.4735L8.3439 12.938L6.92969 14.3522L11.8794 19.302L21.0718 10.1095Z"
                        fill="#291502"
                    />
                    <defs>
                        <linearGradient id="gradient1" x1="1.917" y1="4" x2="19.417" y2="21.5">
                            <stop stopColor="#FF8D23" stopOpacity="0" />
                            <stop offset="1" stopColor="#FF8D23" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM5.66872 4.4317L9.99979 8.76277L14.3308 4.43178L15.5682 5.66922L11.2372 10.0002L15.5682 14.3312L14.3308 15.5686L9.99979 11.2376L5.66871 15.5687L4.43127 14.3313L8.76235 10.0002L4.43129 5.66914L5.66872 4.4317Z"
                        fill="black"
                        fillOpacity="0.2"
                    />
                </svg>
            )}
        </div>
    );
}

function PremiumCheckCell() {
    return (
        <div className="h-[60px] flex items-center justify-center border-t-2 border-black/[0.02]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle
                    cx="14"
                    cy="14"
                    r="12"
                    fill="#FFCC9C"
                    stroke="url(#gradient2)"
                    strokeWidth="4"
                />
                <path
                    d="M21.0718 10.1095L19.6576 8.69531L11.8794 16.4735L8.3439 12.938L6.92969 14.3522L11.8794 19.302L21.0718 10.1095Z"
                    fill="#291502"
                />
                <defs>
                    <linearGradient id="gradient2" x1="1.917" y1="4" x2="19.417" y2="21.5">
                        <stop stopColor="#FF8D23" stopOpacity="0" />
                        <stop offset="1" stopColor="#FF8D23" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

function UpgradeFeature({ icon, text }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10">{icon}</div>
            <span className="text-xl">{text}</span>
        </div>
    );
}