import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#050505] overflow-hidden text-white">
      {/* Background Stars - Các đốm sáng lấp lánh */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
      </div>

      {/* Hiệu ứng mây tinh vân (Nebula) */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse delay-700"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] animate-bounce">
          404
        </h1>
        
        <div className="mt-4 space-y-2">
          <h2 className="text-3xl font-bold tracking-widest uppercase">Mất tích giữa ngân hà</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Trang bạn đang tìm kiếm đã trôi dạt vào một hố đen hoặc chưa bao giờ tồn tại trong đa vũ trụ này.
          </p>
        </div>

        <Link
          to="/"
          className="mt-10 px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
        >
          QUAY LẠI TRÁI ĐẤT
        </Link>
      </div>

      {/* Decor: Hành tinh nhỏ */}
      <div className="absolute top-20 right-[15%] w-20 h-20 bg-gradient-to-tr from-orange-500 to-yellow-200 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] animate-spin-slow"></div>
      
      {/* CSS Inline để xử lý hiệu ứng sao rơi */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .stars {
          width: 2px;
          height: 2px;
          background: white;
          box-shadow: ${Array.from({ length: 100 }).map(() => 
            `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`
          ).join(',')};
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}