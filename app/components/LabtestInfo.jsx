import React from "react";
import clsx from "clsx";

const LabtestInfo = ({ labtestList, historyComponent = false }) => {
  return (
    <div className="labtest-details-wrapper">
      <h1
        className={
          historyComponent
            ? "text-base mb-5 font-semibold mt-5 text-gray-500"
            : "text-3xl mb-5 font-semibold mt-10"
        }
      >
        Labtest Info{" "}
      </h1>
      <div className="labtest-details">
        <div className="grid grid-cols-2 gap-10 relative overflow-x-auto">
          {labtestList.map((currentLabtest) => (
            <div>
              {historyComponent && (
                <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-3">
                  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {historyComponent[currentLabtest.patientId].name}
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Email: {historyComponent[currentLabtest.patientId].email}
                  </p>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Contact:{" "}
                    {historyComponent[currentLabtest.patientId].contact}
                  </p>
                </div>
              )}
              <div
                className={clsx(
                  "block p-6 bg-white rounded-sm hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700 border-l-8 min-h-[280px]",
                  {
                    "dark:border-orange-500":
                      currentLabtest.status === "Pending",
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabtestInfo;
