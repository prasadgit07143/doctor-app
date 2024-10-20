import React from "react";

const PatientInfo = ({ patientData }) => (
  <div className="patient-details-wrapper mb-12">
    <h1 className="text-3xl mb-5 font-semibold">Patient Info</h1>
    {patientData && (
      <div className="patient-details">
        <div className="relative overflow-x-auto shadow-md">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-l-8 border-blue-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {["Patient Name", "Age", "Gender", "Contact"].map((header) => (
                  <th key={header} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {patientData.name}
                </th>
                <td className="px-6 py-4">{patientData.age}</td>
                <td className="px-6 py-4">{patientData.gender}</td>
                <td className="px-6 py-4">{patientData.contact}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

export default PatientInfo;
