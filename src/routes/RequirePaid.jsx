import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import PaymentRequiredNotice from "../components/Auth/PaymentRequiredNotice";
import { getPaymentService } from "../services/subscription/subscription.service";

export default function RequirePaid({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [paid, setPaid] = useState(true); // mặc định true để tránh flash
  const notified = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (loading) return;
      if (!isAuthenticated) return; // RequireAuth lo phần login

      // chỉ chặn student
      const isStudent = user?.role === "student";
      if (!isStudent) {
        setPaid(true);
        setChecking(false);
        return;
      }

      const parentId = user?.parentId;
      if (!parentId) {
        setPaid(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);
        const hasPaid = await getPaymentService(parentId); // true/false
        setPaid(hasPaid);

        if (!hasPaid && !notified.current) {
          toast.warning("Phụ huynh cần nâng cấp Premium để truy cập nội dung này!");
          notified.current = true;
        }
      } catch (e) {
        setPaid(false);
        if (!notified.current) {
          toast.error(e?.message || "Không kiểm tra được trạng thái thanh toán");
          notified.current = true;
        }
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [loading, isAuthenticated, user?.role, user?.parentId, location.pathname]);

  // đang load auth hoặc đang check payment => chưa render gì
  if (loading || checking) return null;

  // nếu chưa login => RequireAuth sẽ show AuthRequiredNotice
  if (!isAuthenticated) return null;

  // student chưa mua => show notice
  if (user?.role === "student" && paid !== true) {
    return <PaymentRequiredNotice />;
  }

  return children;
}
