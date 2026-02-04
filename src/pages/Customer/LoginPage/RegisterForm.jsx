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

const baseSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  email: emailSchema,
  phone: z.string().trim().optional(),

  relationship: z.string().optional(),
  childName: z.string().trim().optional(),
  childUsername: z.string().trim().optional(),
  childGrade: z.string().optional(),
  childEmail: z.string().trim().optional(),

  studentGrade: z.string().optional(),

  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  agreeToTerms: z.boolean().optional(),
});

const stepValidators = {
  step1: (values, role) => {
    const parsed = z
      .object({
        fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
        email: emailSchema,
        phone: z.string().trim().optional(),
      })
      .safeParse(values);

    if (!parsed.success) return parsed;

    if (role === "parent") {
      const phone = (values.phone ?? "").trim();
      if (!phone) {
        return {
          success: false,
          error: { issues: [{ code: "custom", path: ["phone"], message: "Vui lòng nhập số điện thoại" }] },
        };
      }
      const ok = phoneVNSchema.safeParse(phone);
      if (!ok.success) {
        return {
          success: false,
          error: { issues: [{ code: "custom", path: ["phone"], message: ok.error.issues?.[0]?.message || "Số điện thoại không hợp lệ" }] },
        };
      }
    }
    return { success: true, data: values };
  },

  step2: (values, role) => {
    if (role === "parent") {
      return z
        .object({
          relationship: z.string().min(1, "Chọn mối quan hệ"),
          childName: z.string().trim().min(1, "Nhập tên con"),
          childGrade: z.string().min(1, "Chọn khối lớp"),
          childUsername: z.string().trim().min(1, "Nhập username"),
          childEmail: emailSchema,
        })
        .safeParse(values);
    }

    return z
      .object({
        studentGrade: z.string().min(1, "Chọn khối lớp"),
      })
      .safeParse(values);
  },

  step3: (values) => {
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

function parseGradeLevel(value) {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
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

function TextInput({ name, label, placeholder, type = "text", iconClass, leftPad = true, ...rest }) {
  const { register } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {iconClass && (
          <i className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`} aria-hidden="true" />
        )}
        <input
          type={type}
          {...register(name)}
          className={`w-full ${leftPad && iconClass ? "pl-10" : "pl-4"} pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition`}
          placeholder={placeholder}
          {...rest}
        />
      </div>
      <FieldError name={name} />
    </div>
  );
}

function SelectInput({ name, label, children, className = "", ...rest }) {
  const { register } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <div className="relative">
        <select
          {...register(name)}
          className={`w-full appearance-none px-2 py-3 md:px-4 md:py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition ${className}`}
          {...rest}
        >
          {children}
        </select>

        {/* icon mũi tên - chỉnh right để qua trái/qua phải */}
        <i
          className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <FieldError name={name} />
    </div>
  );
}


/* =======================
   Step components
======================= */
function Step1({ role }) {
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

      {role === "parent" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <div className="relative">
            <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
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
      )}
    </>
  );
}

function Step2Parent() {
  return (
    <div className="space-y-4">
      <div className="bg-pink-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-pink-600 font-medium">Thông tin học sinh</p>
      </div>

      <div className="flex flex-row w-auto justify-between gap-4">
        <div className="flex-1">
          <SelectInput name="relationship" label="Mối quan hệ">
            <option value="">Chọn mối quan hệ</option>
            <option value="mother">Mẹ</option>
            <option value="father">Cha</option>
            <option value="guardian">Giám hộ</option>
            <option value="other">Khác</option>
          </SelectInput>
        </div>

        <div className="flex-1">
          <TextInput name="childName" label="Tên học sinh" placeholder="Nhập tên học sinh" iconClass={null} leftPad={false} />
        </div>
      </div>

      <div className="flex flex-row w-auto justify-between gap-4">
        <div className="w-[65%]">
          <TextInput
            name="childUsername"
            label="Tên username của học sinh"
            placeholder="Nhập username của học sinh"
            iconClass={null}
            leftPad={false}
          />
        </div>

        <div className="flex-1">
          <SelectInput name="childGrade" label="Khối lớp">
            <option value="">Chọn lớp</option>
            {[...Array(5)].map((_, i) => (
              <option key={i} value={`grade${i + 1}`}>
                Lớp {i + 1}
              </option>
            ))}
          </SelectInput>
        </div>
      </div>

      <TextInput
        name="childEmail"
        label="Email của học sinh"
        placeholder="email@example.com"
        type="email"
        iconClass="fa-regular fa-envelope"
      />
    </div>
  );
}

function Step2Student() {
  return (
    <div className="space-y-4">
      <div className="bg-pink-50 rounded-xl p-4">
        <p className="text-sm text-pink-600 font-medium">Thông tin bổ sung</p>
      </div>

      <SelectInput name="studentGrade" label="Khối lớp">
        <option value="">Chọn khối lớp</option>
        {[...Array(5)].map((_, i) => (
          <option key={i} value={`grade${i + 1}`}>
            Lớp {i + 1}
          </option>
        ))}
      </SelectInput>
    </div>
  );
}

function Step3() {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

    return (
    <>
      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
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
            <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
          </button>
        </div>
        <FieldError name="password" />
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
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
            <i className={`fa-regular ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
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

  const [role, setRole] = useState(""); // "student" | "parent" | ""
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const defaultValues = useMemo(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      relationship: "",
      childName: "",
      childUsername: "",
      childGrade: "",
      childEmail: "",
      studentGrade: "",
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
    { number: 2, title: role === "parent" ? "Thông tin học sinh" : "Thông tin bổ sung" },
    { number: 3, title: "Mật khẩu & Xác nhận" },
  ];

  const goChooseRole = () => {
    setRole("");
    setCurrentStep(1);
    setLoading(false);
    clearErrors();
    reset(defaultValues);
  };

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setCurrentStep(1);
    setLoading(false);
    clearErrors();
    reset(defaultValues);
  };

  const validateCurrentStep = () => {
    clearErrors();
    const values = getValues();

    if (currentStep === 1) {
      const res = stepValidators.step1(values, role);
      if (!res.success) {
        applyZodErrorsToForm(res.error, setError);
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const res = stepValidators.step2(values, role);
      if (!res.success) {
        applyZodErrorsToForm(res.error, setError);
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      const res = stepValidators.step3(values);
      if (!res.success) {
        applyZodErrorsToForm(res.error, setError);
        return false;
      }
      return true;
    }

    return false;
  };

  const handleNextStep = () => {
    if (!role) return;
    if (!validateCurrentStep()) return;
    if (currentStep < 3) setCurrentStep((p) => p + 1);
  };

  // const onSubmitFinal = async () => {
  //   if (!validateCurrentStep()) return;

  //   // đảm bảo step 1 & 2 cũng ok
  //   const values = getValues();
  //   const s1 = stepValidators.step1(values, role);
  //   const s2 = stepValidators.step2(values, role);
  //   if (!s1.success) {
  //     applyZodErrorsToForm(s1.error, setError);
  //     setCurrentStep(1);
  //     return;
  //   }
  //   if (!s2.success) {
  //     applyZodErrorsToForm(s2.error, setError);
  //     setCurrentStep(2);
  //     return;
  //   }

  //   const { firstName, lastName } = splitFullName(values.fullName);
  //   const gradeSource = role === "student" ? values.studentGrade : values.childGrade;

  //   const payload = {
  //     email: values.email,
  //     password: values.password,
  //     phone: values.phone || "",
  //     firstName,
  //     lastName,
  //     roleName: role,
  //     gradeLevel: parseGradeLevel(gradeSource),
  //     avatarUrl: "",
  //     status: "Active",
  //     createdAt: new Date().toISOString(),
  //   };

  //   setLoading(true);
  //   try {
  //     await registerService(payload);
  //     toast.success("Tạo tài khoản thành công!");
  //     navigate("/login");
  //   } catch (err) {
  //     const message = err?.response?.data?.message || "Dang ky that bai. Vui long thu lai.";
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmitFinal = async () => {
  if (!validateCurrentStep()) return;

  const values = getValues();
  const s1 = stepValidators.step1(values, role);
  const s2 = stepValidators.step2(values, role);
  if (!s1.success) {
    applyZodErrorsToForm(s1.error, setError);
    setCurrentStep(1);
    return;
  }
  if (!s2.success) {
    applyZodErrorsToForm(s2.error, setError);
    setCurrentStep(2);
    return;
  }

  const { firstName, lastName } = splitFullName(values.fullName);
  const gradeSource = role === "student" ? values.studentGrade : values.childGrade;

  const payload = {
    email: values.email,
    password: values.password,
    phone: values.phone || "",
    firstName,
    lastName,
    roleName: role, // "student" | "parent"
    gradeLevel: parseGradeLevel(gradeSource),
    avatarUrl: "",
    createdAt: new Date().toISOString(),
  };

  setLoading(true);
  try {
    // ✅ gọi BE gửi OTP
    await sendRegisterOtpService(payload);
    console.log("OTP sent for registration:", payload);

    // ✅ lưu tạm data để trang OTP verify dùng tiếp
    sessionStorage.setItem("pending_register", JSON.stringify(payload));

    toast.success("Đã gửi OTP về email. Vui lòng kiểm tra hộp thư!");
    navigate("/register/verify-otp"); // bạn tạo route này
  } catch (err) {
    const message =
      err?.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  const StepTitle =
    currentStep === 1
      ? "Thông tin tài khoản"
      : currentStep === 2
        ? role === "parent"
          ? "Thông tin học sinh"
          : "Thông tin bổ sung"
        : "Thiết lập mật khẩu";

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4">
        <div className="w-full max-w-4xl h-auto md:h-[625px] flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">
          {/* Left Side */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-pink-600 to-orange-500 p-8 text-white flex flex-col">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">STEMotion</h1>
              <p className="text-pink-100">Nền tảng học tập thông minh</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">Đăng ký tài khoản</h2>

              {!role ? (
                <div className="space-y-4">
                  <p className="text-pink-100 mb-4">Bạn là:</p>

                  <button
                    type="button"
                    onClick={() => selectRole("student")}
                    className="w-full flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <i className="fa-solid fa-user-graduate text-xl" aria-hidden="true" />
                    <span className="font-medium">Học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRole("parent")}
                    className="w-full flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <i className="fa-solid fa-users text-xl" aria-hidden="true" />
                    <span className="font-medium">Phụ huynh</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <div
                        key={step.number}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentStep >= step.number ? "bg-white/20" : "bg-white/5"
                          }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.number ? "bg-white text-pink-600" : "bg-white/20 text-white"
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

                  <div className="pt-4 border-t border-white/20">
                    <p className="text-pink-100 text-sm">
                      {role === "student"
                        ? "Đăng ký để truy cập tài liệu học tập, bài giảng và thi thử"
                        : "Theo dõi tiến độ học tập và kết quả của con em bạn"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-pink-100">
              Đã có tài khoản?{" "}
              <Link to="/" className="text-white font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-3/5 p-8 flex flex-col">
            {role ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <button
                    type="button"
                    onClick={() => (currentStep === 1 ? goChooseRole() : setCurrentStep((p) => Math.max(1, p - 1)))}
                    className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
                  >
                    <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                    Quay lại
                  </button>
                  <span className="text-sm font-medium text-gray-500">Bước {currentStep}/3</span>
                </div>

                <form
                  onSubmit={
                    currentStep === 3
                      ? handleSubmit(onSubmitFinal)
                      : (e) => {
                        e.preventDefault();
                        handleNextStep();
                      }
                  }
                  className="flex-1 flex flex-col"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{StepTitle}</h3>

                  <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {currentStep === 1 && <Step1 role={role} />}
                    {currentStep === 2 && role === "parent" && <Step2Parent />}
                    {currentStep === 2 && role === "student" && <Step2Student />}
                    {currentStep === 3 && <Step3 />}
                  </div>

                  <div className="pt-6 mt-auto">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? "Đang xử lý..." : currentStep === 3 ? "Tạo tài khoản" : "Tiếp theo"}
                    </button>

                    {currentStep < 3 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="w-full mt-3 py-3 text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition"
                      >
                        Bỏ qua, điền sau
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center px-6">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/000/545/024/small_2x/StemWord.jpg"
                  alt="STEM"
                  className="w-40 md:w-52 h-auto rounded-2xl shadow-md mb-6 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Chọn vai trò để bắt đầu
                </h3>
                <p className="text-gray-500 max-w-md">
                  Vui lòng chọn <b>Học sinh</b> hoặc <b>Phụ huynh</b> ở bên trái để mở form đăng ký.
                </p>

                {/* Optional: cho chọn role ngay tại đây */}
                <div className="w-full max-w-sm mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => selectRole("student")}
                    className="w-full py-3 rounded-xl border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition font-medium text-gray-700"
                  >
                    Tôi là học sinh
                  </button>

                  <button
                    type="button"
                    onClick={() => selectRole("parent")}
                    className="w-full py-3 rounded-xl border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition font-medium text-gray-700"
                  >
                    Tôi là phụ huynh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

