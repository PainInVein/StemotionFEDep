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
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "about-us",
        element: <About/>
      },
       {
        path: "contact",
        element: <Contact/>
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
