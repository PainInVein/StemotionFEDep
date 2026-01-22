// src/pages/LandingPage/sections/HeroSection.jsx
import { memo, useCallback } from "react";

const IconCard = memo(
  ({ iconClass, title, subtitle, borderColor, bgColor, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
        aria-label={title}
      >
        <div
          className={`border-2 ${borderColor} hover:border-opacity-100 hover:shadow-lg transition-all duration-200 cursor-pointer group rounded-xl bg-white`}
        >
          <div className="p-4 text-center">
            <div
              className={`${bgColor} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}
            >
              <i className={`${iconClass} text-2xl`} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </button>
    );
  }
);
IconCard.displayName = "IconCard";

const HeroIllustration = memo(() => (
  <div
    className="flex justify-center items-center p-4"
    role="img"
    aria-label="STEMotion learning illustration"
  >
    <div className="relative w-full max-w-md">
      <div className="relative bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-3xl p-8 shadow-2xl">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md transform hover:scale-105 transition-transform">
            <i className="fa-solid fa-robot text-5xl text-indigo-600 mb-2" aria-hidden="true" />
            <div className="h-2 bg-gray-100 rounded w-3/4 mb-1" />
            <div className="h-2 bg-gray-100 rounded w-1/2" />
          </div>

          <div className="bg-orange-400 rounded-2xl p-4 flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
            <i className="fa-regular fa-lightbulb text-4xl text-white" aria-hidden="true" />
          </div>

          <div className="bg-indigo-500 rounded-2xl p-4 flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
            <i className="fa-solid fa-code text-4xl text-white" aria-hidden="true" />
          </div>

          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md transform hover:scale-105 transition-transform">
            <i className="fa-solid fa-rocket text-5xl text-pink-500 mb-2" aria-hidden="true" />
            <div className="h-2 bg-gray-100 rounded w-2/3 mb-1" />
            <div className="h-2 bg-gray-100 rounded w-1/3" />
          </div>
        </div>

        <div
          className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full shadow-lg animate-bounce flex items-center justify-center"
          style={{ willChange: "transform" }}
          aria-hidden="true"
        >
          <i className="fa-regular fa-snowflake text-2xl text-white" aria-hidden="true" />
        </div>

        <div
          className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full shadow-lg animate-pulse flex items-center justify-center"
          style={{ willChange: "opacity" }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-bolt text-2xl text-white" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
));
HeroIllustration.displayName = "HeroIllustration";

const HeroSection = memo(function HeroSection({ openLogin }) {
  // ✅ 1 handler chung: mở modal đăng nhập
  const handleLogin = useCallback(() => openLogin(), [openLogin]);

  return (
    <section
      className="min-h-screen relative flex items-center px-6 overflow-hidden bg-gradient-hero"
      role="banner"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-semibold text-foreground leading-tight">
              Học, chơi và chinh phục STEM cùng STEMotion!
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground">
              Bài học khoa học và toán học tương tác qua việc học dựa trên sự tò mò.
            </p>

            <div className="space-y-4 pt-4">
              <p className="text-sm font-medium text-muted-foreground">
                Chọn lộ trình của bạn:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IconCard
                  iconClass="fa-regular fa-circle-user"
                  title="Đăng nhập học sinh"
                  subtitle="Truy cập lộ trình học tập của bạn"
                  borderColor="border-indigo-100"
                  bgColor="bg-indigo-100"
                  onClick={handleLogin}
                />

                <IconCard
                  iconClass="fa-regular fa-heart"
                  title="Đăng nhập phụ huynh"
                  subtitle="Theo dõi tiến độ học tập của con"
                  borderColor="border-pink-100"
                  bgColor="bg-pink-100"
                  onClick={handleLogin}
                />
              </div>
            </div>
          </div>

          <HeroIllustration />
        </div>
      </div>
    </section>
  );
});
HeroSection.displayName = "HeroSection";

export default HeroSection;
