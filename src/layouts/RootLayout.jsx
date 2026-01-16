import { Outlet, useLocation } from "react-router-dom";
import HeaderComponent from "../components/Header/Header";
import FooterComponent from "../components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useState, useEffect } from "react";
import { ScrollspyContext, AuthProvider } from "../contexts/ScrollspyContext";
// import PageTransitionOverlay from '../components/PageTransition/PageTransitionOverlay';
// import Preloader from '../components/PageTransition/Preloader';

export const LoginVersionContext = createContext();

function RootLayout() {
    const [loginVersion, setLoginVersion] = useState(0);
    const [activeSection, setActiveSection] = useState("hero");
    const location = useLocation();


    React.useEffect(() => {
        if (!['/', '/home', '/landing'].includes(location.pathname)) {
            setActiveSection("");
        }
    }, [location.pathname]);

    // Hide header/footer for lesson pages
    const isLessonPage = location.pathname.includes("/lesson/");

    if (isLessonPage) {
        return (
        <main>
            <Outlet />
        </main>);
    }

    return (
        <AuthProvider>
            <LoginVersionContext.Provider value={{ loginVersion, setLoginVersion }}>
                <ScrollspyContext.Provider value={{ activeSection, setActiveSection }}>
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
                </ScrollspyContext.Provider>
            </LoginVersionContext.Provider>
        </AuthProvider >
    );
}

export default RootLayout;
