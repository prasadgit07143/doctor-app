"use client";

import { useEffect, useState } from "react";

export default function LocalStorageProvider({ children }) {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("doctor");
    if (data) {
      setDoctorData(JSON.parse(data));
    }
  }, []);

  return children({ doctorData });
}
