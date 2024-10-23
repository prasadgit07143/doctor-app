"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import PrescriptionInfo from "./PrescriptionInfo";
import LabtestInfo from "./LabtestInfo";

const AppointmentHistory = React.memo(({ patient, appointment }) => {
  const appointmentDate = useMemo(() => {
    const date = new Date(
      appointment.appointmentDate.substring(
        0,
        appointment.appointmentDate.indexOf("T")
      )
    );
    return date
      .toUTCString()
      .substring(0, date.toUTCString().indexOf("00:00:00"));
  }, [appointment.appointmentDate]);

  return (
    <li key={patient._id}>
      <div
        className={clsx(
          "block max-w-full p-6 bg-white rounded-sm shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-l-[12px] border-blue-500",
          {
            "dark:border-orange-500": appointment.status === "Pending",
            "dark:border-green-500": appointment.status === "Confirmed",
            "dark:border-red-500": appointment.status === "Cancelled",
            "dark:border-blue-700": appointment.status === "Completed",
          }
        )}
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
          className="float-left mr-3"
          height="32"
          width="32"
          alt="1"
        />
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {patient.name}
        </h5>
        <div className="mt-5">
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span className="text-white">Email:</span> {patient.email}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span className="text-white">Contact:</span> {patient.contact}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span className="text-white">Date:</span> {appointmentDate}
          </p>
          <p
            className={clsx("font-normal text-gray-700 dark:text-gray-400", {
              "dark:text-orange-500": appointment.status === "Pending",
              "dark:text-green-500": appointment.status === "Confirmed",
              "dark:text-red-500": appointment.status === "Cancelled",
              "dark:text-white": appointment.status === "Completed",
            })}
          >
            <span className="text-white">Status:</span> {appointment.status}
          </p>
        </div>
      </div>
    </li>
  );
});

const PrescriptionHistory = React.memo(({ prescription, patientMapper }) => {
  return (
    <PrescriptionInfo
      historyComponent={patientMapper}
      currentPrescription={prescription}
    />
  );
});

const LabtestHistory = React.memo(({ labtests, patientMapper }) => {
  return (
    <LabtestInfo labtestList={labtests} historyComponent={patientMapper} />
  );
});

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [labtestsData, setLabtestsData] = useState([]);
  const [patientMapper, setPatientMapper] = useState({});

  const fetchData = useCallback(async () => {
    const doctorId = JSON.parse(localStorage.getItem("doctor")).doctorId;
    const [
      appointmentsResponse,
      patientsResponse,
      prescriptionsResponse,
      labtestsResponse,
    ] = await Promise.all([
      fetch(`/api/appointments/byDoctor/${doctorId}`, {
        cache: "no-store",
      }),
      fetch("/api/patients", { cache: "no-store" }),
      fetch(`/api/prescriptions/byDoctor/${doctorId}`, { cache: "no-store" }),
      fetch(`/api/labtests/byDoctor/${doctorId}`, { cache: "no-store" }),
    ]);

    const [appointments, patients, prescriptions, labtests] = await Promise.all(
      [
        appointmentsResponse.json(),
        patientsResponse.json(),
        prescriptionsResponse.json(),
        labtestsResponse.json(),
      ]
    );
    const patientMapper_ = {};
    patients.forEach((patient) => {
      patientMapper_[patient.patientId] = patient;
    });
    setAppointmentsData(appointments);
    setPatientsData(patients);
    setPrescriptionsData(prescriptions);
    setLabtestsData(labtests);
    setPatientMapper(patientMapper_);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const patientsWithAppointments = useMemo(() => {
    return appointmentsData
      .map((appointment) => ({
        patient: patientsData.find(
          (patient) => patient.patientId === appointment.patientId
        ),
        appointment,
      }))
      .sort(
        (a, b) =>
          new Date(b.appointment.appointmentDate) -
          new Date(a.appointment.appointmentDate)
      );
  }, [appointmentsData, patientsData]);

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <div className="appointments-wrapper">
        <h1 className="text-3xl mb-5 font-semibold">Medical History</h1>
        <div className="appointments mt-12">
          {patientsWithAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments found !</p>
          ) : (
            <>
              <div className="mb-12">
                <h1 className="text-xl mb-5 font-semibold">
                  Appointments History
                </h1>
                <ul className="grid grid-cols-2 gap-y-7 gap-x-12">
                  {patientsWithAppointments.map(({ patient, appointment }) => (
                    <AppointmentHistory
                      patient={patient}
                      appointment={appointment}
                      key={appointment.appointmentId}
                    />
                  ))}
                </ul>
              </div>
              <div className="mb-12">
                <h1 className="text-xl mb-5 font-semibold">
                  Prescriptions History
                </h1>
                {prescriptionsData.length === 0 && (
                  <p className="text-gray-500">No prescriptions found !</p>
                )}
                <div>
                  {prescriptionsData.map((prescription) => (
                    <PrescriptionHistory
                      prescription={prescription}
                      key={prescription.prescriptionId}
                      patientMapper={patientMapper}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-xl mb-5 font-semibold">Labtests History</h1>
                {labtestsData.length === 0 && (
                  <p className="text-gray-500">No labtests found !</p>
                )}
                <div>
                  {" "}
                  <LabtestHistory
                    labtests={labtestsData}
                    patientMapper={patientMapper}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Appointments;
