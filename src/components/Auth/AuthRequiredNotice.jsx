import { useLocation, useNavigate } from "react-router-dom";
import { useAuthModalStore } from "../../stores/authModalStore";
import Button from "../common/Button";

export default function AuthRequiredNotice({
    title = "Bạn cần đăng nhập để tiếp tục",
    description = "Trang này chỉ dành cho tài khoản đã đăng nhập. Vui lòng đăng nhập hoặc đăng ký tài khoản mới.",
}) {
    const openLogin = useAuthModalStore((s) => s.openLogin);
    const closeLogin = useAuthModalStore((s) => s.closeLogin);
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.pathname + location.search;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl rounded-3xl border border-gray-200 bg-white shadow-xl p-6">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <i className="fa-solid fa-circle-info text-red-500 animate-pulse" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>

                        <div className="mt-6 flex justify-center">
                            {/* container để nút dài và luôn nằm giữa */}
                            <div className="w-full max-w-md sm:max-w-lg">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Nút Đăng nhập */}
                                    <Button
                                        size="sm"
                                        className="w-full px-5 h-10 sm:flex-1 hover:bg-indigo-500  text-white"
                                        onClick={() => openLogin(redirect)}
                                    >
                                        Đăng nhập
                                    </Button>

                                    {/* Nút Đăng ký */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full px-10 h-10 sm:flex-1 bg-gradient-to-r from-[#FF9FB2] via-[#B2A5FF] to-[#FFD09B] hover:from-[#FF8AA5] hover:via-[#A890FF] hover:to-[#FFC680] text-white"
                                        onClick={() => {
                                            closeLogin();
                                            navigate("/register", { state: { from: location } });
                                        }}
                                    >
                                        Đăng ký tài khoản ngay
                                    </Button>
                                </div>

                                {/* dòng "Chưa có tài khoản?" nằm giữa phía trên nút nếu bạn muốn */}
                                <p className="text-center text-sm text-gray-500 mt-3">
                                    Chưa có tài khoản? <span className="font-medium hover:text-indigo-600 cursor-pointer">Đăng ký ngay</span>
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
