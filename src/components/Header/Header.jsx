import React, { useState } from "react";
import logo from "../../assets/logo-02.webp";
import { Link, useNavigate } from "react-router-dom";

import LoginModal from "../../pages/Customer/LoginPage/LoginForm";
import useAuth from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  // const { isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItemClass =
    "flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition";

  const mobileItemClass =
    "flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50 hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg";

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const handleCloseLogin = () => {
    closeLogin();
    // không cần dispatch storage nữa vì dùng context rồi
  };

  const { isAuthenticated, logout, user } = useAuth();
  const homePath = user?.role === "parent" ? "/parent/dashboard" : "/";


  return (
    <>
      <header className="w-full border-b px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm border-border bg-white backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          {/* <Link to="/"> */}
          <Link to={homePath} >
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

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className={navItemClass}> */}
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


            {user?.role === "parent" && (
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

          {/* Right: Action Buttons */}
          <div className="flex items-center justify-end space-x-3 md:space-x-4">
            {/* Trial button */}
            {/* <Link to="/trial/courses/toan-hoc-485b6ae3-b9d9-4687-94b8-0a5d5f63abd8/chapter/chuong-1-lam-quen-voi-so-tu-0-den-10-ed682078-ff82-4e16-8f09-2a968ac3369f/lesson/bai-2-dem-so-tu-6-den-10-b7f70ed3-320b-4f01-b20f-9ae90835e52e"
            >
              <button className="relative p-[2px] md:p-[3px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] group transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
                <span className="px-3 py-1.5 md:px-5 md:py-2 bg-white rounded-full text-[#7E82E4] text-xs md:text-sm font-bold transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                  Bắt đầu dùng thử
                </span>
              </button>
            </Link> */}
            {/* Mobile menu toggle */}
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

            {/* Login/Logout (desktop) */}
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
                <button
                  type="button"
                  onClick={openLogin}
                  className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  aria-label="Đăng nhập"
                  title="Đăng nhập"
                >
                  <i className="fa-regular fa-circle-user text-[28px]" aria-hidden="true" />
                  <span className="text-sm font-medium">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <nav className="flex flex-col p-6 bg-white">
            {/* <Link to="/" onClick={() => setIsMenuOpen(false)} className={mobileItemClass}> */}
            <Link to={homePath} onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
              <i className="fa-solid fa-house text-2xl text-indigo-500" aria-hidden="true" />
              <span>Trang chủ</span>
            </Link>

            {user?.role !== "parent" && (
              <Link to="/courses" onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
                <i className="fa-solid fa-book-open text-2xl text-indigo-500" aria-hidden="true" />
                <span>Khóa học</span>
              </Link>
            )}


            {user?.role === "parent" && (
              <Link
                to="/subscription"
                onClick={() => setIsMenuOpen(false)}
                className={mobileItemClass}
              >
                <i className="fa-solid fa-angles-up text-2xl text-indigo-500" aria-hidden="true" />
                <span>Nâng cấp premium</span>
              </Link>
            )}

            <Link to="/about-us" onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
              <i className="fa-solid fa-circle-info text-2xl text-indigo-500" aria-hidden="true" />
              <span>Giới thiệu</span>
            </Link>

            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={mobileItemClass}>
              <i className="fa-solid fa-phone text-2xl text-indigo-500" aria-hidden="true" />
              <span>Liên hệ</span>
            </Link>

            {/* Login/Logout (mobile) */}
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
                  <i className="fa-regular fa-circle-user text-2xl text-indigo-500" aria-hidden="true" />
                  <span>{user?.role === "parent" ? "Hồ sơ phụ huynh" : "Hồ sơ học sinh"}</span>
                </button>

                <button type="button" onClick={handleLogout} className={mobileItemClass}>
                  <i className="fa-solid fa-right-from-bracket text-2xl text-red-500" aria-hidden="true" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  openLogin();
                }}
                className={mobileItemClass}
              >
                <i className="fa-solid fa-right-to-bracket text-2xl text-indigo-500" aria-hidden="true" />
                <span>Đăng nhập</span>
              </button>
            )}

            <div className="pt-4 text-gray-400 text-sm">
              © {new Date().getFullYear()} STEMotion App
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />
    </>
  );
}
