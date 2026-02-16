//src/routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

import Courses from "../pages/Customer/CoursesPage/Courses";
import CourseDetail from "../pages/Customer/CourseDetailPage/CourseDetail";
import LessonDetail from "../pages/Customer/LessonDetailPage/LessonDetail";

import Register from "../pages/Customer/LoginPage/RegisterForm";
import VerifyOtp from "../pages/Customer/LoginPage/VerifyOTP";
import About from "../pages/Customer/AboutUsPage/About";
import Contact from "../pages/Customer/ContactPage/Contact";
import NotFound from "../pages/NotFound";
import RequireAuth from "./RequireAuth";
import RequirePaid from "./RequirePaid";
import IndexPage from "../pages/Customer/IndexPage";
import SubscriptionTrialPage from "../pages/Customer/SubscriptionPage/SubscriptionTrialPage";
import ParentDashboard from "../pages/Parent/ParentDashboard";
import CheckOut from "../pages/Customer/PaymentPage/CheckOut";
import SubscriptionPage from "../pages/Customer/SubscriptionPage/SubscriptionPage";
import PaymentSuccess from "../pages/Customer/PaymentPage/PaymentSuccess";
import PaymentCancel from "../pages/Customer/PaymentPage/PaymentCancel";
import GoogleCallback from "../pages/Customer/LoginPage/GoogleCallback";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "/parent/dashboard", element: <ParentDashboard /> },
      { path: "/register", element: <Register /> },
      { path: "/register/verify-otp", element: <VerifyOtp /> },
      { path: "/about-us", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/subscription-trial", element: <SubscriptionTrialPage /> },
      { path: "/subscription", element: <SubscriptionPage /> },
      { path: "/payment", element: <CheckOut /> },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/cancel", element: <PaymentCancel /> },
      { path: "/google-callback", element: <GoogleCallback /> },
      // ✅ Public: lesson trial (không cần login)
      {
        path: "/trial/courses/:subjectSlug/chapter/:chapterSlug/lesson/:lessonSlug",
        element: <LessonDetail />,
      },

      // ✅ Public: chỉ xem subject
      { path: "/courses", element: <Courses /> },
      {
        path: "/courses/:subjectSlug",
        element: (
          <RequireAuth>
            <RequirePaid>
              <Courses />
            </RequirePaid>
          </RequireAuth>
        ),
      },
      {
        path: "/courses/:subjectSlug/chapter/:chapterSlug",
        element: (
          <RequireAuth>
            <RequirePaid>
              <CourseDetail />
            </RequirePaid>
          </RequireAuth>
        ),
      },
      {
        path: "/courses/:subjectSlug/chapter/:chapterSlug/lesson/:lessonSlug",
        element: (
          <RequireAuth>
            <RequirePaid>
              <LessonDetail />
            </RequirePaid>
          </RequireAuth>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
