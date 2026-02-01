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

  const { isLoginOpen, closeLogin, openLogin } = useAuthModalStore();

  useEffect(() => {
    if (location.state?.openLogin) {
      openLogin(location.state.redirectTo || "/");

      // clear state để refresh không mở lại lần nữa
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location.state, location.pathname, location.search, openLogin, navigate]);

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

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
}

export default RootLayout;
