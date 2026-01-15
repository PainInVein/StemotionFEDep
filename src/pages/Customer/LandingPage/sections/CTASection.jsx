// src/pages/LandingPage/sections/CTASection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaRegHeart } from "react-icons/fa";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold">Bắt đầu hành trình STEM của bạn ngay hôm nay</h2>
        <p className="text-lg md:text-xl text-white/90">
          Tham gia cùng hàng nghìn học sinh tò mò khám phá khoa học qua trò chơi
        </p>

        <div className="flex gap-4 justify-center flex-wrap pt-4">
          <Link to="/register/student">
            <button className="flex items-center text-lg px-8 py-3 bg-white text-indigo-600 hover:bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] border-2 border-white hover:text-white rounded-full font-bold transition-all shadow-lg active:scale-95">
              <FaUsers className="mr-2 text-xl" />
              Đăng ký học sinh
            </button>
          </Link>

          <Link to="/register/parent">
            <button className="flex items-center text-lg px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] rounded-full font-bold transition-all shadow-lg active:scale-95">
              <FaRegHeart className="mr-2 text-xl" />
              Đăng ký phụ huynh
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
