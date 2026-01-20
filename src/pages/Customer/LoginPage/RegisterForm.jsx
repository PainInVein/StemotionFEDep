import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // ✅ role chọn bằng button
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    relationship: "",
    childName: "",
    childUsername: "", // ✅ tách riêng
    childGrade: "",
    childEmail: "", // ✅ tách riêng email học sinh (parent flow)

    // ✅ thêm cho học sinh
    studentGrade: "",

    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (role === "parent" && !formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (role === "parent") {
      if (!formData.relationship) newErrors.relationship = "Chọn mối quan hệ";
      if (!formData.childName.trim()) newErrors.childName = "Nhập tên con";
      if (!formData.childGrade) newErrors.childGrade = "Chọn khối lớp";
      if (!formData.childUsername.trim()) newErrors.childUsername = "Nhập username";
      if (!formData.childEmail.trim()) newErrors.childEmail = "Nhập email học sinh";
    }

    // ✅ validate cho học sinh: bắt buộc chọn khối lớp
    if (role === "student") {
      if (!formData.studentGrade) newErrors.studentGrade = "Chọn khối lớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "Vui lòng chấp nhận điều khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        break;
    }

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    console.log("REGISTER", { role, ...formData });

    setLoading(false);
    navigate(role === "student" ? "/student/dashboard" : "/parent/dashboard");
  };

  const steps = [
    { number: 1, title: "Thông tin cơ bản" },
    {
      number: 2,
      title: role === "parent" ? "Thông tin học sinh" : "Thông tin bổ sung",
    },
    { number: 3, title: "Mật khẩu & Xác nhận" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-4xl h-auto md:h-[625px] flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side */}
        <div className="lg:w-2/5 bg-gradient-to-br from-pink-600 to-orange-500 p-8 text-white flex flex-col">
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
                  onClick={() => {
                    setRole("student");
                    setCurrentStep(1);
                    setErrors({});
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <i className="fa-solid fa-user-graduate text-xl" aria-hidden="true" />
                  <span className="font-medium">Học sinh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("parent");
                    setCurrentStep(1);
                    setErrors({});
                  }}
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
        <div className="lg:w-3/5 p-8 flex flex-col">
          {role && (
            <>
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  onClick={() => (currentStep === 1 ? setRole("") : handlePrevStep())}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
                >
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                  Quay lại
                </button>
                <span className="text-sm font-medium text-gray-500">
                  Bước {currentStep}/3
                </span>
              </div>

              <form
                onSubmit={
                  currentStep === 3
                    ? handleSubmit
                    : (e) => {
                        e.preventDefault();
                        handleNextStep();
                      }
                }
                className="flex-1 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentStep === 1 && "Thông tin tài khoản"}
                  {currentStep === 2 &&
                    (role === "parent" ? "Thông tin học sinh" : "Thông tin bổ sung")}
                  {currentStep === 3 && "Thiết lập mật khẩu"}
                </h3>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {/* Step 1 */}
                  {currentStep === 1 && (
                    <>
                      {/* ... giữ nguyên step 1 của bạn ... */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <i
                            className="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                          <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="Nhập họ và tên đầy đủ"
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <i
                            className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="email@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      {role === "parent" && (
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
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                              placeholder="0123456789"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Step 2 (parent) */}
                  {currentStep === 2 && role === "parent" && (
                    <div className="space-y-4">
                      {/* ... giữ nguyên step 2 parent của bạn ... */}
                      <div className="bg-pink-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-pink-600 font-medium">Thông tin học sinh</p>
                      </div>

                      <div className="flex flex-row w-auto justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mối quan hệ
                          </label>
                          <select
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleChange}
                            className="w-full px-2 py-1.5 md:px-4 md:py-3.5 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                          >
                            <option value="">Chọn mối quan hệ</option>
                            <option value="mother">Mẹ</option>
                            <option value="father">Cha</option>
                            <option value="guardian">Giám hộ</option>
                            <option value="other">Khác</option>
                          </select>
                          {errors.relationship && (
                            <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên học sinh
                          </label>
                          <input
                            name="childName"
                            value={formData.childName}
                            onChange={handleChange}
                            className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="Nhập tên học sinh"
                          />
                          {errors.childName && (
                            <p className="text-red-500 text-sm mt-1">{errors.childName}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row w-auto justify-between gap-4">
                        <div className="w-[65%]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên username của học sinh
                          </label>
                          <input
                            name="childUsername"
                            value={formData.childUsername}
                            onChange={handleChange}
                            className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="Nhập username của học sinh"
                          />
                          {errors.childUsername && (
                            <p className="text-red-500 text-sm mt-1">{errors.childUsername}</p>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khối lớp
                          </label>
                          <select
                            name="childGrade"
                            value={formData.childGrade}
                            onChange={handleChange}
                            className="w-full px-2 py-1.5 md:px-4 md:py-3.5 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                          >
                            <option value="">Chọn lớp</option>
                            {[...Array(5)].map((_, i) => (
                              <option key={i} value={`grade${i + 1}`}>
                                Lớp {i + 1}
                              </option>
                            ))}
                          </select>
                          {errors.childGrade && (
                            <p className="text-red-500 text-sm mt-1">{errors.childGrade}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email của học sinh
                        </label>
                        <div className="relative">
                          <i
                            className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                          <input
                            name="childEmail"
                            type="email"
                            value={formData.childEmail}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="email@example.com"
                          />
                        </div>
                        {errors.childEmail && (
                          <p className="text-red-500 text-sm mt-1">{errors.childEmail}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ✅ Step 2 (student) - thêm chọn khối lớp */}
                  {currentStep === 2 && role === "student" && (
                    <div className="space-y-4">
                      <div className="bg-pink-50 rounded-xl p-4">
                        <p className="text-sm text-pink-600 font-medium">
                          Thông tin bổ sung
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Khối lớp
                        </label>
                        <select
                          name="studentGrade"
                          value={formData.studentGrade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                        >
                          <option value="">Chọn khối lớp</option>
                          {[...Array(5)].map((_, i) => (
                            <option key={i} value={`grade${i + 1}`}>
                              Lớp {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors.studentGrade && (
                          <p className="text-red-500 text-sm mt-1">{errors.studentGrade}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {currentStep === 3 && (
                    <>
                      {/* ... giữ nguyên step 3 của bạn ... */}
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
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                            placeholder="Ít nhất 6 ký tự"
                          />
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 outline-none transition"
                          placeholder="Nhập lại mật khẩu"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
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
                        {errors.agreeToTerms && (
                          <p className="text-red-500 text-sm mt-2">{errors.agreeToTerms}</p>
                        )}
                      </div>
                    </>
                  )}
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
          )}
        </div>
      </div>
    </div>
  );
}
