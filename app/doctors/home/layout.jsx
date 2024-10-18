import React from "react";
import NavBar from "../../components/NavBar";
import "@/styles/globals.css";
import Footer from "../../components/Footer";

const HomeLayout = ({ children }) => {
  return (
    <html lang="en-US" className="dark">
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default HomeLayout;
