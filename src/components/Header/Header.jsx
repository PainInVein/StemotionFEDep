import React, { useState } from 'react';
import { HiOutlineHome, HiOutlineMenu, HiX } from "react-icons/hi"; // Thêm icon đóng HiX
import { PiBookOpenTextLight } from "react-icons/pi";
import logo from '../../assets/Logo_STEMotion-removebg-preview.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Bên trái: Logo */}
        <div className="flex items-center flex-shrink-0">
          <img src={logo} alt="Logo" className="h-7 md:h-8 mr-2" />
          <span className="text-lg md:text-xl font-bold tracking-tight text-indigo-500">
            STEM
            <span className="bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">
              otion
            </span>
          </span>
        </div>

        {/* Ở giữa: Navigation (Dành cho Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <HiOutlineHome className="text-xl" />
            <span>Trang chủ</span>
          </a>
          <a href="/courses" className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            <PiBookOpenTextLight className="text-xl" />
            <span>Khóa học</span>
          </a>
        </nav>

        {/* Bên phải: Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="relative p-[2px] md:p-[3px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] group transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
            <span className="px-3 py-1.5 md:px-5 md:py-2 bg-white rounded-full text-[#7E82E4] text-xs md:text-sm font-bold transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
              Start trial
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
      <div className={`
        fixed inset-0 top-[60px] bg-white z-40 transition-transform duration-300 ease-in-out md:hidden
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <nav className="flex flex-col p-6 space-y-6">
          <a
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-lg font-medium text-gray-600 border-b border-gray-50 pb-4"
          >
            <HiOutlineHome className="text-2xl text-indigo-500" />
            <span>Trang chủ</span>
          </a>
          <a
            href="/courses"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-4 text-lg font-medium text-gray-600 border-b border-gray-50 pb-4"
          >
            <PiBookOpenTextLight className="text-2xl text-indigo-500" />
            <span>Khóa học</span>
          </a>

          {/* Điểm số (UI cho học sinh) */}
          {/* <div className="hidden sm:flex items-center space-x-2">
       
          <div className="flex items-center space-x-1 px-3 py-1 bg-white border border-purple-100 rounded-full shadow-sm">
            <span className="text-sm font-bold text-purple-600">1</span>
            <PiSparkleFill className="text-purple-400" />
          </div>
          

          <div className="flex items-center space-x-1 px-3 py-1 bg-white border border-orange-100 rounded-full shadow-sm">
            <span className="text-sm font-bold text-orange-600">1</span>
            <PiLightningFill className="text-orange-400" />
          </div>
        </div> */}

          {/* Bạn có thể thêm các link khác vào đây cho Mobile */}
          <div className="pt-4 text-gray-400 text-sm">
            © {new Date().getFullYear()} STEMotion App
          </div>
        </nav>
      </div>
    </header>
  );
}