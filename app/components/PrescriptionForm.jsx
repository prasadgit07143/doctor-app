"use client";

import React, { useState, useEffect, useCallback } from "react";
import PatientInfo from "./PatientInfo";

const PrescriptionForm = ({ appointmentId }) => {
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      officialName: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorId = appointment.doctorId;
    const patientId = appointment.patientId;
    const prescriptionId =
      Number.parseInt(
        Math.floor(10 + Math.random() * 90) + "" + doctorId + "" + patientId
      ) % patientId;

    const prescriptionData = {
      prescriptionId,
      doctorId,
      patientId,
      medicines: medicines.map((medicine) => ({
        name: medicine.medicineName,
        fullName: medicine.officialName,
        dosage: parseInt(medicine.dosage),
        frequency: medicine.frequency,
        duration: medicine.duration,
      })),
    };

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        console.log("Prescription added successfully");
      } else {
        console.error("Failed to add prescription");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
    alert("Prescription added successfully !");
    window.location.href = `/doctors/home/appointments/${appointmentId}/prescription`;
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: "",
        officialName: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newMedicines = [...medicines];
    newMedicines[index][name] = value;
    setMedicines(newMedicines);
  };

  const fetchData = useCallback(async () => {
    const [appointmentResponse] = await Promise.all([
      fetch("/api/appointments/" + appointmentId, {
        cache: "no-store",
      }),
    ]);
    const [appointment] = await Promise.all([appointmentResponse.json()]);
    setAppointment(appointment);

    if (appointment && appointment.patientId) {
      const patientResponse = await fetch(
        `/api/patients/${appointment.patientId}`
      );
      const patientData = await patientResponse.json();
      setPatient(patientData);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <PatientInfo patientData={patient} />
      <div className="form-wrapper">
        <h1 className="text-3xl mb-5 font-semibold">Prescription Details</h1>
        <form onSubmit={handleSubmit}>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {[
                  "Medicine Name",
                  "Official Name",
                  "Dosage",
                  "Frequency",
                  "Duration",
                  "Action",
                ].map((header) => (
                  <th key={header} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="medicineName"
                      value={medicine.medicineName}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      className="max-w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="officialName"
                      value={medicine.officialName}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      className="max-w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="dosage"
                      value={medicine.dosage}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      className="max-w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="frequency"
                      value={medicine.frequency}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      className="max-w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="duration"
                      value={medicine.duration}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      className="max-w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {index === medicines.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center px-10 py-2 text-md font-medium text-center text-white bg-green-700 rounded-sm hover:bg-green-800 focus:outline-none dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 mt-5"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PrescriptionForm;
