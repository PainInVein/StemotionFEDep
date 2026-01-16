// src/layouts/LessonLayout.jsx
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


export default function LessonLayout({ children }) {
  const location = useLocation();

  // Hide header/footer for lesson pages
  const isLessonPage = location.pathname.includes("/lesson/");

  if (isLessonPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
