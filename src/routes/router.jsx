import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

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
      // "/" → Landing
      { index: true, element: <LandingPage /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "about-us", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:slug", element: <CourseDetail /> },
      { path: "courses/:slug/lesson/:lessonId", element: <LessonDetail /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
