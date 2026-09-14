import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../api";
import { logout } from "../features/authSlice.js";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function logoutUser() {
    try {
      const response = await logoutAction();
      toast.success(response.message);
      dispatch(logout());
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
  return (
    <div className="bg-white shadow">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/">
          <img src="/assets/logo.svg" alt="logo" className="h-11" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white border hover:bg-slate-50 px-7 py-1.5 border-gray-300 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
