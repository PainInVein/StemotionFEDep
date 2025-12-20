// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import RegisterForm from "./RegisterForm";
// import ForgotPasswordForm from "./ForgotPasswordForm";
// import VerifyOTP from "./VerifyOTP";
// import { toast } from "react-toastify";
// import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
// import { LoginVersionContext } from "../../../layouts/RootLayout";
// import { useAuth } from "../../../contexts/ScrollspyContext";
// import { authService } from "../../../services";

// const LoginModal = ({ isOpen, onClose, onLoginSuccess, navigate }) => {
//   const [activeForm, setActiveForm] = useState("login");
//   const [showVerifyOTP, setShowVerifyOTP] = useState(false);
//   const [loginData, setLoginData] = useState({
//     phoneNumber: "",
//     password: ""
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const loginVersionContext = useContext(LoginVersionContext);
//   const { login: authLogin } = useAuth();
  
//   // Safely destructure setLoginVersion with fallback
//   const setLoginVersion = loginVersionContext?.setLoginVersion || (() => {});

//   useEffect(() => {
//     if (!isOpen) {
//       setActiveForm("login");
//       setLoginData({ phoneNumber: "", password: "" });
//       setError("");
//     }
//   }, [isOpen]);


//   const handleFormChange = (form) => {
//     setActiveForm(form);
//   };

//   const handleClose = () => {
//     onClose();
//     setActiveForm("login");
//   };

//   const handleShowVerifyOTP = () => {
//     setActiveForm("");
//     setShowVerifyOTP(true);
//   };

//   const handleCloseVerifyOTP = () => {
//     setShowVerifyOTP(false);
//     setActiveForm("login");
//   };

//   const handleInputChange = (field, value) => {
//     setLoginData(prev => ({ ...prev, [field]: value }));
//     // Chỉ clear error khi user bắt đầu type, không clear khi đang loading
//     if (!isLoading) {
//       setError("");
//     }
//   };

//   const handleLogin = async (e) => {
//     // Ngăn chặn form submit mặc định
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
    
//     // Validate input
//     if (!loginData.phoneNumber || !loginData.password) {
//       setError("Vui lòng nhập đầy đủ thông tin");
//       return false;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await authService.login(loginData);
      
//       // Kiểm tra response thành công
//       if (response.data && response.data.success === true) {
//         // Login thành công
//         toast.success("Đăng nhập thành công!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
        
//         // Cập nhật auth context
//         if (authLogin) {
//           authLogin(response.data.data || response.data);
//         }
        
//         if (onLoginSuccess) {
//           onLoginSuccess(response.data);
//         }
        
//         // Đóng modal - không navigate về trang chủ nữa
//         // Vì onLoginSuccess sẽ xử lý navigation
//         onClose();
        
//       } else {
//         // Login thất bại - Hiển thị lỗi từ API, GIỮ modal mở
//         const errorMessage = response.data?.message || "Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại.";
//         setError(errorMessage);
//         return false;
//       }
//     } catch (error) {
//       // Xử lý các loại lỗi từ server
//       let errorMessage = "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.";
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = "Kết nối timeout. Vui lòng kiểm tra kết nối mạng và thử lại.";
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.status === 401) {
//         errorMessage = "Số điện thoại hoặc mật khẩu không đúng.";
//       } else if (error.response?.status === 404) {
//         errorMessage = "Tài khoản không tồn tại.";
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     try {
//       // Gọi authService để redirect đến Google OAuth
//       authService.googleLogin();
//     } catch (error) {
//       console.error('Google login error:', error);
//       toast.error("Có lỗi xảy ra khi đăng nhập Google. Vui lòng thử lại.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };


//   if (!isOpen) return null;

//   const renderForm = () => {
//     if (showVerifyOTP)
//       return <VerifyOTP onClose={handleCloseVerifyOTP} />;
//     if (activeForm === "register")
//       return <RegisterForm onBackToLogin={() => handleFormChange("login")} onShowVerifyOTP={handleShowVerifyOTP} />;
//     if (activeForm === "forgotPassword")
//       return (
//         <ForgotPasswordForm onBackToLogin={() => handleFormChange("login")} />
//       );

//     return (
//       <div className="space-y-4">
//         <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>

//         {/* Form đăng nhập với số điện thoại và mật khẩu */}
//         <form className="space-y-4" onSubmit={handleLogin} noValidate>
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           {/* Phone Input */}
//           <div className="relative group">
//             <input
//               type="tel"
//               id="phone"
//               className="peer w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg 
//                          focus:outline-none focus:border-[#00c9a7] 
//                          transition-colors duration-300 ease-in-out
//                          placeholder-transparent"
//               placeholder=" "
//               value={loginData.phoneNumber}
//               onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, ""))}
//               inputMode="numeric"
//               pattern="[0-9]{9,11}"
//               required
//             />
//             <label
//               htmlFor="phone"
//               className="absolute left-4 top-3 text-gray-500 transition-all duration-300 ease-in-out 
//                          pointer-events-none 
//                          peer-placeholder-shown:text-base peer-placeholder-shown:top-3 
//                          peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-[#00c9a7] 
//                          peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium
//                          peer-[&:not(:placeholder-shown)]:top-[-8px] peer-[&:not(:placeholder-shown)]:text-sm 
//                          peer-[&:not(:placeholder-shown)]:text-[#00c9a7] peer-[&:not(:placeholder-shown)]:bg-white 
//                          peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:font-medium
//                          z-10"
//             >
//               Số điện thoại *
//             </label>
//           </div>

//           {/* Password Input */}
//           <div className="relative group">
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               className="peer w-full px-4 py-3 pr-12 text-gray-900 bg-white border-2 border-gray-300 rounded-lg 
//                          focus:outline-none focus:border-[#00c9a7] 
//                          transition-colors duration-300 ease-in-out
//                          placeholder-transparent"
//               placeholder=" "
//               value={loginData.password}
//               onChange={(e) => handleInputChange("password", e.target.value)}
//               required
//             />
//             <label
//               htmlFor="password"
//               className="absolute left-4 top-3 text-gray-500 transition-all duration-300 ease-in-out 
//                          pointer-events-none 
//                          peer-placeholder-shown:text-base peer-placeholder-shown:top-3 
//                          peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-[#00c9a7] 
//                          peer-focus:bg-white peer-focus:px-2 peer-focus:font-medium
//                          peer-[&:not(:placeholder-shown)]:top-[-8px] peer-[&:not(:placeholder-shown)]:text-sm 
//                          peer-[&:not(:placeholder-shown)]:text-[#00c9a7] peer-[&:not(:placeholder-shown)]:bg-white 
//                          peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:font-medium
//                          z-10"
//             >
//               Mật khẩu *
//             </label>
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00c9a7] 
//                          transition-colors duration-200 focus:outline-none z-20"
//               aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
//             >
//               {showPassword ? (
//                 <FaEyeSlash className="w-5 h-5" />
//               ) : (
//                 <FaEye className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Forgot Password Link */}
//           <div className="text-right">
//             <button
//               type="button"
//               onClick={() => handleFormChange("forgotPassword")}
//               className="text-sm text-[#00c9a7] hover:text-[#0b5e54] hover:underline 
//                          transition-colors duration-200 ease-in-out font-medium"
//             >
//               Quên mật khẩu?
//             </button>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-3 px-6 bg-[#00c9a7] text-white font-semibold rounded-lg 
//                        hover:bg-[#0b5e54] focus:outline-none focus:ring-2 focus:ring-[#00c9a7] 
//                        focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02]
//                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//           >
//             {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
//           </button>
//         </form>

//         <div className="space-y-3">
//           {/* Divider */}
//           <div className="relative flex items-center">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="mx-4 text-gray-500 text-sm font-medium">Hoặc đăng nhập bằng</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           {/* Social Login Button - Google */}
//           <button 
//             type="button"
//             onClick={handleGoogleLogin} 
//             className="w-full h-12 rounded-2xl bg-white border-2 border-gray-300 hover:border-[#00c9a7] hover:bg-gray-50 
//                        transition-all duration-200 ease-in-out flex items-center justify-center gap-3
//                        focus:outline-none focus:border-[#00c9a7]
//                        font-medium text-gray-700"
//             aria-label="Đăng nhập bằng Google"
//           >
//             <FaGoogle className="text-lg text-red-500" />
//             <span>Đăng nhập bằng Google</span>
//           </button>

//           {/* Register Link */}
//           <div className="text-center pt-2">
//             <span className="text-sm text-gray-600 mr-2">Chưa có tài khoản?</span>
//             <button
//               type="button"
//               onClick={() => handleFormChange("register")}
//               className="text-sm font-medium text-gray-900 hover:text-[#00c9a7] hover:underline 
//                          transition-colors duration-200 ease-in-out
//                          focus:outline-none rounded"
//             >
//               Đăng ký ngay
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-[1100] overflow-y-auto">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
//         onClick={handleClose}
//         aria-hidden="true"
//       />
      
//       {/* Modal Container */}
//       <div className="flex min-h-screen items-center justify-center p-4">
//         <div className="relative bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden p-5
//                        transform transition-all duration-300 ease-in-out
//                        animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
//           {/* Close Button */}
//           <button
//             className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 
//                        transition-colors duration-200 ease-in-out
//                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full p-1"
//             onClick={handleClose}
//             aria-label="Đóng modal"
//           >
//             <span className="text-2xl leading-none">&times;</span>
//           </button>
          
//           {/* Form Content */}
//           {renderForm()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

import React, { useState } from 'react';
import { FaFacebook, FaApple, FaGoogle, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { HiOutlineUserCircle, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginModal({ isOpen, onClose, role = 'student' }) {
  const [showPassword, setShowPassword] = useState(false);

  // Cấu hình nội dung khác nhau dựa trên role
  const isStudent = role === 'student';
  const config = {
    title: isStudent ? "Đăng nhập Học sinh" : "Đăng nhập Phụ huynh",
    description: isStudent 
      ? "Khám phá lộ trình học tập và thử thách của bạn!" 
      : "Theo dõi quá trình học và tiến bộ của con bạn!",
    borderClass: isStudent 
      ? "from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B]" // Viền đa sắc cho học sinh
      : "from-gray-400 via-gray-500 to-gray-600",   // Viền tối giản hơn cho phụ huynh
    iconColor: isStudent ? "text-[#F8BB44]" : "text-gray-700",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay làm mờ background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="pointer-events-auto relative max-w-md w-full"
            >
              {/* Nút Close bên ngoài modal */}
              <button 
                onClick={onClose}
                className="absolute -top-12 right-0 text-white text-3xl hover:rotate-90 transition-transform"
              >
                <HiX />
              </button>

              {/* Viền Gradient bao quanh Modal */}
              <div className={`p-[2px] rounded-[40px] bg-gradient-to-br ${config.borderClass} shadow-2xl`}>
                
                <div className="bg-white rounded-[38px] px-8 py-10 flex flex-col items-center">
                  
                  {/* Icon Profile */}
                  <div className="mb-4">
                    <div className={`p-[3px] rounded-full bg-gradient-to-tr ${isStudent ? 'from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]' : 'from-gray-200 to-gray-400'}`}>
                        <div className="bg-white rounded-full p-1">
                          <HiOutlineUserCircle className={`text-6xl ${config.iconColor}`} />
                        </div>
                    </div>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
                  <p className="text-gray-500 text-center text-sm md:text-base mb-1">
                    {config.description}
                  </p>
                  <button className="text-gray-800 font-bold underline mb-8 hover:text-indigo-600 transition-colors">
                    Đăng ký miễn phí ngay
                  </button>

                  <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col">
                      <label className="text-gray-600 font-medium mb-1.5 ml-1 text-sm">Địa chỉ email</label>
                      <input 
                        type="email" 
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </div>

                    <div className="flex flex-col relative">
                      <label className="text-gray-600 font-medium mb-1.5 ml-1 text-sm">Mật khẩu</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-2 hover:text-gray-600"
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          <span className="text-xs font-medium">Ẩn</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-left">
                      <button className="text-gray-800 font-bold underline text-xs ml-1 hover:text-indigo-600">
                        Quên mật khẩu?
                      </button>
                    </div>

                    <button className={`w-full py-4 bg-[#CCCCCC] text-white text-lg font-bold rounded-full transition-all hover:bg-gradient-to-tr ${isStudent ? 'from-[#F8BB44] via-[#FE99BF] to-[#7E82E4]' : 'from-indigo-200 to-indigo-400'} active:scale-[0.98]`}>
                      Đăng nhập
                    </button>
                  </form>

                  {/* Social Login */}
                  <div className="flex justify-between w-full mt-8 gap-4 px-4">
                    {[FaFacebook, FaApple, FaGoogle].map((Icon, idx) => (
                      <button key={idx} className={`flex-1 p-[1px] rounded-full bg-gradient-to-br ${config.borderClass} hover:shadow-md transition-shadow`}>
                        <div className="bg-white rounded-full py-2.5 flex justify-center items-center">
                          <Icon className={`text-xl ${idx === 0 ? 'text-blue-600' : idx === 2 ? 'text-red-500' : 'text-black'}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}