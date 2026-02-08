// src/pages/LoginPage/LoginModal.jsx
import { useEffect, useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../contexts/AuthContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";

import { useAuthModalStore } from "../../../stores/authModalStore";

const CONFIG = {
  title: "Đăng nhập",
  description: "Khám phá lộ trình học tập và thử thách của bạn!",
  borderClass: "from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]",
  iconRingClass: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
  iconColor: "text-[#F8BB44]",
  registerLink: "/register",
  loginHoverGradient: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
};

// Validation schema (chỉnh rule theo backend nếu cần)
const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function LoginModal({ isOpen = false, onClose = () => { } }) {
  const navigate = useNavigate();
  const titleId = useId();
  const { login, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = useMemo(() => ({ email: "", password: "" }), []);

  const loginGoogle = (role = "student") => {
    // ✅ lưu trang hiện tại để quay lại sau khi login
    sessionStorage.setItem(
      "preLoginUrl",
      window.location.pathname + window.location.search
    );

    const base = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${base}/api/Auth/google-login?role=${encodeURIComponent(role)}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const redirectTo = useAuthModalStore((s) => s.redirectTo);
  const clearRedirect = useAuthModalStore((s) => s.clearRedirect);

  // UX: lock scroll + ESC đóng
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset form khi đóng modal (tránh giữ input cũ)
  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
      setShowPassword(false);
    }
  }, [isOpen, reset, defaultValues]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      toast.success("Đăng nhập thành công!");
      onClose();
      const target = redirectTo || "/";
      clearRedirect();
      navigate(target, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Email hoặc mật khẩu không đúng";
      toast.error(message);
    }
  };

  const disableSubmit = loading || isSubmitting;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
        aria-hidden="true"
      />

      {/* Wrapper: scroll ở đây để tránh scroll bên trong form */}
      <div className="fixed inset-0 z-[1000] p-4 overflow-y-auto flex items-start sm:items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm max-h-[calc(100dvh-2rem)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient border */}
          <div
            className={`p-[2px] rounded-[32px] bg-gradient-to-br ${CONFIG.borderClass} shadow-2xl overflow-hidden`}
          >
            {/* Content: KHÔNG scroll trong content */}
            <div className="bg-white rounded-[30px] px-6 py-5 flex flex-col items-center">
              {/* Profile icon (gọn hơn một chút) */}
              <div className="mb-3">
                <div
                  className={`p-[3px] rounded-full bg-gradient-to-tr ${CONFIG.iconRingClass}`}
                >
                  <div className="bg-white rounded-full p-2.5 flex items-center justify-center">
                    <i
                      className={`fa-regular fa-circle-user text-4xl ${CONFIG.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <h1
                id={titleId}
                className="text-xl md:text-2xl font-bold text-gray-800 mb-1"
              >
                {CONFIG.title}
              </h1>

              <p className="text-gray-500 text-center text-sm mb-2">
                {CONFIG.description}
              </p>

              <Link
                to={CONFIG.registerLink}
                onClick={onClose}
                className="text-gray-800 font-bold underline mb-4 hover:text-indigo-600 transition-colors"
              >
                Đăng ký miễn phí ngay
              </Link>

              <form
                className="w-full space-y-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      {...register("password")}
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

                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1 ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="text-left">
                  <button
                    type="button"
                    className="text-gray-800 font-bold underline text-xs ml-1 hover:text-indigo-600"
                    onClick={() => {
                      onClose();
                      navigate("/forgot-password");
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={disableSubmit}
                  className={`w-full py-3 bg-[#CCCCCC] text-white text-base font-bold rounded-full transition-all hover:bg-gradient-to-tr ${CONFIG.loginHoverGradient} active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {disableSubmit ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              {/* Social Login */}
              <div className="flex justify-between w-full mt-4 gap-3 px-1">
                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${CONFIG.borderClass} hover:shadow-md transition-shadow`}
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
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${CONFIG.borderClass} hover:shadow-md transition-shadow`}
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
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${CONFIG.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Google"
                  type="button"
                  onClick={() => loginGoogle("student")}
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i
                      className="fa-brands fa-google text-lg text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
