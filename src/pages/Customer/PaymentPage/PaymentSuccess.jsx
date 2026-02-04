import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";

export default function Success() {
  return (
    <div
      className="max-h-auto md:max-h-screen h-full w-full flex items-center justify-center p-4 md:p-8"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, #FFF 62.11%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.80) 100%),
          linear-gradient(79deg, #7491FF 14.55%, #FF90E0 42.56%, #F7C325 73.53%)`,
      }}
    >
      {/* Success Card */}
      <div className="relative w-full max-w-150 bg-white rounded-[60px] sm:rounded-[90px] border-[3px] sm:border-4 border-black shadow-[0_0_15px_0_rgba(0,0,0,0.25)] px-12 py-6 flex flex-col items-center gap-6 sm:gap-8 lg:gap-[37px]">
        {/* Success Icon */}
        <div className="w-full max-w-50 md:max-w-75 aspect-square shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/cc002fc861e397a8068ee76ac04fb29b6986e71a?width=738"
            alt="Payment Success"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Success Text */}
        <div className="flex flex-col items-center justify-center text-center text-black font-poppins font-medium">
          <div className="text-[28px] sm:text-[36px] lg:text-[40px] leading-tight">
            Thanh toán
          </div>
          <div className="text-lg md:text-4xl font-bold text-green-500">
            Thành công!
          </div>
        </div>

        <div className="relative w-full">
          <Link to="/">
            <Button size="md">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
