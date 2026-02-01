import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useAuth from "../contexts/AuthContext";
import { useAuthModalStore } from "../stores/authModalStore";
import AuthRequiredNotice from "../components/Auth/AuthRequiredNotice";
import { useLocation } from "react-router-dom";

export default function RequireAuth({ children, }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    const openLogin = useAuthModalStore((s) => s.openLogin);
    const notified = useRef(false);

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) {
            const redirect = location.pathname + location.search;
            openLogin(redirect);
            if (!notified.current) {
                toast.info("Bạn cần đăng nhập mới được vào trang này");
                notified.current = true;
            }
        } else {
            notified.current = false;
        }
    }, [loading, isAuthenticated, openLogin, openLogin, location.pathname, location.search]);

    if (loading) return null;
    if (!isAuthenticated) return <AuthRequiredNotice />;

    return children;
}
