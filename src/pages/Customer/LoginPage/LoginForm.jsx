import { useEffect, useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuthModalStore } from "../../../stores/authModalStore";
// import { loginStudentService, loginService} from "../../../services/auth/auth.service";

const ROLE = { STUDENT: "student", PARENT: "parent" };

const ROLE_CONFIG = {
  student: {
    title: "Đăng nhập Học sinh",
    description: "Khám phá lộ trình học tập và thử thách của bạn!",
    registerLink: "/register",
    borderClass: "from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]",
    iconRingClass: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
    iconColor: "text-[#F8BB44]",
    loginHoverGradient: "from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]",
    googleRole: "student",
  },
  parent: {
    title: "Đăng nhập Phụ huynh",
    description: "Theo dõi quá trình học và tiến bộ của con bạn!",
    registerLink: "/register",
    borderClass: "from-gray-200 via-gray-200 to-gray-200",
    iconRingClass: "from-gray-200 via-gray-300 to-gray-200",
    iconColor: "text-gray-800",
    loginHoverGradient: "from-gray-600 via-gray-700 to-gray-800",
    googleRole: "parent",
  },
};

const parentSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

const studentSchema = z.object({
  username: z.string().trim().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function LoginModal({ isOpen = false, onClose = () => { }, role = "student" }) {
  const navigate = useNavigate();
  const titleId = useId();

  const { login, loginStudent, loading } = useAuth();

  // const role = useAuthModalStore((s) => s.role);
  const redirectTo = useAuthModalStore((s) => s.redirectTo);
  const clearRedirect = useAuthModalStore((s) => s.clearRedirect);

  const [showPassword, setShowPassword] = useState(false);
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  const resolver = useMemo(
    () => zodResolver(role === ROLE.PARENT ? parentSchema : studentSchema),
    [role]
  );

  const defaultValues = useMemo(() => {
    return role === ROLE.PARENT
      ? { email: "", password: "" }
      : { username: "", password: "" };
  }, [role]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues,
    resolver,
    mode: "onSubmit",
  });

  // ✅ mỗi lần mở modal hoặc role đổi → reset form để UI sạch như 2 frame
  useEffect(() => {
    if (!isOpen) return;
    reset(defaultValues);
    setShowPassword(false);
  }, [isOpen, role, reset, defaultValues]);

  const loginGoogle = () => {
    sessionStorage.setItem("preLoginUrl", window.location.pathname + window.location.search);
    const base = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${base}/api/Auth/google-login?role=${encodeURIComponent(config.googleRole)}`;
  };

  const onSubmit = async (values) => {
    try {
      if (role === ROLE.PARENT) {
      const user = await login(values.email, values.password);
        
      console.log("data user: ", user);
      } else {
      const student = await loginStudent(values.username, values.password);
        console.log("Student logged in: ", student);
      }

      toast.success("Đăng nhập thành công!");
      onClose();

      // const target = redirectTo || "/";
      // clearRedirect();
      // navigate(target, { replace: true });
      const defaultTarget = role === ROLE.PARENT ? "/parent/dashboard" : "/";
      const target = redirectTo || defaultTarget;

      clearRedirect();
      navigate(target, { replace: true });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Thông tin đăng nhập không đúng";
      toast.error(message);
    }
  };

  const disableSubmit = loading || isSubmitting;
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]" />

      <div className="fixed inset-0 z-[1000] p-4 overflow-y-auto flex items-start sm:items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm max-h-[calc(100dvh-2rem)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-[2px] rounded-[32px] bg-gradient-to-br ${config.borderClass} shadow-2xl overflow-hidden`}>
            <div className="bg-white rounded-[30px] px-6 py-5 flex flex-col items-center">
              <div className="mb-3">
                <div className={`p-[3px] rounded-full bg-gradient-to-tr ${config.iconRingClass}`}>
                  <div className="bg-white rounded-full p-2.5 flex items-center justify-center">
                    <i className={`fa-regular fa-circle-user text-4xl ${config.iconColor}`} />
                  </div>
                </div>
              </div>

              <h1 id={titleId} className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                {config.title}
              </h1>

              <p className="text-gray-500 text-center text-sm mb-2">
                {config.description}
              </p>
              {role === ROLE.PARENT ? (
                <Link
                  to={config.registerLink}
                  onClick={onClose}
                  className="text-gray-800 font-bold underline mb-4 hover:text-indigo-600 transition-colors"
                >
                  Đăng ký miễn phí ngay
                </Link>
              ) : (
                <div className="h-6" />
              )}
              <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {role === ROLE.PARENT ? (
                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">Địa chỉ email</label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email.message}</p>}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">Tên đăng nhập</label>
                    <input
                      type="text"
                      placeholder="Nhập username"
                      autoComplete="username"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      {...register("username")}
                    />
                    {errors.username && <p className="text-red-600 text-xs mt-1 ml-1">{errors.username.message}</p>}
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="text-gray-600 font-medium mb-1 ml-1 text-sm">Mật khẩu</label>
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
                    >
                      <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                      <span className="text-xs font-medium">{showPassword ? "Ẩn" : "Hiện"}</span>
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-xs mt-1 ml-1">{errors.password.message}</p>}
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
                  className={`w-full py-3 bg-[#CCCCCC] text-white text-base font-bold rounded-full transition-all hover:bg-gradient-to-tr ${config.loginHoverGradient} active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {disableSubmit ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="flex justify-between w-full mt-4 gap-3 px-1">
                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Facebook"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i className="fa-brands fa-facebook-f text-lg text-blue-600" />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Apple"
                  type="button"
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i className="fa-brands fa-apple text-lg text-black" />
                  </div>
                </button>

                <button
                  className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}
                  aria-label="Đăng nhập bằng Google"
                  type="button"
                  onClick={loginGoogle}
                >
                  <div className="bg-white rounded-full py-2 flex justify-center items-center">
                    <i className="fa-brands fa-google text-lg text-red-500" />
                  </div>
                </button>
              </div>

              <button type="button" onClick={onClose} className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
