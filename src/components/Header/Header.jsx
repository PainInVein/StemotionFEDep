import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo-02.webp";
import { Link, useNavigate } from "react-router-dom";

import LoginModal from "../../pages/Customer/LoginPage/LoginForm";
import useAuth from "../../contexts/AuthContext";
import { getPaymentService } from "../../services/subscription/subscription.service";

export default function Header() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("student");
  const dropdownRef = useRef(null);

  const { isAuthenticated, logout, user } = useAuth();
  const homePath = user?.role === "parent" ? "/parent/dashboard" : "/";

  const [hasPremium, setHasPremium] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // modal thông báo nâng cấp premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const navItemClass =
    "flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition";

  const mobileItemClass =
    "flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50 hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg";

  const openLogin = (role = "student") => {
    setLoginRole(role);
    setIsLoginOpen(true);
    setIsLoginDropdownOpen(false);
  };

  const closeLogin = () => setIsLoginOpen(false);

  const handleLogout = () => {
    logout();
    setHasPremium(false);
    setShowPremiumModal(false);
    setIsMenuOpen(false);

    // reset cờ popup cho phiên mới sau
    sessionStorage.removeItem("premium-popup-shown");

    navigate("/", { replace: true });
  };

  const handleCloseLogin = () => {
    closeLogin();
  };

  const handleUpgradeClick = () => {
    setShowPremiumModal(false);
    setIsMenuOpen(false);
    navigate("/subscription");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // check payment cho parent
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!isAuthenticated || user?.role !== "parent" || !user?.userId) {
        setHasPremium(false);
        setShowPremiumModal(false);
        return;
      }

      try {
        setIsCheckingPayment(true);
        const paid = await getPaymentService(user.userId);
        setHasPremium(paid);

        // nếu chưa mua premium thì hiện popup 1 lần trong session
        if (!paid) {
          const popupShown = sessionStorage.getItem("premium-popup-shown");
          if (!popupShown) {
            setShowPremiumModal(true);
            sessionStorage.setItem("premium-popup-shown", "true");
          }
        } else {
          setShowPremiumModal(false);
        }
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái premium:", error);
        setHasPremium(false);
      } finally {
        setIsCheckingPayment(false);
      }
    };

    checkPaymentStatus();
  }, [isAuthenticated, user?.userId, user?.role]);

  // chỉ hiện nút nâng cấp khi parent chưa mua premium
  const shouldShowUpgradeButton =
    isAuthenticated &&
    user?.role === "parent" &&
    !isCheckingPayment &&
    hasPremium === false;

  return (
    <>
      <header className="w-full border-b px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm border-border bg-white backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={homePath}>
            <div className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-7 md:h-8 mr-2"
                width={32}
                height={32}
                decoding="async"
                loading="eager"
              />
              <span className="text-lg md:text-xl font-bold tracking-tight text-indigo-500">
                STEM
                <span className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">
                  otion
                </span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to={homePath} className={navItemClass}>
              <i className="fa-solid fa-house text-xl" aria-hidden="true" />
              <span>Trang chủ</span>
            </Link>

            {user?.role !== "parent" && (
              <Link to="/courses" className={navItemClass}>
                <i className="fa-solid fa-book-open text-xl" aria-hidden="true" />
                <span>Khóa học</span>
              </Link>
            )}

            {shouldShowUpgradeButton && (
              <Link to="/subscription" className={navItemClass}>
                <i className="fa-solid fa-angles-up text-xl" aria-hidden="true" />
                <span>Nâng cấp premium</span>
              </Link>
            )}

            <Link to="/about-us" className={navItemClass}>
              <i className="fa-solid fa-circle-info text-xl" aria-hidden="true" />
              <span>Giới thiệu</span>
            </Link>

            <Link to="/contact" className={navItemClass}>
              <i className="fa-solid fa-phone text-xl" aria-hidden="true" />
              <span>Liên hệ</span>
            </Link>
          </nav>

          <div className="flex items-center justify-end space-x-3 md:space-x-4">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMenuOpen ? (
                <i className="fa-solid fa-xmark text-2xl" aria-hidden="true" />
              ) : (
                <i className="fa-solid fa-bars text-2xl" aria-hidden="true" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                    aria-label="Hồ sơ"
                    title="Hồ sơ"
                  >
                    <i className="fa-regular fa-circle-user text-[22px]" aria-hidden="true" />
                    <span className="text-sm font-medium">
                      {user?.role === "parent" ? "Hồ sơ phụ huynh" : "Hồ sơ học sinh"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    aria-label="Đăng xuất"
                    title="Đăng xuất"
                  >
                    <i className="fa-solid fa-right-from-bracket text-[20px]" aria-hidden="true" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 transition"
                  >
                    Đăng ký tài khoản
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                      aria-label="Đăng nhập"
                      title="Đăng nhập"
                    >
                      <i className="fa-regular fa-circle-user text-[28px]" aria-hidden="true" />
                      <span className="text-sm font-medium">Đăng nhập</span>
                      <i
                        className={`fa-solid fa-chevron-down text-xs ml-1 transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isLoginDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <button
                          onClick={() => openLogin("student")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                            <i className="fa-solid fa-user-graduate" />
                          </div>
                          <div>
                            <div className="font-semibold">Học sinh</div>
                            <div className="text-xs text-gray-500 font-normal">
                              Truy cập lộ trình học
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => openLogin("parent")}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                            <i className="fa-solid fa-user-tie" />
                          </div>
                          <div>
                            <div className="font-semibold">Phụ huynh</div>
                            <div className="text-xs text-gray-500 font-normal">
                              Quản lý nâng cấp tài khoản
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`
            md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <nav className="flex flex-col p-6 bg-white">
            <Link to={homePath} onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
              <i className="fa-solid fa-house text-2xl text-indigo-500" aria-hidden="true" />
              <span>Trang chủ</span>
            </Link>

            {user?.role !== "parent" && (
              <Link
                to="/courses"
                onClick={() => setIsMenuOpen(false)}
                className={mobileItemClass}
              >
                <i className="fa-solid fa-book-open text-2xl text-indigo-500" aria-hidden="true" />
                <span>Khóa học</span>
              </Link>
            )}

            {shouldShowUpgradeButton && (
              <Link
                to="/subscription"
                onClick={() => setIsMenuOpen(false)}
                className={mobileItemClass}
              >
                <i className="fa-solid fa-angles-up text-2xl text-indigo-500" aria-hidden="true" />
                <span>Nâng cấp premium</span>
              </Link>
            )}

            <Link
              to="/about-us"
              onClick={() => setIsMenuOpen(false)}
              className={mobileItemClass}
            >
              <i className="fa-solid fa-circle-info text-2xl text-indigo-500" aria-hidden="true" />
              <span>Giới thiệu</span>
            </Link>

            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
              <i className="fa-solid fa-phone text-2xl text-indigo-500" aria-hidden="true" />
              <span>Liên hệ</span>
            </Link>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className={mobileItemClass}
                >
                  <i
                    className="fa-regular fa-circle-user text-2xl text-indigo-500"
                    aria-hidden="true"
                  />
                  <span>{user?.role === "parent" ? "Hồ sơ phụ huynh" : "Hồ sơ học sinh"}</span>
                </button>

                <button type="button" onClick={handleLogout} className={mobileItemClass}>
                  <i
                    className="fa-solid fa-right-from-bracket text-2xl text-red-500"
                    aria-hidden="true"
                  />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col border-t border-gray-100 mt-2 pt-2">
                <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Đăng ký
                </div>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 mb-3 rounded-2xl bg-indigo-500 text-white font-semibold text-sm shadow-sm hover:bg-indigo-600 transition"
                >
                  Đăng ký tài khoản
                </Link>
                <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Đăng nhập
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openLogin("student");
                  }}
                  className={mobileItemClass}
                >
                  <i
                    className="fa-solid fa-user-graduate text-2xl text-indigo-500 w-8"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-start bg-transparent">
                    <span>Học sinh</span>
                    <span className="text-xs text-gray-400 font-normal">
                      Truy cập lộ trình học
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openLogin("parent");
                  }}
                  className={mobileItemClass}
                >
                  <i
                    className="fa-solid fa-user-tie text-2xl text-orange-500 w-8"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-start bg-transparent">
                    <span>Phụ huynh</span>
                    <span className="text-xs text-gray-400 font-normal">
                      Quản lý tài khoản con
                    </span>
                  </div>
                </button>
              </div>
            )}

            <div className="pt-4 text-gray-400 text-sm">
              © {new Date().getFullYear()} STEMotion App
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} role={loginRole} />

      {/* POPUP THÔNG BÁO CHƯA CÓ PREMIUM */}
      {showPremiumModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <i className="fa-solid fa-crown text-yellow-500 text-2xl" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Nâng cấp Premium để học thêm
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Tài khoản phụ huynh của bạn hiện chưa nâng cấp Premium. Nếu muốn học sinh có
                  thể học thêm và mở khóa toàn bộ nội dung, vui lòng nâng cấp gói Premium.
                </p>
              </div>

              <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-left space-y-2">
                {[
                  "Truy cập toàn bộ bài học",
                  "Không giới hạn luyện tập",
                  "Nội dung cập nhật thường xuyên",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-indigo-500 text-xs" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  <i className="fa-solid fa-crown mr-2" />
                  Nâng cấp Premium
                </button>

                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}