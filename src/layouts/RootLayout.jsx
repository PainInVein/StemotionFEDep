import { createContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import FooterComponent from "../components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";
import LoginModal from "../pages/Customer/LoginPage/LoginForm";
import { useAuthModalStore } from "../stores/authModalStore";

export const LoginVersionContext = createContext();

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLessonPage = location.pathname.includes("/lesson/");

  const { isLoginOpen, closeLogin, openLogin, role } = useAuthModalStore();

  useEffect(() => {
    if (location.state?.openLogin) {
      // openLogin(location.state.redirectTo || "/");
      openLogin(
        location.state.redirectTo || "/",
        location.state.role || "student"
      );

      // clear state để refresh không mở lại lần nữa
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location.state, location.pathname, location.search, openLogin, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google") === "1") {
      closeLogin(); // đóng modal nếu đang mở
      // optional: xoá query google=1 khỏi url
      params.delete("google");
      const next = params.toString();
      navigate(location.pathname + (next ? `?${next}` : ""), { replace: true });
    }
  }, [location.search, location.pathname, closeLogin, navigate]);

  if (isLessonPage) {
    return (
      <main>
        <Outlet />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <main>
        <Outlet />
      </main>
      <div className="relative w-full">
        <FooterComponent />
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} role={role} />
    </div>
  );
}

export default RootLayout;
