import React from "react";
import Link from "next/link";
import PatientInfo from "./PatientInfo";
import LabtestInfo from "./LabtestInfo";

async function fetchData(url) {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
}

const Labtest = async ({ appointmentId }) => {
  const [labtestsData, appointmentData] = await Promise.all([
    fetchData("http://localhost:3000/api/labtests"),
    fetchData(`http://localhost:3000/api/appointments/${appointmentId}`),
  ]);

  const patientData = await fetchData(
    `http://localhost:3000/api/patients/${appointmentData.patientId}`
  );

  const labtestList = [];
  if (labtestsData.length > 0) {
    for (const labtest of labtestsData) {
      if (
        labtest.patientId === appointmentData.patientId &&
        labtest.doctorId === appointmentData.doctorId
      ) {
        labtestList.push(labtest);
      }
    }
  }
  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <PatientInfo patientData={patientData} />
      {labtestList.length === 0 ? (
        <>
          <p className="text-gray-500 mb-5">No labtests found !</p>
          {appointmentData.status === "Confirmed" && (
            <Link
              href={`/doctors/home/appointments/${appointmentId}/labtest/new`}
              target="_blank"
              className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
            >
              Order Labtest
            </Link>
          )}
        </>
      ) : (
        <LabtestInfo labtestList={labtestList} />
      )}
    </section>
  );
};

export default Labtest;
