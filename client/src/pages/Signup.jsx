import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { login as loginAction } from "../features/authSlice";
import { login, signUp } from "../api";
import { useDispatch } from "react-redux";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
});

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectPath = location.state?.from?.pathname ?? "/";

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await signUp(data);
      dispatch(loginAction(response.data));
      toast.success(response.message);
      navigate(redirectPath, { replace: true });
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-gray-500 w-full max-w-85 mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>
        <div className="space-y-1 mb-2">
          <input
            className="w-full border mt-1 bg-indigo-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="text"
            {...register("name")}
            autoFocus
            placeholder="Full Name"
          />
          {
            <small className="text-red-400 text-sm">
              {errors.name?.message}
            </small>
          }
        </div>
        <div className="space-y-1 mb-2">
          <input
            className="w-full border mt-1 bg-indigo-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="email"
            {...register("email")}
            placeholder="Email"
          />
          {
            <small className="text-red-400 text-sm">
              {errors.email?.message}
            </small>
          }
        </div>
        <div className="space-y-1 mb-7">
          <input
            className="w-full border mt-1 bg-indigo-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3"
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {
            <small className="text-red-400 text-sm">
              {errors.password?.message}
            </small>
          }
        </div>

        <button
          disabled={isSubmitting}
          className="w-full mb-3 bg-green-500 hover:bg-green-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium disabled:cursor-no-drop disabled:bg-green-400"
        >
          Create Account
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`text-green-500 ${isSubmitting ? "pointer-events-none" : ""}`}
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
