import React from "react";
import Link from "next/link";
import PatientInfo from "./PatientInfo";
import PrescriptionInfo from "./PrescriptionInfo";

async function fetchData(url) {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
}

const Prescription = async ({ appointmentId }) => {
  const [prescriptionsData, appointmentData] = await Promise.all([
    fetchData("/api/prescriptions"),
    fetchData(`/api/appointments/${appointmentId}`),
  ]);

  const patientData = await fetchData(
    `/api/patients/${appointmentData.patientId}`
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
            displayHeading={false}
          />
        ))
      )}
    </section>
  );
};

export default Prescription;
