"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

const History = () => {
  const [appointments, setAppointments] = useState([]);
  const doctorId = JSON.parse(localStorage.getItem("doctor")).doctorId;
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments/byDoctor/${doctorId}`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);
  return (
    <>
      {" "}
      <section className="history-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
        <h1 className="text-3xl mb-5 font-semibold">Medical History</h1>
        <div className="appointments-history-wrapper">
          <h1 className="text-xl mb-5 font-semibold my-10 text-gray-800">
            Appointments History
          </h1>
          <div className="appointments-history">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-7">
              {appointments.map((appointment) => (
                <li key={appointment._id}>
                  <div
                    className={clsx(
                      "block max-w-full p-6 bg-white rounded-sm shadow hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700 border-l-8 border-blue-500",
                      {
                        "dark:border-orange-500":
                          appointment.status === "Pending",
                        "dark:border-green-500":
                          appointment.status === "Confirmed",
                        "dark:border-blue-500":
                          appointment.status === "Completed",
                        "dark:border-red-500":
                          appointment.status === "Cancelled",
                      }
                    )}
                  >
                    <h5
                      className={clsx(
                        "mb-2 text-2xl font-bold tracking-tight text-gray-900",
                        {
                          "dark:text-orange-500":
                            appointment.status === "Pending",
                          "dark:text-green-500":
                            appointment.status === "Confirmed",
                          "dark:text-white": appointment.status === "Completed",
                          "dark:text-red-500":
                            appointment.status === "Cancelled",
                        }
                      )}
                    >
                      {appointment.status}
                    </h5>
                    <div className="mt-5">
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        <span className="text-white">Date:</span>{" "}
                        {appointment.appointmentDate}
                      </p>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        <span className="text-white">Time:</span>{" "}
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default History;
