import React, { useState } from "react";
import logo from "../../assets/logo-02.webp";
import { Link } from "react-router-dom";

// ✅ import đúng component modal
import LoginModal from "../../pages/Customer/LoginPage/LoginPage";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ state cho modal đăng nhập (không còn role)
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItemClass =
    "flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition";

  const mobileItemClass =
    "flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50 hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg";

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <>
      <header className="w-full border-b px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm border-border bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/">
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
            <Link to="/" className={navItemClass}>
              <i className="fa-solid fa-house text-xl" aria-hidden="true" />
              <span>Trang chủ</span>
            </Link>

            <Link to="/courses" className={navItemClass}>
              <i className="fa-solid fa-book-open text-xl" aria-hidden="true" />
              <span>Khóa học</span>
            </Link>

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
            <button className="relative p-[2px] md:p-[3px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] group transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
              <span className="px-3 py-1.5 md:px-5 md:py-2 bg-white rounded-full text-[#7E82E4] text-xs md:text-sm font-bold transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
                Bắt đầu dùng thử
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {isMenuOpen ? (
                <i className="fa-solid fa-xmark text-2xl" aria-hidden="true" />
              ) : (
                <i className="fa-solid fa-bars text-2xl" aria-hidden="true" />
              )}
            </button>

            {/* ✅ Login button (desktop) -> mở modal */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={openLogin}
                className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                aria-label="Đăng nhập"
                title="Đăng nhập"
              >
                <i
                  className="fa-regular fa-circle-user text-[28px]"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">Đăng nhập</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out
            ${
              isMenuOpen
                ? "max-h-[460px] opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }
          `}
        >
          <nav className="flex flex-col p-6 bg-white">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={mobileItemClass}
            >
              <i
                className="fa-regular fa-house text-2xl text-indigo-500"
                aria-hidden="true"
              />
              <span>Trang chủ</span>
            </Link>

            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className={mobileItemClass}
            >
              <i
                className="fa-regular fa-book-open text-2xl text-indigo-500"
                aria-hidden="true"
              />
              <span>Khóa học</span>
            </Link>

            <Link
              to="/about-us"
              onClick={() => setIsMenuOpen(false)}
              className={mobileItemClass}
            >
              <i
                className="fa-regular fa-circle-info text-2xl text-indigo-500"
                aria-hidden="true"
              />
              <span>Giới thiệu</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={mobileItemClass}
            >
              <i
                className="fa-regular fa-phone text-2xl text-indigo-500"
                aria-hidden="true"
              />
              <span>Liên hệ</span>
            </Link>

            {/* ✅ Login (mobile) -> mở modal */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                openLogin();
              }}
              className={mobileItemClass}
            >
              <i
                className="fa-regular fa-right-to-bracket text-2xl text-indigo-500"
                aria-hidden="true"
              />
              <span>Đăng nhập</span>
            </button>

            <div className="pt-4 text-gray-400 text-sm">
              © {new Date().getFullYear()} STEMotion App
            </div>
          </nav>
        </div>
      </header>

      {/* ✅ Render modal ở đây (không truyền role nữa) */}
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
}
