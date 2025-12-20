import React from 'react';
// 1. Import useNavigate thay vì Link
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiTool } from 'react-icons/fi';
import { RiAuctionFill } from "react-icons/ri";
import Spline from '@splinetool/react-spline';

// 2. Import các hooks và modal cần thiết (dựa theo đường dẫn của Header.jsx)
import { useAuthCheck } from "../../hooks/useAuthCheck";
import LoginModal from "../../pages/Customer/LoginPage/LoginPage";
import heroSectionImage from "../../assets/img/heroSection.jpg";

/**
 * HeroSection: Component chính cho trang chủ
 * Đã tích hợp logic yêu cầu đăng nhập (requireAuth)
 */
const HeroSection = () => {


    const navigate = useNavigate();
    const { requireAuth, showLoginModal, handleLoginSuccess, closeLoginModal } = useAuthCheck();

    return (
        <>
            <section className="relative w-full h-[65vh] text-white mt-16 flex items-center justify-center overflow-hidden">
                
                {/* Hero Section Background Image */}
                <div 
                    className="absolute inset-0 bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${heroSectionImage})`,
                        backgroundSize: '110%',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                
                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {/* Buttons - Left and Right */}
                    <div className="absolute bottom-8 left-0 right-0 pointer-events-none">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                            
                            {/* Left Button - Đăng Tin Bán */}
                            <button
                                onClick={() => requireAuth(() => navigate('/post-item'))}
                                className="pointer-events-auto flex items-center justify-center px-6 py-3 bg-white/90 hover:bg-white text-cyan-600 font-bold text-base rounded-full shadow-2xl backdrop-blur-sm transition-all transform hover:scale-110"
                            >
                                <FiPlusCircle className="w-5 h-5 mr-2" />
                                <span>Đăng Tin Bán</span>
                            </button>

                            {/* Right Button - Tìm Dịch Vụ */}
                            <button
                                onClick={() => requireAuth(() => navigate('/plans'))}
                                className="pointer-events-auto flex items-center justify-center px-6 py-3 bg-white/90 hover:bg-white text-green-600 font-bold text-base rounded-full shadow-2xl backdrop-blur-sm transition-all transform hover:scale-110"
                            >
                                <FiTool className="w-5 h-5 mr-2" />
                                <span>Tìm Dịch Vụ</span>
                            </button>

                        </div>
                    </div>
                </div>

            </section>

            {/* 6. Render LoginModal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={closeLoginModal}
                onLoginSuccess={handleLoginSuccess}
                navigate={navigate}
            />
        </>
    );
};

export default HeroSection;