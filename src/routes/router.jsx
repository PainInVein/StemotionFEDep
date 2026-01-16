import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import LandingPage from "../pages/Customer/LandingPage/LandingPage";
import Login from "../pages/Customer/LoginPage/LoginPage";
import NotFound from "../pages/NotFound";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";
import AdminPage from "../pages/Admin/AdminPage";
import CoursesPage from "../pages/Customer/CoursesPage/CoursesPage";
import About from "../pages/Customer/AboutUsPage/About";
import Contact from "../pages/Customer/ContactPage/Contact";
import Register from "../pages/Customer/LoginPage/RegisterForm";
import HomePage from "../pages/Customer/HomePage/HomePage";
import CourseDetail from "../pages/Customer/CourseDetailPage/CourseDetail";
import LessonDetail from "../pages/Customer/LessonDetailPage/LessonDetail";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "/courses/:slug",
        element: <CourseDetail />
      },

      {
        path: "/courses/:slug/lesson/:lessonId",
        element: <LessonDetail />
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register/student",
        element: <Register defaultRole="student" />,
      },
      {
        path: "register/parent",
        element: <Register defaultRole="parent" />,
      },
      {
        path: "about-us",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // {
  //   path: "/admin/login",
  //   element: <LoginAdmin />,
  // },
  // {
  //   path: "/admin",
  //   element: (
  //     <ProtectedAdminRoute>
  //       <AdminPage />
  //     </ProtectedAdminRoute>
  //   ),

  //   children: [
  //     {
  //       index: true,
  //       element: <Dashboard />,

  //     },
  //     {
  //       path: "PaymentsManagement",
  //       element: <PaymentsManagement />,

  //     },

  //     {
  //       path: "*",
  //       element: <NotFound />,
  //     },
  //   ],
  // },
  {
    path: "*",
    element: <NotFound />,
  },
]);
