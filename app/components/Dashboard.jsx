"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Table from "./Table";
import DoughnutChart from "./DoughnutChart";
import Appointments from "./Appointments";
import BarChart from "./BarChart";
import Heatmap from "./Heatmap";
import AppointmentTable from "./AppointmentTable";

const Dashboard = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsWithAppointments, setPatientsWithAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);

  const fetchData = useCallback(async (doctorId) => {
    try {
      const [appointmentsResponse, patientsResponse] = await Promise.all([
        fetch(`/api/appointments/byDoctor/${doctorId}`, {
          cache: "no-store",
        }),
        fetch("/api/patients", {
          cache: "no-store",
        }),
      ]);

      if (!appointmentsResponse.ok || !patientsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const appointments = await appointmentsResponse.json();
      const patients = await patientsResponse.json();

      setAppointmentsData(appointments);

      const matchedPatients = appointments.reduce((acc, appointment) => {
        const matchedPatient = patients.find(
          (patient) => patient.patientId === appointment.patientId
        );
        if (matchedPatient) acc.push(matchedPatient);
        return acc;
      }, []);

      setPatientsWithAppointments(matchedPatients);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (!storedDoctor) return;

    const doctor_ = JSON.parse(storedDoctor);
    setDoctor(doctor_);
    fetchData(doctor_.doctorId);
  }, [fetchData]);

  const infoCards = useMemo(
    () => (
      <div className="info-cards-wrapper grid grid-cols-3 gap-4 my-6">
        <div
          style={{
            background: "linear-gradient(45deg, #1CB5E0 0%, #000851 100%)",
          }}
          className="info-card p-10 rounded-md text-white"
        >
          <p className="text-4xl font-bold text-gray-200">Experience</p>
          <p>
            <span className="text-8xl font-extrabold">
              <i>{doctor?.experience + 1}</i>
            </span>
            <i>Years</i>
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(90deg, #9ebd13 0%, #008552 100%)",
          }}
          className="info-card p-10 rounded-md text-white"
        >
          <p className="text-4xl font-bold text-gray-200">Consultations</p>
          <p>
            <span className="text-8xl font-extrabold">
              <i>{appointmentsData.length}+</i>
            </span>
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)",
          }}
          className="info-card p-10 rounded-md text-white"
        >
          <p className="text-4xl font-bold text-gray-200">Patients</p>
          <p>
            <span className="text-8xl font-extrabold">
              <i>{patientsWithAppointments.length}+</i>
            </span>
          </p>
        </div>
      </div>
    ),
    [
      doctor?.experience,
      appointmentsData.length,
      patientsWithAppointments.length,
    ]
  );

  const charts = useMemo(
    () => (
      <div className="grid grid-cols-3 gap-3">
        <div className="appointment-status-card bg-gray-800 p-7 rounded-md col-span-1">
          <p className="text-white text-xl font-bold mb-5">
            Appointments Status
          </p>
          {appointmentsData && (
            <DoughnutChart appointmentsData={appointmentsData} />
          )}
        </div>
        <div className="col-span-2 bg-gray-800 p-7 rounded-md">
          {appointmentsData && <BarChart appointmentsData={appointmentsData} />}
        </div>
        <div className="col-span-2"></div>
      </div>
    ),
    [appointmentsData]
  );

  return (
    <section className="appointments-section ml-[300px] mt-[120px] min-h-[100vh] mr-10">
      <h1 className="text-4xl mb-5 font-semibold">Dashboard</h1>
      <hr />
      <hr />
      {doctor && (
        <>
          {infoCards}
          {charts}
        </>
      )}
      {appointmentsData && (
        <div className=" bg-gray-800 p-10 rounded-md">
          <p className="text-white text-xl font-bold mb-10">
            Consultations Heatmap{" "}
            <span className="text-gray-500 text-sm">
              {new Date().getFullYear()}
            </span>
          </p>
          <Heatmap appointmentsData={appointmentsData} />
        </div>
      )}
      <div className="my-10"></div>
      {patientsWithAppointments && appointmentsData && (
        <AppointmentTable
          patients={patientsWithAppointments}
          appointments={appointmentsData}
        />
      )}
      <Table
        patients={patientsWithAppointments}
        appointments={appointmentsData}
      />
      <div className="mt-24">
        <Appointments dashboard={true} />
      </div>
    </section>
  );
};

export default React.memo(Dashboard);
