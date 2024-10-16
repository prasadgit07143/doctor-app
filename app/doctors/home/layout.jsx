import React from "react";
import NavBar from "../../components/NavBar";
import "@/styles/globals.css";
import Footer from "../../components/Footer";

const RootLayout = ({ children }) => {
  return (
    <html lang="en-US">
      <body>
        <NavBar />
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
