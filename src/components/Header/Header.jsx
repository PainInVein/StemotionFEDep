import React, { useState } from 'react';
import { HiOutlineHome, HiOutlineMenu, HiX } from "react-icons/hi"; // Thêm icon đóng HiX
import { AiOutlineInfoCircle, AiOutlinePhone } from "react-icons/ai";
import { PiBookOpenTextLight } from "react-icons/pi";
import logo from '../../assets/logo-02.webp';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full  border-b  px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm border-border bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Bên trái: Logo */}
        <Link to="/"><div className="flex items-center flex-shrink-0">
          <img src={logo} alt="Logo" className="h-7 md:h-8 mr-2" decoding="async" />
          <span className="text-lg md:text-xl font-bold tracking-tight text-indigo-500">
            STEM
            <span className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">
              otion
            </span>
          </span>
        </div></Link>

        {/* Ở giữa: Navigation (Dành cho Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <HiOutlineHome className="text-xl" />
            <span>Trang chủ</span>
          </Link>
          <Link to="/courses" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <PiBookOpenTextLight className="text-xl" />
            <span>Khóa học</span>
          </Link>
          <Link to="/about-us" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <AiOutlineInfoCircle className="text-xl" />
            <span>Giới thiệu</span>
          </Link>
          <Link to="/contact" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <AiOutlinePhone className="text-xl" />
            <span>Liên hệ</span>
          </Link>
        </nav>

        {/* Bên phải: Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="relative p-[2px] md:p-[3px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] group transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
            <span className="px-3 py-1.5 md:px-5 md:py-2 bg-white rounded-full text-[#7E82E4] text-xs md:text-sm font-bold transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
              Bắt đầu dùng thử
            </span>
          </button>

          {/* Mobile Menu Toggle - Chỉ hiện trên Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <HiX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      <div 
          className={`
            md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
        <nav className="flex flex-col p-6 bg-white">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50  hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg"
          >
            <HiOutlineHome className="text-2xl text-indigo-500" />
            <span>Trang chủ</span>
          </Link>
          <Link
            to="/courses"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50  hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg"
          >
            <PiBookOpenTextLight className="text-2xl text-indigo-500" />
            <span>Khóa học</span>
          </Link>
          <Link
            to="/about-us"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50 hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg"
          >
            <AiOutlineInfoCircle className="text-2xl text-indigo-500" />
            <span>Giới thiệu</span>
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-md font-medium text-gray-600 border-b border-gray-50 hover:text-indigo-500 hover:bg-indigo-50 py-3 pl-2 rounded-lg"
          >
            <AiOutlinePhone className="text-2xl text-indigo-500" />
            <span>Liên hệ</span>
          </Link>

          {/* Bạn có thể thêm các link khác vào đây cho Mobile */}
          <div className="pt-4 text-gray-400 text-sm">
            © {new Date().getFullYear()} STEMotion App
          </div>
        </nav>
      </div>
    </header>
  );
}