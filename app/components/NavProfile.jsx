"use client";

import React, { useState } from "react";
import { useEffect } from "react";

const NavProfile = () => {
  const [doctor, setDoctor] = useState(null);
  useEffect(() => {
    const doctor_ = JSON.parse(localStorage.getItem("doctor"));
    setDoctor(doctor_);
  }, []);
  return (
    <div className="doctor-profile mr-2 text-white">
      {doctor && (
        <p className="text-sm">
          <i>Welcome</i>, {doctor.name}
        </p>
      )}
    </div>
  );
};

export default NavProfile;
