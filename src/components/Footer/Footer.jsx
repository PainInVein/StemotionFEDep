import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import logo from '../../assets/logo-02.webp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 md:py-20 px-6 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-10 md:gap-12 mb-16 items-start">
          <div className="sm:col-span-3 md:col-span-2">
            <div className='flex items-center mb-6'> 
              <img src={logo} alt="Logo STEMotion" className="h-10 mr-3" width={40} height={40} loading="lazy" decoding="async" />
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight">STEMotion</h2>
            </div>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm">
              Mang đến trải nghiệm học Toán tương tác giúp
              học sinh tiểu học vừa học, vừa chơi
              và khám phá kiến thức một cách tự nhiên.
            </p>
          </div>

          <div className="md:pt-2">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold mb-5 uppercase tracking-wider">Về ứng dụng</h3>
            <ul className="space-y-3 md:space-y-4 text-gray-200 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Khóa học</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quy tắc</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hỗ trợ</a></li>
            </ul>
          </div>

          <div className="md:pt-2">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold mb-5 uppercase tracking-wider">Về công ty</h3>
            <ul className="space-y-3 md:space-y-4 text-gray-200 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div className="flex space-x-6 text-2xl text-gray-400 md:pt-1 md:justify-end">
            <a href="https://www.facebook.com/profile.php?id=61584193513025" className="hover:text-white transition-transform hover:scale-110"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition-transform hover:scale-110"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition-transform hover:scale-110"><FaXTwitter /></a>
            <a href="#" className="hover:text-white transition-transform hover:scale-110"><FaLinkedin /></a>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-xs text-gray-500 border-t border-gray-800 pt-8">
          <a href="#" className="hover:text-gray-300">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-gray-300">Chính sách bảo mật</a>
          <a href="#" className="hover:text-gray-300">Không bán thông tin cá nhân của người dùng</a>
          <p> © {currentYear} STEMotion. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}