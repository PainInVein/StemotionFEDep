import { useLocation, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import useAuth from "../../contexts/AuthContext";
import { useAuthModalStore } from "../../stores/authModalStore";

export default function PaymentRequiredNotice({
  title = "Cần nâng cấp Premium để tiếp tục",
  description = "Tài khoản học sinh chỉ được truy cập nội dung này khi phụ huynh đã nâng cấp Premium.",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);

  const handleUpgradeClick = async () => {
    // 1) Logout tài khoản student hiện tại
    await logout();

    // 2) Mở modal login với role parent (giống HeroSection)
    openLogin(null, "parent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl rounded-3xl border border-gray-200 bg-white shadow-xl p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-crown text-yellow-500 animate-pulse" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{description}</p>

            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-md sm:max-w-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* ✅ Nút nâng cấp: logout student → mở login parent */}
                  <Button
                    size="sm"
                    className="w-full px-5 h-10 sm:flex-1 hover:bg-indigo-500 text-white"
                    onClick={handleUpgradeClick}
                  >
                    <i className="fa-solid fa-crown mr-2 text-yellow-300" />
                    Đăng nhập phụ huynh để nâng cấp
                  </Button>

                  {/* Quay về */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full px-10 h-10 sm:flex-1 bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] hover:from-[#FF8AA5] hover:via-[#A890FF] hover:to-[#FFC680] text-white"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Về trang chủ
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Phụ huynh đăng nhập và nâng cấp gói Premium để mở khóa toàn bộ nội dung cho con.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Bạn đang cố truy cập:{" "}
              <span className="font-mono">{location.pathname}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}