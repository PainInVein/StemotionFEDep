import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import LandingPage from "../pages/Customer/LandingPage/LandingPage";
import HomePage from "../pages/Customer/HomePage/HomePage";
import CoursesPage from "../pages/Customer/CoursesPage/CoursesPage";
import CourseDetail from "../pages/Customer/CourseDetailPage/CourseDetail";
import LessonDetail from "../pages/Customer/LessonDetailPage/LessonDetail";

import Login from "../pages/Customer/LoginPage/LoginPage";
import Register from "../pages/Customer/LoginPage/RegisterForm";

import About from "../pages/Customer/AboutUsPage/About";
import Contact from "../pages/Customer/ContactPage/Contact";

import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "home", element: <HomePage /> },

      // Courses routes (nested)
      {
        path: "courses",
        children: [
          { index: true, element: <CoursesPage /> },
          { path: ":slug", element: <CourseDetail /> },
          { path: ":slug/lesson/:lessonId", element: <LessonDetail /> },
        ],
      },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
   

      { path: "about-us", element: <About /> },
      { path: "contact", element: <Contact /> },

      // Not found inside layout (nếu muốn 404 vẫn bọc RootLayout)
      { path: "*", element: <NotFound /> },
    ],
  },

  // Not found global (nếu bạn muốn 404 KHÔNG bọc RootLayout thì dùng cái này thay vì cái ở trên)
  // { path: "*", element: <NotFound /> },
]);
