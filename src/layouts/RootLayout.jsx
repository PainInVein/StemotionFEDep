import { createContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import FooterComponent from "../components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";

export const LoginVersionContext = createContext();

function RootLayout() {
    const location = useLocation();

    // Hide header/footer for lesson pages
    const isLessonPage = location.pathname.includes("/lesson/");

    if (isLessonPage) {
        return (
            <main>
                <Outlet />
            </main>
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <HeaderComponent />
                <main>
                    <Outlet />
                </main>
                <div className="relative w-full">
                    <FooterComponent />
                </div>
            </div>
        </>

    );
}

export default RootLayout;
