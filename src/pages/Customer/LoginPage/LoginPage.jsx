// src/pages/LoginPage/LoginPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  // ✅ giữ UI học sinh (gradient / icon / button)
  const config = {
    title: "Đăng nhập",
    description: "Khám phá lộ trình học tập và thử thách của bạn!",
    borderClass: "from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]",
    iconRingClass: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
    iconColor: "text-[#F8BB44]",
    registerLink: "/register",
    loginHoverGradient: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
      />

      <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
        <div className="pointer-events-auto relative max-w-md w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white text-3xl hover:rotate-90 transition-transform"
            aria-label="Đóng"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          {/* Gradient border */}
          <div
            className={`p-[2px] rounded-[40px] bg-gradient-to-br ${config.borderClass} shadow-2xl`}
          >
            <div className="bg-white rounded-[38px] px-8 py-10 flex flex-col items-center">
              {/* Profile icon */}
              <div className="mb-4">
                <div
                  className={`p-[3px] rounded-full bg-gradient-to-tr ${config.iconRingClass}`}
                >
                  <div className="bg-white rounded-full p-4 flex items-center justify-center">
                    <i
                      className={`fa-regular fa-circle-user text-6xl ${config.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {config.title}
              </h1>
              <p className="text-gray-500 text-center text-sm md:text-base mb-1">
                {config.description}
              </p>

              {/* ✅ Click link đăng ký => đóng modal trước khi chuyển trang */}
              <Link
                to={config.registerLink}
                onClick={onClose}
                className="text-gray-800 font-bold underline mb-8 hover:text-indigo-600 transition-colors"
              >
                Đăng ký miễn phí ngay
              </Link>

              <form className="w-full space-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="text-gray-600 font-medium mb-1.5 ml-1 text-sm">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="text-gray-600 font-medium mb-1.5 ml-1 text-sm">
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-2 hover:text-gray-600"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      <i
                        className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium">
                        {showPassword ? "Ẩn" : "Hiện"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-left">
                  <button
                    type="button"
                    className="text-gray-800 font-bold underline text-xs ml-1 hover:text-indigo-600"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 bg-[#CCCCCC] text-white text-lg font-bold rounded-full transition-all hover:bg-gradient-to-tr ${config.loginHoverGradient} active:scale-[0.98]`}
                >
                  Đăng nhập
                </button>
              </form>

              {/* Social Login */}
              <div className="flex justify-between w-full mt-8 gap-4 px-4">
                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Facebook"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2.5 flex justify-center items-center">
                    <i
                      className="fa-brands fa-facebook-f text-xl text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Apple"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2.5 flex justify-center items-center">
                    <i
                      className="fa-brands fa-apple text-xl text-black"
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Google"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2.5 flex justify-center items-center">
                    <i
                      className="fa-brands fa-google text-xl text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
