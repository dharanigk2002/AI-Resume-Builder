import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Preview from "./pages/Preview.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./api/index.js";
import { login, logout, setLoading } from "./features/authSlice.js";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserData() {
      try {
        dispatch(setLoading(true));
        const { data } = await getUser();
        dispatch(login(data));
      } catch (error) {
        console.error(error.message);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    }
    void getUserData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="/view/:resumeId" element={<Preview />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
    </Routes>
  );
}
