"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";

const SearchDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (searchTerm.trim() === "") return doctors;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(lowerSearchTerm) ||
        doctor.specialization.toLowerCase().includes(lowerSearchTerm)
    );
  }, [doctors, searchTerm]);

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-grow p-4 w-full">
          <h1 className="text-3xl mb-5 font-semibold">Search Doctors</h1>
          <form className="max-w-md min-w-[100%]" onSubmit={handleSearch}>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Doctors..."
              />
            </div>
          </form>

          <div className="doctors-wrapper">
            <div className="doctor-wrapper">
              {filteredDoctors.length > 0 && (
                <p className="text-xl my-7 font-semibold">List of Doctors</p>
              )}
              <ul className="mt-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <li key={doctor._id} className="my-5">
                      <a
                        href="#"
                        className="block max-w-full p-6 bg-white rounded-sm shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-700 dark:hover:bg-gray-700 border-l-8 border-blue-500"
                      >
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                          className="float-left mr-3"
                          height="32"
                          width="32"
                          alt="1"
                        />
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {doctor.name}
                        </h5>
                        <div className="mt-5">
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="text-white">Email:</span>{" "}
                            {doctor.email}
                          </p>
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="text-white">Specialization:</span>{" "}
                            {doctor.specialization}
                          </p>
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="text-white">Contact:</span>{" "}
                            {doctor.contact}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))
                ) : (
                  <p>No doctors found.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchDoctors;
