// src/pages/LandingPage/sections/CTASection.jsx
import { Link } from "react-router-dom";

const GRADIENT = "from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44]";

export default function CTASection() {
  return (
    <section className="flex items-center px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6 py-16">
        <h2 className="py-2 text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#7E82E4] via-[#FE99BF] via-[#FBA889] to-[#F8BB44] bg-clip-text text-transparent">
          Bắt đầu hành trình STEM của bạn ngay hôm nay
        </h2>

        <p className="text-lg md:text-xl text-gray/90">
          Tham gia cùng hàng nghìn học sinh tò mò khám phá khoa học qua trò chơi
        </p>

        <div className="flex gap-4 justify-center flex-wrap pt-4">
          {/* Student */}
          <Link to="/register">
            <div
              className={`group inline-flex rounded-full bg-gradient-to-r ${GRADIENT} p-[2px] shadow-lg active:scale-95 transition`}
            >
              <button
                className="flex items-center text-lg px-8 py-3 rounded-full font-bold
                           bg-white transition-all
                           group-hover:bg-transparent group-hover:text-white"
              >
                {/* FaUsers -> FA users */}
                <i
                  className="fa-solid fa-users mr-2 text-xl text-[#7E82E4] group-hover:text-white transition-colors"
                  aria-hidden="true"
                />

                <span
                  className={`bg-gradient-to-r ${GRADIENT} bg-clip-text text-transparent group-hover:text-white`}
                >
                  Đăng ký học sinh
                </span>
              </button>
            </div>
          </Link>

          {/* Parent */}
          <Link to="/register">
            <div
              className={`group inline-flex rounded-full bg-gradient-to-r ${GRADIENT} p-[2px] shadow-lg active:scale-95 transition`}
            >
              <button
                className="flex items-center text-lg px-8 py-3 rounded-full font-bold
                           bg-white transition-all
                           group-hover:bg-transparent group-hover:text-white"
              >
                {/* FaRegHeart -> FA heart (regular) */}
                <i
                  className="fa-regular fa-heart mr-2 text-xl text-[#7E82E4] group-hover:text-white transition-colors"
                  aria-hidden="true"
                />

                <span
                  className={`bg-gradient-to-r ${GRADIENT} bg-clip-text text-transparent group-hover:text-white`}
                >
                  Đăng ký phụ huynh
                </span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
