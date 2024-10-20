import React from "react";
import AppointmentButtons from "@/app/components/AppointmentButtons";
import Link from "next/link";

const Appointment = ({ patient, appointment }) => {
  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="patient-details-wrapper mb-16">
        <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Patient Details
        </h5>
        <hr />
        <div className="patient-details">
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">
              Patient Name:{" "}
            </span>
            {patient.name}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Age: </span>
            {patient.age}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Gender: </span>
            {patient.gender}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Email: </span>
            {patient.email}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">
              Contact Number:{" "}
            </span>
            +91
            {" " + patient.contact}
          </p>
        </div>
      </div>
      <div className="appointment-details-wrapper mb-10">
        <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Appointment Details
        </h5>
        <hr />
        <div className="appointment-details mt-5">
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">
              Appointment Date:{" "}
            </span>
            {appointment.appointmentDate.substring(
              0,
              appointment.appointmentDate.indexOf("T")
            )}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">
              Appointment Time:{" "}
            </span>
            {appointment.appointmentTime}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Fees: </span>Rs.
            {appointment.fees ? appointment.fees : "500"}/-
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Issue: </span>
            {appointment.issue ? appointment.issue : "NA"}
          </p>
          <p className="mt-5 mb-3 font-normal text-gray-700 dark:text-gray-400">
            <span className="dark: text-white font-semibold">Status: </span>
            <i>{appointment.status}</i>
          </p>
        </div>
      </div>
      {appointment.status === "Pending" && (
        <AppointmentButtons appointment={appointment} />
      )}
      {(appointment.status === "Confirmed" ||
        appointment.status === "Completed") && (
        <>
          <div className="prescription-details-wrapper">
            <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Prescription Details
            </h5>
            <hr className="mb-5" />
            {appointment.status === "Confirmed" && (
              <Link
                href={`/doctors/home/appointments/${appointment.appointmentId}/prescription/new`}
                target="_blank"
                className="inline-flex mr-6 items-center px-5 py-2 text-md font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
              >
                Generate Prescription
              </Link>
            )}
            <Link
              href={`/doctors/home/appointments/${appointment.appointmentId}/prescription`}
              target="_blank"
              className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              View Prescription
            </Link>
          </div>
          <div className="lab-test-details-wrapper mt-10">
            <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lab Test Details
            </h5>
            <hr className="mb-5" />
            {appointment.status === "Confirmed" && (
              <Link
                href={`/doctors/home/appointments/${appointment.appointmentId}/prescription/new`}
                target="_blank"
                className="inline-flex mr-6 items-center px-5 py-2 text-md font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
              >
                Order Lab Test
              </Link>
            )}
            <Link
              href={`/doctors/home/appointments/${appointment.appointmentId}/prescription`}
              target="_blank"
              className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              View Ordered Tests
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Appointment;
