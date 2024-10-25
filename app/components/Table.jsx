import React, { useState, useMemo, useCallback } from "react";

const Table = ({ patients, appointments }) => {
  const [selectedFilter, setSelectedFilter] = useState("Last 30 days");
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleFilterChange = useCallback(
    (event) => {
      const filter = event.target.value;
      setSelectedFilter(filter);

      const now = new Date();
      now.setHours(23, 59, 59, 999);

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const filterDates = {
        "Last day": () => startDate.setDate(now.getDate() - 1),
        "Last week": () => startDate.setDate(now.getDate() - 7),
        "Last month": () => startDate.setMonth(now.getMonth() - 1),
        "Last 30 days": () => startDate.setDate(now.getDate() - 30),
      };

      (filterDates[filter] || filterDates["Last 30 days"])();

      const filtered = patients
        .map((patient) => {
          const patientAppointments = appointments
            .filter((appt) => appt.patientId === patient.patientId)
            .sort(
              (a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate)
            );

          return {
            ...patient,
            latestAppointment: patientAppointments[0],
          };
        })
        .filter((patient) => {
          if (!patient.latestAppointment) return false;
          const appointmentDate = new Date(
            patient.latestAppointment.appointmentDate
          );
          return appointmentDate >= startDate && appointmentDate <= now;
        });

      setFilteredPatients(filtered);
    },
    [patients, appointments]
  );

  const appointmentsByStatus = useMemo(() => {
    const currentDate = new Date();
    return {
      confirmed: appointments.filter(
        (appointment) =>
          new Date(appointment.appointmentDate) >= currentDate &&
          appointment.status === "Confirmed"
      ),
      canceled: appointments.filter(
        (appointment) => appointment.status === "Cancelled"
      ),
      completed: appointments.filter(
        (appointment) => appointment.status === "Completed"
      ),
    };
  }, [appointments]);

  const renderAppointmentRow = useCallback(
    (appointment) => {
      const patient = patients.find(
        (p) => p.patientId === appointment.patientId
      );
      return (
        <tr
          key={appointment.appointmentId}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td className="px-6 py-4">{patient?.name || "Unknown"}</td>
          <td className="px-6 py-4">{patient?.contact || "Unknown"}</td>
          <td className="px-6 py-4">
            {new Date(appointment.appointmentDate).toLocaleDateString()}
          </td>
          <td className="px-6 py-4">{appointment.appointmentTime}</td>
          <td className="px-6 py-4">{appointment.status}</td>
        </tr>
      );
    },
    [patients]
  );

  const TableSection = useCallback(
    ({ title, appointments }) => (
      <>
        <h3 className="mt-12 font-semibold text-xl">{title}</h3>
        {appointments.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-3">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>{appointments.map(renderAppointmentRow)}</tbody>
          </table>
        ) : (
          <p className="py-4 text-gray-500">No {title.toLowerCase()} found.</p>
        )}
      </>
    ),
    [renderAppointmentRow]
  );

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <TableSection
        title="Upcoming Appointments"
        appointments={appointmentsByStatus.confirmed}
      />
      <TableSection
        title="Cancelled Appointments"
        appointments={appointmentsByStatus.canceled}
      />
      <TableSection
        title="Completed Appointments"
        appointments={appointmentsByStatus.completed}
      />
    </div>
  );
};

export default React.memo(Table);
