'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation"
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useAppDispatch } from "../_store/hooks";
import { setUserData } from "@/app/_features/user/userSlice"
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useRouter();
  const dispatch=useAppDispatch()
  const handleVisibility = () => {
    setVisibility(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setToastMsg('Please provide credentials.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        const UserData={
            firstName:data.data.firstName as string,
            lastName:data.data.lastName as string,
            email:data.data.email as string,
            username:data.data.username as string,
            Points:data.data.Points as number,
        }
        dispatch(setUserData(UserData))
        navigate.push("/");
      } else {
        setToastMsg('Invalid credentials.');
      }
    } catch (error) {
      console.error("Error during login", error);
      setToastMsg('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                @
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username" className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Username
                </label>
              </div>
            </div>
          </div>
          
          {/* Password Input */}
          <div className="mb-6">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <RiLockPasswordLine />
              </span>
              <div className="relative flex-1">
                <input
                  type={visibility ? 'text' : 'password'}
                  id="password"
                  className="block w-full rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={handleVisibility}
                >
                  {visibility ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Submit Button and Register Link */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
            <span className="text-sm">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-blue-500 hover:text-blue-600">
                Register
              </a>
            </span>
          </div>
        </form>

        {/* Toast Message */}
        {toastMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;