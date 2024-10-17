"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const AppointmentCard = React.memo(
  ({ patient, appointment, onStatusChange }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateAppointmentStatus = useCallback(
      async (newStatus) => {
        setIsUpdating(true);
        try {
          const response = await fetch(
            `http://localhost:3000/api/appointments/${appointment.appointmentId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newStatus }),
            }
          );

          if (response.ok) {
            onStatusChange(appointment.appointmentId, newStatus);
          } else {
            console.error("Failed to update appointment status");
          }
        } catch (error) {
          console.error("Error updating appointment status:", error);
        }
        setIsUpdating(false);
      },
      [appointment.appointmentId, onStatusChange]
    );

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
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition">
        <Link href="#">
          <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            <Image
              src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
              className="float-left mr-3"
              height="32"
              width="32"
              alt="1"
            />
            {patient.name} <br />
            <span className="text-sm ml-11 text-gray-700 dark:text-gray-400">
              {patient.email}
            </span>
          </h5>
        </Link>
        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
          {patient.gender} | {patient.age}
        </p>
        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
          +91 {patient.contact}
        </p>
        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
          {appointmentDate} | {appointment.appointmentTime}
        </p>
        <p
          className={clsx(
            "mb-5 mt-3 font-normal text-gray-700 dark:text-gray-400",
            {
              "dark:text-orange-500": appointment.status === "Pending",
              "dark:text-red-500": appointment.status === "Cancelled",
              "dark:text-green-500": appointment.status === "Confirmed",
              "dark:text-white": appointment.status === "Completed",
            }
          )}
        >
          {appointment.status}
        </p>
        {appointment.status === "Pending" && (
          <>
            <button
              onClick={() => updateAppointmentStatus("Confirmed")}
              disabled={isUpdating}
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-sm hover:bg-green-800 focus:outline-none dark:bg-green-600 dark:hover:bg-green-700 mr-3 disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => updateAppointmentStatus("Cancelled")}
              disabled={isUpdating}
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  }
);

const Appointments = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");

  const updateAppointmentStatusInBackend = useCallback(
    async (appointmentId, newStatus) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/appointments/${appointmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          console.error("Failed to update appointment status in backend");
        }
      } catch (error) {
        console.error("Error updating appointment status in backend:", error);
      }
    },
    []
  );

  const checkAndUpdateAppointmentStatus = useCallback(
    async (appointment) => {
      const today = new Date();
      const appointmentDate = new Date(appointment.appointmentDate);

      if (appointment.status === "Confirmed" && today > appointmentDate) {
        await updateAppointmentStatusInBackend(
          appointment.appointmentId,
          "Completed"
        );
        return { ...appointment, status: "Completed" };
      } else if (appointment.status === "Pending" && today > appointmentDate) {
        await updateAppointmentStatusInBackend(
          appointment.appointmentId,
          "Cancelled"
        );
        return { ...appointment, status: "Cancelled" };
      }
      return appointment;
    },
    [updateAppointmentStatusInBackend]
  );

  const fetchData = useCallback(async () => {
    const [appointmentsResponse, patientsResponse] = await Promise.all([
      fetch("http://localhost:3000/api/appointments", { cache: "no-store" }),
      fetch("http://localhost:3000/api/patients", { cache: "no-store" }),
    ]);

    const [appointments, patients] = await Promise.all([
      appointmentsResponse.json(),
      patientsResponse.json(),
    ]);

    const updatedAppointments = await Promise.all(
      appointments.map(checkAndUpdateAppointmentStatus)
    );
    setAppointmentsData(updatedAppointments);
    setPatientsData(patients);
  }, [checkAndUpdateAppointmentStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = useCallback(
    async (e) => {
      if (e && e.target) setStatusFilter(e.target.value);
      await fetchData();
    },
    [fetchData]
  );

  const filteredAppointments = useMemo(() => {
    const uniqueAppointments = new Map();
    appointmentsData
      .filter((appointment) => appointment.status === statusFilter)
      .forEach((appointment) =>
        uniqueAppointments.set(appointment.appointmentId, appointment)
      );
    return Array.from(uniqueAppointments.values());
  }, [appointmentsData, statusFilter]);

  const patientsWithAppointments = useMemo(() => {
    return filteredAppointments
      .map((appointment) => ({
        patient: patientsData.find(
          (patient) => patient.patientId === appointment.patientId
        ),
        appointment,
      }))
      .sort(
        (a, b) =>
          new Date(a.appointment.appointmentDate) -
          new Date(b.appointment.appointmentDate)
      );
  }, [filteredAppointments, patientsData]);

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <div className="appointments-wrapper">
        <h1 className="text-3xl mb-5 font-semibold">Appointments</h1>
        <select
          name="status"
          id="appointment-status"
          className="mb-5 py-3 px-4 rounded-sm cursor-pointer outline-none bg-gray-700 text-gray-100"
          onChange={handleStatusChange}
          value={statusFilter}
        >
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
          <option value="Confirmed">Confirmed</option>
        </select>
        <div className="appointments grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {patientsWithAppointments.length === 0 && (
            <p className="text-gray-500">
              No {statusFilter.toLowerCase()} appointments found !
            </p>
          )}
          {patientsWithAppointments.map(({ patient, appointment }) => (
            <AppointmentCard
              patient={patient}
              appointment={appointment}
              key={appointment.appointmentId}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Appointments;
