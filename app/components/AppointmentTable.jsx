"use client";

import React, { useEffect, useState } from "react";

const AppointmentTable = ({ patients, appointments }) => {
  const [selectedFilter, setSelectedFilter] = useState("Last 30 days");
  const [displayedData, setDisplayedData] = useState([]);

  // Function to get fresh filtered data directly from source arrays
  const getFilteredData = (filterType) => {
    const currentDate = new Date();

    // Get unique patients with valid appointments
    const validPatients = [...new Set(appointments.map((apt) => apt.patientId))]
      .map((patientId) => {
        const patient = patients.find((p) => p.patientId === patientId);
        const appointment = appointments.find((a) => a.patientId === patientId);

        if (!patient || !appointment) return null;

        const appointmentDate = new Date(appointment.appointmentDate);
        const daysDiff = Math.floor(
          (currentDate - appointmentDate) / (1000 * 60 * 60 * 24)
        );

        switch (filterType) {
          case "Last day":
            return daysDiff <= 1 ? patient : null;
          case "Last week":
            return daysDiff <= 7 ? patient : null;
          case "Last month":
          case "Last 30 days":
            return daysDiff <= 30 ? patient : null;
          default:
            return null;
        }
      })
      .filter(Boolean); // Remove null entries

    return validPatients;
  };

  useEffect(() => {
    const initialData = getFilteredData("Last 30 days");
    setDisplayedData(initialData);
  }, [patients, appointments]);

  const handleFilterChange = (e) => {
    const filterType = e.target.value;
    setSelectedFilter(filterType);
    const newData = getFilteredData(filterType);
    setDisplayedData(newData);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="mb-4">
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="border rounded-md p-2 bg-gray-800 text-white text-sm"
        >
          <option value="Last day">Last Day</option>
          <option value="Last week">Last Week</option>
          <option value="Last month">Last Month</option>
          <option value="Last 30 days">Last 30 Days</option>
        </select>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Patient Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Age
            </th>
            <th scope="col" className="px-6 py-3">
              Gender
            </th>
            <th scope="col" className="px-6 py-3">
              Contact
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((patient) => {
            const appointment = appointments.find(
              (apt) => apt.patientId === patient.patientId
            );
            return (
              <tr
                key={patient.patientId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{patient.name}</td>
                <td className="px-6 py-4">{patient.email}</td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">+91 {patient.contact}</td>
                <td className="px-6 py-4">{appointment?.status || "N/A"}</td>
                <td className="px-6 py-4">
                  {appointment?.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : "---"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
