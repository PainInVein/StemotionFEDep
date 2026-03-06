import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../contexts/AuthContext";
import { useAuthModalStore } from "../../../stores/authModalStore";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const { refreshMe } = useAuth();
  const closeLogin = useAuthModalStore((s) => s.closeLogin);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const currentUser = await refreshMe();
        closeLogin?.();

        toast.success("Đăng nhập Google thành công!", { toastId: "google-ok" });

        const preLoginUrl = sessionStorage.getItem("preLoginUrl") || "/";
        sessionStorage.removeItem("preLoginUrl");
        sessionStorage.removeItem("googleLoginRole");

        if (currentUser?.role === "parent") {
          navigate("/parent/dashboard", { replace: true });
          return;
        }

        navigate(preLoginUrl, { replace: true });
      } catch (e) {
        sessionStorage.removeItem("googleLoginRole");
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.", {
          toastId: "google-fail",
        });
        navigate("/", { replace: true });
      }
    })();
  }, [refreshMe, navigate, closeLogin]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00c9a7]" />
        <p className="mt-4 text-lg text-gray-700 font-medium">
          Đang xử lý đăng nhập Google...
        </p>
      </div>
    </div>
  );
}