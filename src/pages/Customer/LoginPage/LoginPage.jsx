// src/pages/LoginPage/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../contexts/AuthContext";


export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuth();

  if (!isOpen) return null;

  const config = {
    title: "Đăng nhập",
    description: "Khám phá lộ trình học tập và thử thách của bạn!",
    borderClass: "from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]",
    iconRingClass: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
    iconColor: "text-[#F8BB44]",
    registerLink: "/register",
    loginHoverGradient: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const a = await login(email, password);

      // console.log(a);
      onClose();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <>
      {/* Overlay: click ngoài để đóng */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
      />

      {/* Wrapper: click ngoài hộp sẽ xuyên xuống overlay */}
      <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
        {/* Modal container: nhận click */}
        <div className="pointer-events-auto w-full max-w-sm max-h-[85vh]">
          {/* Gradient border */}
          <div
            className={`p-[2px] rounded-[32px] bg-gradient-to-br ${config.borderClass} shadow-2xl overflow-hidden`}
          >
            {/* Content: scroll nếu dài */}
            <div className="bg-white rounded-[30px] px-6 py-7 max-h-[85vh] overflow-y-auto flex flex-col items-center">
              {/* Profile icon (nhỏ lại) */}
              <div className="mb-3">
                <div
                  className={`p-[3px] rounded-full bg-gradient-to-tr ${config.iconRingClass}`}
                >
                  <div className="bg-white rounded-full p-3 flex items-center justify-center">
                    <i
                      className={`fa-regular fa-circle-user text-5xl ${config.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                {config.title}
              </h1>
              <p className="text-gray-500 text-center text-sm mb-2">
                {config.description}
              </p>

              {/* Link đăng ký: đóng modal trước khi chuyển */}
              <Link
                to={config.registerLink}
                onClick={onClose}
                className="text-gray-800 font-bold underline mb-6 hover:text-indigo-600 transition-colors"
              >
                Đăng ký miễn phí ngay
              </Link>

              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">
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
                  <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">
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

                {/* {error && (
                  <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-sm">
                    {error}
                  </div>
                )} */}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-[#CCCCCC] text-white text-base font-bold rounded-full transition-all hover:bg-gradient-to-tr ${config.loginHoverGradient} active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              {/* Social Login (nhỏ lại) */}
              <div className="flex justify-between w-full mt-6 gap-3 px-1">
                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Facebook"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i
                      className="fa-brands fa-facebook-f text-lg text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Apple"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i
                      className="fa-brands fa-apple text-lg text-black"
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Google"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i
                      className="fa-brands fa-google text-lg text-red-500"
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
