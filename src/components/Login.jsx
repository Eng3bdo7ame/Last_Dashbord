import React, { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import Link from "next/link";
import Swal from "sweetalert2";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import auth1 from "../../public/images/auth-login-illustration-light.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = useCallback((setter) => (event) => {
    setter(event.target.value);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    let hasError = false;
    setLoading(true);

    if (username.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username is required!",
      });
      hasError = true;
    }

    if (password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password is required!",
      });
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const { data: loginData } = await axios.post(
        "https://dashboard.cowdly.com/api/users/login/",
        { username, password }
      );

      const token = loginData?.token;
      if (token) {
        Cookies.set("token", token, {
          expires: 2,
          secure: true,
          sameSite: "strict",
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "An error occurred while logging in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100   items-center ">
      <div className="absolute top-4 left-4 text-3xl font-bold text-gray-700">
        Cowdly
      </div>

      <div className="hidden md:flex lg:w-2/3 xl:w-3/4 justify-center items-center">
        <Image
          priority
          src={auth1}
          alt="Login illustration"
          className="w-[45vw] h-[90vh] object-contain"
        />
      </div>

      <div className="w-full max-w-md mx-4 absolute top-0 right-0 flex flex-col justify-center md:mx-0 px-6 py-8 h-[100vh] min-h-screen  bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-700">
            Welcome to Cowdly! 👋
          </h2>
          <p className="my-2 text-lg text-gray-600">
            Please sign in to your account and start the adventure
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={handleInputChange(setUsername)}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeClosed className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent text-xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-lg text-gray-600">
            New on our platform?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create an account
            </Link>
          </p>

          <div className="relative flex justify-center my-4">
            <span className="px-2 bg-gray-100 text-gray-500">or</span>
          </div>

          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full flex justify-center items-center border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50">
              <FaFacebookF className="text-blue-600" />
            </button>
            <button className="w-12 h-12 rounded-full flex justify-center items-center border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50">
              <FaTwitter className="text-blue-600" />
            </button>
            <button className="w-12 h-12 rounded-full flex justify-center items-center border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50">
              <FcGoogle className="text-blue-600" />
            </button>
            <button className="w-12 h-12 rounded-full flex justify-center items-center border border-gray-300 shadow-sm text-gray-500 hover:bg-gray-50">
              <FaGithub className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
