"use client";

import Cookies from "js-cookie";
import React from "react";
import { useState, useEffect } from "react";
import SignOutButton from "./SignOutButton";

const Profile = () => {
  const [doctor, setDoctor] = useState({});
  const [noOfAppointments, setNoOfAppointments] = useState(0);
  useEffect(() => {
    const doctor =
      JSON.parse(localStorage.getItem("doctor")) ||
      JSON.parse(Cookies.get("doctor"));
    setDoctor(doctor);
  }, []);
  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <div className="profile-wrapper">
        <h1 className="text-3xl mb-5 font-semibold">Profile</h1>
        <div className="profile-card">
          <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Your Profile
            </h5>
            {doctor && (
              <div className="doctor-details-wrapper mt-12">
                <div>
                  <div className="sub-heading">
                    <p className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-300">
                      Personal Details
                    </p>
                    <hr className="my-7" />
                  </div>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Name:</span> {doctor.name}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Gender:</span> {doctor.gender}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Email Address:</span>{" "}
                    {doctor.email}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Contact Number:</span>{" "}
                    {doctor.contact}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Age:</span> {doctor.age}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Address:</span>{" "}
                    {doctor.address}
                  </p>
                </div>
                <div>
                  <div className="sub-heading">
                    <p className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-300 mt-12">
                      Professional Details
                    </p>
                    <hr className="my-7" />
                  </div>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Years of experience:</span>{" "}
                    {doctor.experience}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Qualification:</span>{" "}
                    {doctor.qualification}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Specialization:</span>{" "}
                    {doctor.specialization}
                  </p>
                  <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Contact Number:</span>{" "}
                    {doctor.contact}
                  </p>
                  {/* <p className="my-1 font-normal text-gray-700 dark:text-gray-400">
                    <span className="text-white">Number of Appointments:</span>{" "}
                    {noOfAppointments}
                  </p> */}
                </div>
              </div>
            )}
            <SignOutButton className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm w-full sm:w-auto px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5">
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
