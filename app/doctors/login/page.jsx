"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/components/Login";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (data) => {
    try {
      const res = await fetch(`/api/auth/login/${data.email}`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (res.ok) {
        if (result.password !== data.password) {
          setMessage("Incorrect Password !");
          return;
        }
        Cookies.set("doctor", JSON.stringify(result), {
          expires: 60 * 60 * 3600,
        });
        localStorage.setItem("doctor", JSON.stringify(result));
        setMessage("Redirecting...");
        router.push("/doctors/home");
      } else {
        setMessage("Email doesn't exists !");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <Login mode="Login" onSubmit={handleLogin} />
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
