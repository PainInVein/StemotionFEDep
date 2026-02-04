import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    sendRegisterOtpService,
    verifyRegisterOtpService,
} from "../../../services/auth/auth.service";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const pending = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem("pending_register") || "null");
        } catch {
            return null;
        }
    }, []);

    const email = pending?.email;

    const resend = async () => {
        if (!pending) {
            toast.error("Không tìm thấy dữ liệu đăng ký. Vui lòng đăng ký lại.");
            navigate("/register");
            return;
        }
        try {
            await sendRegisterOtpService(pending);
            toast.success("Đã gửi lại OTP!");
            console.log("Resent OTP to:", pending);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Gửi lại OTP thất bại.");
            console.error("Resend OTP error:", err);
        }
    };

    const submit = async () => {
        if (!pending) {
            toast.error("Không tìm thấy dữ liệu đăng ký. Vui lòng đăng ký lại.");
            navigate("/register");
            return;
        }
        if (!otp.trim()) {
            toast.error("Vui lòng nhập OTP.");
            return;
        }

        setLoading(true);
        try {
            /**
             * ⚠️ Quan trọng: payload verify phụ thuộc BE:
             * - Có BE chỉ cần { email, otp }
             * - Có BE cần { otp, ...pending } để tạo user thật
             *
             * Bạn chọn 1 trong 2 dòng dưới đây cho đúng BE.
             */

            // Cách A (phổ biến): verify theo email + otp
            const res = await verifyRegisterOtpService({ email, otpCode: otp.trim() });

            // Cách B: verify kèm toàn bộ info đăng ký (nếu BE yêu cầu)
            // const res = await verifyRegisterOtpService({ ...pending, otp: otp.trim() });

            toast.success("Xác thực OTP thành công! Vui lòng đăng nhập.");
            sessionStorage.removeItem("pending_register");
            // về Home rồi mở login modal
            navigate("/", {
                replace: true,
                state: { openLogin: true, redirectTo: "/" },
            });

        } catch (err) {
            toast.error(err || "Xác thực OTP thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-bold">Nhập mã OTP</h2>
                <p className="text-sm text-gray-600">
                    Mã OTP đã được gửi tới: <b>{email || "(không rõ email)"}</b>
                </p>

                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Nhập OTP (6 số)"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring"
                    inputMode="numeric"
                />

                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-black text-white hover:bg-gray-600 disabled:opacity-50"
                >
                    {loading ? "Đang xác thực..." : "Xác thực"}
                </button>

                <button
                    type="button"
                    onClick={resend}
                    className="w-full py-3 rounded-lg border hover:bg-gray-200 text-black"
                >
                    Gửi lại OTP
                </button>
            </div>
        </div>
    );
}
