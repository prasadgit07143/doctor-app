"use client";

import React, { useEffect, useState } from "react";
import Table from "./Table";

const Dashboard = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsWithAppointments, setPatientsWithAppointments] = useState([]);

  useEffect(() => {
    const doctorId = JSON.parse(localStorage.getItem("doctor")).doctorId;
    const fetchData = async () => {
      try {
        const [appointmentsResponse, patientsResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/appointments/byDoctor/${doctorId}`, {
            cache: "no-store",
          }),
          fetch("http://localhost:3000/api/patients", {
            cache: "no-store",
          }),
        ]);

        const appointments = await appointmentsResponse.json();
        const patients = await patientsResponse.json();

        setAppointmentsData(appointments);

        const matchedPatients = appointments.map((appointment) =>
          patients.find(
            (patient) => patient.patientId === appointment.patientId
          )
        );

        setPatientsWithAppointments(matchedPatients);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <h1 className="text-3xl mb-5 font-semibold">Dashboard</h1>
      <Table
        patients={patientsWithAppointments}
        appointments={appointmentsData}
      />
    </section>
  );
};

export default Dashboard;
