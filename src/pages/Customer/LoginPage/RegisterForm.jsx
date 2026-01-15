// import { useState, useMemo, useCallback } from "react";
// import NotificationModal from "../../../components/Nofication/NotificationModal";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { authService } from "../../../services";

// // Constants
// const INITIAL_FORM_STATE = {
//   fullName: "",
//   phoneNumber: "",
//   password: ""
// };

// const ERROR_MESSAGES = {
//   VALIDATION_FAILED: "Vui lòng nhập đúng thông tin yêu cầu.",
//   TIMEOUT: "Kết nối timeout. Vui lòng kiểm tra kết nối mạng và thử lại.",
//   INVALID_INFO: "Thông tin không hợp lệ. Vui lòng kiểm tra lại.",
//   SERVICE_NOT_FOUND: "Không tìm thấy dịch vụ. Vui lòng thử lại sau.",
//   REGISTER_FAILED: "Đăng ký thất bại. Vui lòng thử lại.",
//   UNKNOWN_ERROR: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
//   REGISTER_SUCCESS: "Đăng ký thành công! Vui lòng đăng nhập."
// };

// const PHONE_REGEX = /^\d{9,11}$/;
// const PASSWORD_RULES = {
//   LENGTH: { min: 8, max: 32 },
//   UPPER_CASE: /[A-Z]/,
//   LOWER_CASE: /[a-z]/,
//   DIGIT: /\d/
// };

// // Validation utilities
// const validatePhone = (phone) => PHONE_REGEX.test(phone);

// const validatePassword = (password) => {
//   return {
//     length: password.length >= PASSWORD_RULES.LENGTH.min && password.length <= PASSWORD_RULES.LENGTH.max,
//     upper: PASSWORD_RULES.UPPER_CASE.test(password),
//     lower: PASSWORD_RULES.LOWER_CASE.test(password),
//     digit: PASSWORD_RULES.DIGIT.test(password)
//   };
// };

// const isPasswordValid = (rules) => Object.values(rules).every(Boolean);

// // Error handler utility
// const getErrorMessage = (error) => {
//   if (error.code === 'ECONNABORTED') {
//     return ERROR_MESSAGES.TIMEOUT;
//   }
//   if (error.response?.data?.message) {
//     return error.response.data.message;
//   }
//   if (error.response?.status === 401) {
//     return ERROR_MESSAGES.INVALID_INFO;
//   }
//   if (error.response?.status === 404) {
//     return ERROR_MESSAGES.SERVICE_NOT_FOUND;
//   }
//   return ERROR_MESSAGES.UNKNOWN_ERROR;
// };

// // Components
// const FloatingLabel = ({ htmlFor, required, children }) => (
//   <label
//     htmlFor={htmlFor}
//     className="absolute left-4 top-3 text-gray-500 transition-all duration-300 ease-in-out 
//                pointer-events-none 
//                peer-placeholder-shown:text-base peer-placeholder-shown:top-3 
//                peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-[#00c9a7] 
//                peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium
//                peer-[&:not(:placeholder-shown)]:top-[-8px] peer-[&:not(:placeholder-shown)]:text-sm 
//                peer-[&:not(:placeholder-shown)]:text-[#00c9a7] peer-[&:not(:placeholder-shown)]:bg-white 
//                peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:font-medium
//                z-10"
//   >
//     {children} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// const PasswordRequirement = ({ isValid, text }) => (
//   <li className="flex items-center gap-2">
//     <span className={`w-2 h-2 rounded-full ${isValid ? "bg-green-500" : "bg-gray-300"}`} />
//     {text}
//   </li>
// );

// // Main Component
// const RegisterForm = ({ onBackToLogin }) => {
//   // State management
//   const [formData, setFormData] = useState(INITIAL_FORM_STATE);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
//   const [modalInfo, setModalInfo] = useState({ 
//     isOpen: false, 
//     message: "", 
//     type: "success" 
//   });

//   // Memoized validation
//   const phoneValid = useMemo(() => validatePhone(formData.phoneNumber), [formData.phoneNumber]);
//   const passwordRules = useMemo(() => validatePassword(formData.password), [formData.password]);
//   const passwordValid = useMemo(() => isPasswordValid(passwordRules), [passwordRules]);
//   const canSubmit = useMemo(
//     () => formData.fullName.trim() && phoneValid && passwordValid,
//     [formData.fullName, phoneValid, passwordValid]
//   );

//   // Event handlers
//   const handleInputChange = useCallback((field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const handlePhoneChange = useCallback((e) => {
//     const numericValue = e.target.value.replace(/\D/g, "");
//     handleInputChange("phoneNumber", numericValue);
//   }, [handleInputChange]);

//   const togglePasswordVisibility = useCallback(() => {
//     setShowPassword(prev => !prev);
//   }, []);

//   const showModal = useCallback((message, type) => {
//     setModalInfo({ isOpen: true, message, type });
//   }, []);

//   const closeModal = useCallback(() => {
//     setModalInfo(prev => ({ ...prev, isOpen: false }));
//     if (isRegisterSuccess) {
//       setIsRegisterSuccess(false);
//       onBackToLogin();
//     }
//   }, [isRegisterSuccess, onBackToLogin]);

//   const resetForm = useCallback(() => {
//     setFormData(INITIAL_FORM_STATE);
//   }, []);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!canSubmit) {
//       showModal(ERROR_MESSAGES.VALIDATION_FAILED, "error");
//       return;
//     }

//     try {
//       const response = await authService.register(formData);

//       if (response.data?.success === true) {
//         showModal(
//           response.data.message || ERROR_MESSAGES.REGISTER_SUCCESS,
//           "success"
//         );

//         resetForm();
//         setIsRegisterSuccess(true);
//       } else {
//         showModal(
//           response.data?.message || ERROR_MESSAGES.REGISTER_FAILED,
//           "error"
//         );
//       }
//     } catch (error) {
//       showModal(getErrorMessage(error), "error");
//     }
//   };

//   // Render
//   return (
//     <div className="space-y-4">
//       <NotificationModal
//         isOpen={modalInfo.isOpen}
//         message={modalInfo.message}
//         type={modalInfo.type}
//         onClose={closeModal}
//       />

//       <h2 className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h2>

//       <form className="space-y-4" onSubmit={handleRegister} noValidate>
//         {/* Full Name Input */}
//         <div className="relative group">
//           <input
//             type="text"
//             id="fullName"
//             className="peer w-full px-2 py-1 md:px-4 md:py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg 
//                        focus:outline-none focus:border-[#00c9a7] 
//                        transition-colors duration-300 ease-in-out
//                        placeholder-transparent"
//             placeholder=" "
//             value={formData.fullName}
//             onChange={(e) => handleInputChange("fullName", e.target.value)}
//             required
//           />
//           <FloatingLabel htmlFor="fullName" required>
//             Họ và tên
//           </FloatingLabel>
//         </div>

//         {/* Phone Number Input */}
//         <div className="relative group">
//           <input
//             type="tel"
//             id="phoneNumber"
//             className={`peer w-full px-2 py-1 md:px-4 md:py-3 text-gray-900 bg-white border-2 rounded-lg 
//                        focus:outline-none focus:border-[#00c9a7] 
//                        transition-colors duration-300 ease-in-out
//                        placeholder-transparent
//                        ${formData.phoneNumber && !phoneValid ? "border-red-300" : "border-gray-300"}`}
//             placeholder=" "
//             value={formData.phoneNumber}
//             onChange={handlePhoneChange}
//             inputMode="numeric"
//             pattern="[0-9]{9,11}"
//             required
//           />
//           <FloatingLabel htmlFor="phoneNumber" required>
//             Số điện thoại
//           </FloatingLabel>
//         </div>

//         <div className="relative group">
//           <input
//             type={showPassword ? "text" : "password"}
//             id="password"
//             className={`peer w-full px-2 py-1 md:px-4 md:py-3 pr-12 text-gray-900 bg-white border-2 rounded-lg
//                        focus:outline-none focus:border-[#00c9a7] 
//                        transition-colors duration-300 ease-in-out
//                        placeholder-transparent
//                        ${formData.password && !passwordValid ? "border-red-300" : "border-gray-300"}`}
//             placeholder=" "
//             value={formData.password}
//             onChange={(e) => handleInputChange("password", e.target.value)}
//             required
//           />
//           <FloatingLabel htmlFor="password" required>
//             Mật khẩu
//           </FloatingLabel>
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00c9a7] 
//                        transition-colors duration-200 focus:outline-none z-20"
//             aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
//           >
//             {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
//           </button>
//         </div>

//         {/* Password Requirements */}
//         <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
//           <ul className="space-y-2">
//             <PasswordRequirement isValid={passwordRules.length} text="Giới hạn từ 8-32 ký tự." />
//             <PasswordRequirement isValid={passwordRules.upper} text="Tối thiểu 01 ký tự IN HOA." />
//           </ul>
//           <ul className="space-y-2">
//             <PasswordRequirement isValid={passwordRules.lower} text="Tối thiểu 01 ký tự in thường." />
//             <PasswordRequirement isValid={passwordRules.digit} text="Tối thiểu 01 chữ số." />
//           </ul>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={!canSubmit}
//           className={`w-full px-2 py-1 md:px-4 md:py-3 text-lg font-semibold rounded-2xl transition-all duration-200 ease-in-out
//                      focus:outline-none focus:ring-2 focus:ring-offset-2
//                      ${canSubmit 
//                        ? "bg-[#00c9a7] hover:bg-[#0b5e54] text-white focus:ring-[#00c9a7] transform hover:scale-[1.02]" 
//                        : "bg-gray-200 text-gray-500 cursor-not-allowed focus:ring-gray-400"
//                      }`}
//         >
//           Đăng ký
//         </button>
//       </form>

//       {/* Login Link */}
//       <div className="text-center pt-2">
//         <span className="text-sm text-gray-600 mr-2">Đã có tài khoản?</span>
//         <button 
//           type="button"
//           onClick={onBackToLogin} 
//           className="text-sm font-medium text-gray-900 hover:text-[#00c9a7] hover:underline 
//                      transition-colors duration-200 ease-in-out
//                      focus:outline-none rounded"
//         >
//           Đăng nhập ngay
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUsers,
  FaUserGraduate,
  FaChevronLeft,
  FaCheck
} from "react-icons/fa";

export default function Register({ defaultRole }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(defaultRole || "");
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
    childGrade: "",
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
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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

  // Steps configuration
  const steps = [
    { number: 1, title: "Thông tin cơ bản" },
    { number: 2, title: role === "parent" ? "Thông tin học sinh" : "Thông tin bổ sung" },
    { number: 3, title: "Mật khẩu & Xác nhận" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-4xl h-auto md:h-[625px] flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white">

        {/* Left Side - Branding & Steps */}
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
                {[
                  { key: "student", label: "Học sinh", icon: FaUserGraduate },
                  { key: "parent", label: "Phụ huynh", icon: FaUsers },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setRole(key)}
                    className="w-full flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <Icon className="text-xl" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentStep >= step.number
                        ? "bg-white/20"
                        : "bg-white/5"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.number
                        ? "bg-white text-pink-600"
                        : "bg-white/20 text-white"
                        }`}>
                        {currentStep > step.number ? <FaCheck /> : step.number}
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

        {/* Right Side - Form */}
        <div className="lg:w-3/5 p-8 flex flex-col">
          {role && (
            <>
              {/* Header with back button */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => currentStep === 1 ? setRole("") : handlePrevStep()}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
                >
                  <FaChevronLeft />
                  Quay lại
                </button>
                <span className="text-sm font-medium text-gray-500">
                  Bước {currentStep}/3
                </span>
              </div>

              <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentStep === 1 && "Thông tin tài khoản"}
                  {currentStep === 2 && (role === "parent" ? "Thông tin học sinh" : "Thông tin bổ sung")}
                  {currentStep === 3 && "Thiết lập mật khẩu"}
                </h3>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg   focus:border-pink-500 outline-none transition"
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
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg  focus:border-pink-500 outline-none transition"
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
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg   focus:border-pink-500 outline-none transition"
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

                  {/* Step 2: Student Info (Parent) */}
                  {currentStep === 2 && role === "parent" && (
                    <div className="space-y-4">
                      <div className="bg-pink-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-pink-600 font-medium">
                          Thông tin học sinh
                        </p>
                      </div>

                      <div className="flex flex-row w-auto justify-between">
                        <div>
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên học sinh
                          </label>
                          <input
                            name="childName"
                            value={formData.childName}
                            onChange={handleChange}
                            className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg   focus:border-pink-500 outline-none transition"
                            placeholder="Nhập tên học sinh"
                          />
                          {errors.childName && (
                            <p className="text-red-500 text-sm mt-1">{errors.childName}</p>
                          )}
                        </div>
                      </div>



                      <div className="flex flex-row w-auto justify-between">

                        <div className="w-[65%]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên username của học sinh
                          </label>
                          <input
                            name="childName"
                            value={formData.childName}
                            onChange={handleChange}
                            className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg  focus:border-pink-500 outline-none transition"
                            placeholder="Nhập tên username của học sinh"
                          />
                          {errors.childName && (
                            <p className="text-red-500 text-sm mt-1">{errors.childName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khối lớp
                          </label>
                          <select
                            name="childGrade"
                            value={formData.childGrade}
                            onChange={handleChange}
                            className="w-full px-2 py-1.5 md:px-4 md:py-3.5 border-2 border-gray-300  rounded-lg   focus:border-pink-500 outline-none transition"
                          >
                            <option value="">Chọn khối lớp</option>
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
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg  focus:border-pink-500 outline-none transition"
                            placeholder="Nhập email của học sinh. VD:email@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Password & Terms */}
                  {currentStep === 3 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg   focus:border-pink-500 outline-none transition"
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
                          className="w-full px-2 py-1 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg   focus:border-pink-500 outline-none transition"
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

                {/* Action Buttons */}
                <div className="pt-6 mt-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : currentStep === 3
                        ? "Tạo tài khoản"
                        : "Tiếp theo"
                    }
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