import React from "react";
import Link from "next/link";
import PatientInfo from "./PatientInfo";
import clsx from "clsx";

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

const LabtestInfo = ({ labtestList }) => {
  return (
    <div className="labtest-details-wrapper">
      <h1 className="text-3xl mb-5 font-semibold mt-10">Labtest Info </h1>
      <div className="labtest-details">
        <div className="grid grid-cols-2 gap-10 relative overflow-x-auto">
          {labtestList.map((currentLabtest) => (
            <a
              href="#"
              className={clsx(
                "block p-6 bg-white rounded-sm hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700 border-l-8 min-h-[280px]",
                {
                  "dark:border-orange-500": currentLabtest.status === "Pending",
                  "dark:border-green-500":
                    currentLabtest.status === "Completed",
                }
              )}
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {currentLabtest.name}{" "}
                <span className="text-base text-gray-500">
                  {"( "}
                  {currentLabtest.date.substring(
                    0,
                    currentLabtest.date.indexOf("T")
                  ) + " )"}
                </span>
              </h5>
              <div className="mt-8">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span className="text-white">Type:</span>{" "}
                  {currentLabtest.testType}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400 my-2">
                  <span className="text-white">Description:</span>{" "}
                  {currentLabtest.description}
                </p>
                {currentLabtest.status === "Completed" && (
                  <p className="font-normal text-gray-700 dark:text-gray-400 my-2">
                    <span className="text-white">Result:</span>{" "}
                    {currentLabtest.result}
                  </p>
                )}
                <p
                  className={clsx(
                    "mb-5 mt-3 font-normal text-gray-700 dark:text-gray-400",
                    {
                      "dark:text-orange-500":
                        currentLabtest.status === "Pending",
                      "dark:text-green-500":
                        currentLabtest.status === "Completed",
                    }
                  )}
                >
                  {currentLabtest.status}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Labtest;
