"use client";

import Cookies from "js-cookie";
import React from "react";
import { useRouter } from "next/navigation";

const handleSignOut = ({ router }) => {
  localStorage.setItem("doctor", null);
  Cookies.set("doctor", null, {
    expires: 0,
  });
  console.log("Clicked");
  console.log(router);
  window.location.href = "/doctors/login";
};

const SignOutButton = ({ children }) => {
  const router = useRouter();
  return (
    <button onClick={() => handleSignOut({ router: router })}>
      {children}
    </button>
  );
};

export default SignOutButton;