// src/pages/Register/Register.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";
import { sendRegisterOtpService } from "../../../services/auth/auth.service";

/* =======================
   Schemas + helpers
======================= */
const emailSchema = z.string().trim().email("Email không hợp lệ");

const phoneVNSchema = z
  .string()
  .trim()
  .regex(
    /^(0|\+84)\d{9}$/,
    "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)"
  );

// ✅ Chỉ giữ field cho parent
const baseSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  email: emailSchema,
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại"),

  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  agreeToTerms: z.boolean().optional(),
});

const stepValidators = {
  step1: (values) => {
    const parsed = z
      .object({
        fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
        email: emailSchema,
        phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại"),
      })
      .safeParse(values);

    if (!parsed.success) return parsed;

    const phone = (values.phone ?? "").trim();
    const ok = phoneVNSchema.safeParse(phone);
    if (!ok.success) {
      return {
        success: false,
        error: {
          issues: [
            {
              code: "custom",
              path: ["phone"],
              message:
                ok.error.issues?.[0]?.message || "Số điện thoại không hợp lệ",
            },
          ],
        },
      };
    }
    return { success: true, data: values };
  },

  step2: (values) => {
    return z
      .object({
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
        agreeToTerms: z.literal(true, {
          errorMap: () => ({ message: "Vui lòng chấp nhận điều khoản" }),
        }),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Mật khẩu xác nhận không khớp",
          });
        }
      })
      .safeParse(values);
  },
};

function applyZodErrorsToForm(zodError, setError) {
  const issues = zodError?.issues || [];
  for (const issue of issues) {
    const field = issue.path?.[0];
    if (!field) continue;
    setError(field, { type: "manual", message: issue.message });
  }
}

function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

/* =======================
   Small UI helpers
======================= */
function FieldError({ name }) {
  const {
    formState: { errors },
  } = useFormContext();
  const msg = errors?.[name]?.message;
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{String(msg)}</p>;
}

function TextInput({
  name,
  label,
  placeholder,
  type = "text",
  iconClass,
  leftPad = true,
  ...rest
}) {
  const { register } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {iconClass && (
          <i
            className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}
            aria-hidden="true"
          />
        )}
        <input
          type={type}
          {...register(name)}
          className={`w-full ${
            leftPad && iconClass ? "pl-10" : "pl-4"
          } pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition`}
          placeholder={placeholder}
          {...rest}
        />
      </div>
      <FieldError name={name} />
    </div>
  );
}

/* =======================
   Step components
======================= */
function Step1() {
  const { register } = useFormContext();

  return (
    <>
      <TextInput
        name="fullName"
        label="Họ và tên"
        placeholder="Nhập họ và tên đầy đủ"
        iconClass="fa-regular fa-user"
      />

      <TextInput
        name="email"
        label="Email"
        placeholder="email@example.com"
        type="email"
        iconClass="fa-regular fa-envelope"
      />

      {/* ✅ Phone bắt buộc cho parent */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại
        </label>
        <div className="relative">
          <i
            className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            {...register("phone")}
            inputMode="tel"
            autoComplete="tel"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^\d+]/g, "");
            }}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
            placeholder="0912345678 hoặc +84912345678"
          />
        </div>
        <FieldError name="phone" />
      </div>
    </>
  );
}

function StepPassword() {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <div className="relative">
          <i
            className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
            placeholder="Ít nhất 6 ký tự"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <i
              className={`fa-regular ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
        <FieldError name="password" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full px-4 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600"
            aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
          >
            <i
              className={`fa-regular ${
                showConfirm ? "fa-eye-slash" : "fa-eye"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
        <FieldError name="confirmPassword" />
      </div>

      <div className="pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("agreeToTerms")}
            className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm text-gray-600">
            Tôi đồng ý với{" "}
            <span className="text-pink-600 font-medium hover:underline cursor-pointer">
              Điều khoản sử dụng
            </span>{" "}
            và{" "}
            <span className="text-pink-600 font-medium hover:underline cursor-pointer">
              Chính sách bảo mật
            </span>
          </span>
        </label>
        <FieldError name="agreeToTerms" />
      </div>
    </>
  );
}

/* =======================
   Main component
======================= */
export default function Register() {
  const navigate = useNavigate();

  const role = "parent"; // ✅ cố định chỉ đăng ký phụ huynh
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1..2

  const defaultValues = useMemo(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(baseSchema),
    mode: "onSubmit",
  });

  const { getValues, setError, clearErrors, reset, handleSubmit } = methods;

  const steps = [
    { number: 1, title: "Thông tin cơ bản" },
    { number: 2, title: "Mật khẩu & Xác nhận" },
  ];

  const validateCurrentStep = () => {
    clearErrors();
    const values = getValues();

    if (currentStep === 1) {
      const res = stepValidators.step1(values);
      if (!res.success) {
        applyZodErrorsToForm(res.error, setError);
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const res = stepValidators.step2(values);
      if (!res.success) {
        applyZodErrorsToForm(res.error, setError);
        return false;
      }
      return true;
    }

    return false;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 2) setCurrentStep((p) => p + 1);
  };

  const onSubmitFinal = async () => {
    if (!validateCurrentStep()) return;

    const values = getValues();
    const s1 = stepValidators.step1(values);
    if (!s1.success) {
      applyZodErrorsToForm(s1.error, setError);
      setCurrentStep(1);
      return;
    }

    const { firstName, lastName } = splitFullName(values.fullName);

    // ✅ Payload chỉ cho parent, KHÔNG gửi info học sinh nữa
    const payload = {
      email: values.email,
      password: values.password,
      phone: values.phone || "",
      firstName,
      lastName,
      roleName: "parent",
      gradeLevel: 0, // nếu BE không cần, bạn có thể đổi thành null (tuỳ BE)
      avatarUrl: "",
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await sendRegisterOtpService(payload);

      // ✅ lưu tạm data để trang OTP verify dùng tiếp
      sessionStorage.setItem("pending_register", JSON.stringify(payload));

      toast.success("Đã gửi OTP về email. Vui lòng kiểm tra hộp thư!");
      navigate("/register/verify-otp");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const StepTitle =
    currentStep === 1 ? "Thông tin tài khoản" : "Thiết lập mật khẩu";

  return (
  <FormProvider {...methods}>
    <div className="min-h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-[920px] max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-pink-600 to-orange-500 p-6 text-white flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">STEMotion</h1>
              <p className="text-pink-100">Nền tảng học tập thông minh</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-5">Đăng ký phụ huynh</h2>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      currentStep >= step.number ? "bg-white/20" : "bg-white/5"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step.number
                          ? "bg-white text-pink-600"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <i className="fa-solid fa-check" aria-hidden="true" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-pink-100">Bước {step.number}</p>
                      <p className="font-medium">{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-white/20 mt-5">
                <p className="text-pink-100 text-sm">
                  Theo dõi tiến độ học tập và kết quả của con em bạn.
                </p>
              </div>
            </div>

            <div className="text-sm text-pink-100">
              Đã có tài khoản?{" "}
              <Link to="/" className="text-white font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-3/5 p-6 sm:p-7 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() =>
                  currentStep === 1
                    ? reset(defaultValues)
                    : setCurrentStep((p) => Math.max(1, p - 1))
                }
                className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                Quay lại
              </button>

              <span className="text-sm font-medium text-gray-500">
                Bước {currentStep}/2
              </span>
            </div>

            <form
              onSubmit={
                currentStep === 2
                  ? handleSubmit(onSubmitFinal)
                  : (e) => {
                      e.preventDefault();
                      handleNextStep();
                    }
              }
              className="flex-1 flex flex-col min-h-0"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                {StepTitle}
              </h3>

              {/* vùng scroll trong card */}
              <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2">
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <StepPassword />}
              </div>

              <div className="pt-5 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Đang xử lý..."
                    : currentStep === 2
                    ? "Gửi OTP"
                    : "Tiếp theo"}
                </button>

                {currentStep < 2 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full mt-3 py-3 text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition"
                  >
                    Bỏ qua, điền sau
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </FormProvider>
);
}