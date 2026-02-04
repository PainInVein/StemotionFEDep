import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import useAuth from "../contexts/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Hoặc hiển thị loading spinner

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
