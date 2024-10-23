"use client";

import React, { useState, useEffect, useCallback } from "react";
import PatientInfo from "./PatientInfo";

const LabtestForm = ({ appointmentId }) => {
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [labtests, setLabtests] = useState([
    {
      name: "Blood",
      testType: "RBC",
      description: "",
    },
  ]);

  const handleAddLabtest = () => {
    setLabtests([
      ...labtests,
      {
        name: "Blood",
        testType: "RBC",
        description: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const labtestData = labtests.map((labtest) => {
      return {
        labtestId:
          Number.parseInt(
            Math.floor(10 + Math.random() * 90) +
              "" +
              appointment.doctorId +
              "" +
              appointment.patientId
          ) % appointment.patientId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        name: labtest.name,
        testType: labtest.testType,
        description: `The ${labtest.name} test is a ${labtest.testType} test.`,
      };
    });

    try {
      const responses = await Promise.all(
        labtestData.map((data) =>
          fetch("/api/labtests", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
        )
      );
      console.log(labtestData);
      const results = await Promise.all(responses.map((res) => res.json()));
      alert("Lab tests successfully ordered!");
      window.location.href = `/doctors/home/appointments/${appointmentId}/labtest`;
    } catch (error) {
      console.error("Error submitting lab tests:", error);
      alert("There was an error ordering the lab tests.");
    }
  };

  const fetchData = useCallback(async () => {
    const [appointmentResponse] = await Promise.all([
      fetch("http://localhost:3000/api/appointments/" + appointmentId, {
        cache: "no-store",
      }),
    ]);
    const [appointment] = await Promise.all([appointmentResponse.json()]);
    setAppointment(appointment);

    if (appointment && appointment.patientId) {
      const patientResponse = await fetch(
        `http://localhost:3000/api/patients/${appointment.patientId}`
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
        <h1 className="text-3xl mb-5 font-semibold">Lab Test Details</h1>
        <form onSubmit={handleSubmit}>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {["Test Type", "Subtype", "Action"].map((header) => (
                  <th key={header} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labtests.map((labtest, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <select
                      name="testType"
                      id="testType"
                      className="py-3 px-4 rounded-sm cursor-pointer outline-none bg-gray-700 text-gray-100"
                      value={labtest.testType}
                      onChange={(e) => {
                        const newLabtests = [...labtests];
                        newLabtests[index].testType = e.target.value;
                        setLabtests(newLabtests);
                      }}
                    >
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      name="subtype"
                      id="subtype"
                      className="py-3 px-4 rounded-sm cursor-pointer outline-none bg-gray-700 text-gray-100"
                      value={labtest.name}
                      onChange={(e) => {
                        const newLabtests = [...labtests];
                        newLabtests[index].name = e.target.value;
                        setLabtests(newLabtests);
                      }}
                    >
                      <option value="WBC">WBC</option>
                      <option value="RBC">RBC</option>
                      <option value="Platelets">Platelets</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {index === labtests.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddLabtest}
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
              Order Test
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LabtestForm;
