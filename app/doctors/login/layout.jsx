import React from "react";
import "@/styles/globals.css";

const LoginLayout = ({ children }) => {
  return (
    <html lang="en-US" className="dark">
      <body>{children}</body>
    </html>
  );
};

export default LoginLayout;
