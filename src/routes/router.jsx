// import { createBrowserRouter } from "react-router-dom";

// import RootLayout from "../layouts/RootLayout";

// import CourseDetail from "../pages/Customer/CourseDetailPage/CourseDetail";
// import CoursesPage from "../pages/Customer/CoursesPage/CoursesPage";
// import LessonDetail from "../pages/Customer/LessonDetailPage/LessonDetail";

// import Register from "../pages/Customer/LoginPage/RegisterForm";

// import About from "../pages/Customer/AboutUsPage/About";
// import Contact from "../pages/Customer/ContactPage/Contact";
// import NotFound from "../pages/NotFound";
// import RequireAuth from "./RequireAuth";
// import IndexPage from "../pages/Customer/IndexPage";
// import Courses from "../pages/Customer/CoursesPage/Courses";
// import VerifyOtp from "../pages/Customer/LoginPage/VerifyOTP";
// import SubscriptionTrialPage from "../pages/Customer/SubscriptionTrialPage/SubscriptionTrialPage";
// import CheckOut from "../pages/Customer/PaymentPage/CheckOut";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       // "/" sẽ là Landing nếu chưa login, Home nếu đã login
//       { index: true, element: <IndexPage /> },
//       { path: "register", element: <Register /> },
//       { path: "register/verify-otp", element: <VerifyOtp /> },
//       { path: "about-us", element: <About /> },
//       { path: "contact", element: <Contact /> },
//       { path: "subscription-trial", element: <SubscriptionTrialPage /> },
//       // { path: "courses", element: <CoursesPage /> },
//       { path: "courses", element: <Courses /> },

//       // Các trang cần login
//       {
//         path: "courses/:slug",
//         element: (
//           <RequireAuth>
//             <CourseDetail />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "courses/:slug/lesson/:lessonId",
//         element: (
//           <RequireAuth>
//             <LessonDetail />
//           </RequireAuth>
//         ),
//         // element: <LessonDetail />,
//       },
//       { path: "checkout", element: <CheckOut /> },

//     ],
//   },

//   { path: "*", element: <NotFound /> },
// ]);
// router.jsx
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
import IndexPage from "../pages/Customer/IndexPage";
import SubscriptionTrialPage from "../pages/Customer/SubscriptionTrialPage/SubscriptionTrialPage";
import CheckOut from "../pages/Customer/PaymentPage/CheckOut";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "register", element: <Register /> },
      { path: "register/verify-otp", element: <VerifyOtp /> },
      { path: "about-us", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "subscription-trial", element: <SubscriptionTrialPage /> },
      { path: "checkout", element: <CheckOut /> },

      // ✅ Public: chỉ xem subject
      { path: "courses", element: <Courses /> },

      // ✅ Protected: xem chapters của subject
      {
        path: "courses/:subjectSlug",
        element: (
          <RequireAuth>
            <Courses />
          </RequireAuth>
        ),
      },

      // ✅ Protected: chapter detail (list lesson)
      {
        path: "courses/:subjectSlug/chapter/:chapterSlug",
        element: (
          <RequireAuth>
            <CourseDetail />
          </RequireAuth>
        ),
      },

      // ✅ Protected: lesson detail
      {
        path: "courses/:subjectSlug/chapter/:chapterSlug/lesson/:lessonSlug",
        element: (
          <RequireAuth>
            <LessonDetail />
          </RequireAuth>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
