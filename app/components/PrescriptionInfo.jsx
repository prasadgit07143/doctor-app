const PrescriptionInfo = ({
  currentPrescription,
  historyComponent = false,
}) => (
  <div className="prescription-details-wrapper">
    <h1
      className={
        !historyComponent
          ? "mb-5 font-semibold mt-10 text-3xl"
          : "mb-5 font-semibold mt-5 text-gray-500 text-base"
      }
    >
      Prescription Info{" "}
      <span className="text-base text-gray-500">
        {"( "}
        {currentPrescription.date.substring(
          0,
          currentPrescription.date.indexOf("T")
        ) + " )"}
      </span>
    </h1>
    {historyComponent && (
      <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-3 w-[50%]">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {historyComponent[currentPrescription.patientId].name}
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Email: {historyComponent[currentPrescription.patientId].email}
        </p>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Contact: {historyComponent[currentPrescription.patientId].contact}
        </p>
      </div>
    )}
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

export default PrescriptionInfo;
