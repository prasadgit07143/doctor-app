"use client";

import React from "react";
import { useState, useCallback } from "react";

const AppointmentButtons = ({ appointment, onStatusChange = null }) => {
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
      window.location.reload();
    },
    [appointment.appointmentId, onStatusChange]
  );
  return (
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
  );
};

export default AppointmentButtons;
