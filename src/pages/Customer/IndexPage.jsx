import useAuth from "../../contexts/AuthContext";
import LandingPage from "../Customer/LandingPage/LandingPage";
import HomePage from "../Customer/HomePage/HomePage";

export default function IndexPage() {
  const { isAuthenticated, loading } = useAuth();

  // nếu auth đang load (check token), tránh nháy Landing/Home
  if (loading) return null; // hoặc spinner

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
