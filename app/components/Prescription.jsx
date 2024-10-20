import React from "react";
import Link from "next/link";
import PatientInfo from "./PatientInfo";

async function fetchData(url) {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
}

const Prescription = async ({ appointmentId }) => {
  const [prescriptionsData, appointmentData] = await Promise.all([
    fetchData("http://localhost:3000/api/prescriptions"),
    fetchData(`http://localhost:3000/api/appointments/${appointmentId}`),
  ]);

  const patientData = await fetchData(
    `http://localhost:3000/api/patients/${appointmentData.patientId}`
  );

  const prescriptionList = [];
  if (prescriptionsData.length > 0) {
    for (const prescription of prescriptionsData) {
      if (
        prescription.patientId === appointmentData.patientId &&
        prescription.doctorId === appointmentData.doctorId
      ) {
        prescriptionList.push(prescription);
      }
    }
  }

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <PatientInfo patientData={patientData} />
      {prescriptionList.length === 0 ? (
        <>
          <p className="text-gray-500 mb-5">No prescriptions found !</p>
          {appointmentData.status === "Confirmed" && (
            <Link
              href={`/doctors/home/appointments/${appointmentId}/prescription/new`}
              target="_blank"
              className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50"
            >
              Generate Prescription
            </Link>
          )}
        </>
      ) : (
        prescriptionList.map((prescription) => (
          <PrescriptionInfo
            key={prescription.prescriptionId}
            currentPrescription={prescription}
          />
        ))
      )}
    </section>
  );
};

const PrescriptionInfo = ({ currentPrescription }) => (
  <div className="prescription-details-wrapper">
    <h1 className="text-3xl mb-5 font-semibold mt-10">
      Prescription Info{" "}
      <span className="text-base text-gray-500">
        {"( "}
        {currentPrescription.date.substring(
          0,
          currentPrescription.date.indexOf("T")
        ) + " )"}
      </span>
    </h1>
    <div className="prescription-details">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {[
                "Medicine Name",
                "Official Name",
                "Dosage",
                "Frequency",
                "Duration",
              ].map((header) => (
                <th key={header} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPrescription ? (
              currentPrescription.medicines.map((medicine, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {medicine.name}
                  </th>
                  <td className="px-6 py-4">{medicine.fullName}</td>
                  <td className="px-6 py-4">{medicine.dosage}</td>
                  <td className="px-6 py-4">{medicine.frequency}</td>
                  <td className="px-6 py-4">{medicine.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No Prescription Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Prescription;
