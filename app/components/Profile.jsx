"use client";

import React from "react";
import { useState, useEffect } from "react";
import SignOutButton from "./SignOutButton";

const Profile = () => {
  const [doctor, setDoctor] = useState({});
  useEffect(() => {
    const doctor = JSON.parse(localStorage.getItem("doctor"));
    setDoctor(doctor);
  }, []);
  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <div className="profile-wrapper">
        <h1 className="text-3xl mb-5 font-semibold">Profile</h1>
        <div className="profile-card">
          <div
            style={{
              backgroundImage:
                "linear-gradient(320.54deg, #00069F 0%, #120010 72.37%), linear-gradient(58.72deg, #69D200 0%, #970091 100%), linear-gradient(121.28deg, #8CFF18 0%, #6C0075 100%), linear-gradient(121.28deg, #8000FF 0%, #000000 100%), linear-gradient(180deg, #00FF19 0%, #24FF00 0.01%, #2400FF 100%), linear-gradient(52.23deg, #0500FF 0%, #FF0000 100%), linear-gradient(121.28deg, #32003A 0%, #FF4040 100%), radial-gradient(50% 72.12% at 50% 50%, #EB00FF 0%, #110055 100%)",
              backgroundBlendMode:
                "screen, color-dodge, color-burn, screen, overlay, difference, color-dodge, normal",
            }}
            className="block w-full p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
          >
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
