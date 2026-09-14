import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import z from "zod";
import toast from "react-hot-toast";
import { login } from "../api";
import { login as loginAction } from "../features/authSlice";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname ?? "/";

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await login(data);
      dispatch(loginAction(response.data));
      toast.success(response.message);
      navigate(redirectPath, { replace: true });
      reset();
    } catch (error) {
      console.error(error.stack);
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full text-gray-500 max-w-87.5 mx-auto md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login Now
        </h2>
        <div className="space-y-1 mb-2 w-full">
          <input
            id="email"
            className="w-full border mt-1 bg-indigo-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="email"
            {...register("email")}
            autoFocus
            placeholder="Enter your email"
          />
          {
            <small className="text-red-400 text-sm">
              {errors.email?.message}
            </small>
          }
        </div>
        <div className="space-y-1 mb-2 w-full">
          <input
            id="password"
            {...register("password")}
            className="w-full border mt-1 bg-indigo-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="password"
            placeholder="Enter your password"
          />
          {
            <small className="text-red-400 text-sm">
              {errors.password?.message}
            </small>
          }
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mb-3 bg-green-500 hover:bg-green-600/90 active:scale-95 transition py-2.5 rounded text-white"
        >
          Log in
        </button>
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-green-500 hover:text-green-600/90"
          >
            Signup Now
          </Link>
        </p>
      </form>
    </div>
  );
}
