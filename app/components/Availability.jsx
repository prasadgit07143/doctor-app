"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:3000/api/availability/1002";

const allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const allSlots = Array.from(
  { length: 15 },
  (_, i) => `${(i + 7) % 12 || 12}:00 ${i + 7 < 12 ? "AM" : "PM"}`
);

const Availability = () => {
  const [availabilityData, setAvailabilityData] = useState({
    availableDays: [],
    availableSlots: [],
    startTime: "",
    endTime: "",
  });

  const fetchAvailabilityData = useCallback(async () => {
    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch availability data");
      const data = await response.json();
      setAvailabilityData(data);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  }, []);

  useEffect(() => {
    fetchAvailabilityData();
  }, [fetchAvailabilityData]);

  const updateAvailability = useCallback(
    async (updatedData) => {
      try {
        const response = await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error("Failed to update availability");
        await fetchAvailabilityData();
      } catch (error) {
        console.error("Error updating availability:", error);
      }
    },
    [fetchAvailabilityData]
  );

  const handleChange = useCallback((key, value) => {
    setAvailabilityData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSetData = useCallback(
    (key) => {
      updateAvailability({ [key]: availabilityData[key] });
      alert("Updated successfully !");
    },
    [availabilityData, updateAvailability]
  );

  const handleToggle = useCallback((key, item) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }));
  }, []);

  if (!availabilityData.availableDays) return <div>Loading...</div>;

  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <h1 className="text-3xl mb-5 font-semibold">Availability Info</h1>
      <SelectionSection
        title="Select Day"
        items={allDays}
        selected={availabilityData.availableDays}
        onToggle={(day) => handleToggle("availableDays", day)}
        onSet={() => handleSetData("availableDays")}
      />
      <TimeSection
        startTime={availabilityData.startTime}
        endTime={availabilityData.endTime}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        onSet={() => handleSetData("startTime")}
      />
      <SelectionSection
        title="Select Slots"
        items={allSlots}
        selected={availabilityData.availableSlots}
        onToggle={(slot) => handleToggle("availableSlots", slot)}
        onSet={() => handleSetData("availableSlots")}
        gridCols={4}
      />
      <UnavailableSection />
    </section>
  );
};

const SelectionSection = ({
  title,
  items,
  selected,
  onToggle,
  onSet,
  gridCols,
}) => (
  <div className="selection-wrapper mt-10">
    <p className="text-xl font-semibold">{title}</p>
    <div
      className={`relative ${
        gridCols ? `grid grid-cols-${gridCols}` : "flex flex-row flex-wrap"
      } items-center gap-5 my-3 border-2 border-gray-300 rounded-md p-5 bg-gray-700 text-white`}
    >
      {items.map((item) => (
        <div
          key={item}
          className="border-2 border-gray-500 py-2 px-3 rounded-sm cursor-pointer bg-blue-500 bg-opacity-10"
        >
          <input
            type="checkbox"
            id={item}
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
            className="outline-none rounded-sm cursor-pointer"
          />
          <label htmlFor={item} className="ml-2 select-none cursor-pointer">
            {item}
          </label>
        </div>
      ))}
      <button
        onClick={onSet}
        className={
          gridCols
            ? "inline-flex items-center px-7 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 w-20"
            : "absolute right-3 top-[50%] translate-y-[-50%] inline-flex items-center px-7 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
        }
      >
        Set
      </button>
    </div>
  </div>
);

const TimeSection = ({ startTime, endTime, onChange, onSet }) => (
  <div className="time-bounds-selection-wrapper mt-10">
    <p className="text-xl font-semibold">Select Time</p>
    <div className="relative flex flex-row items-center gap-10 my-3 border-2 border-gray-300 rounded-md p-5 bg-gray-700 text-white">
      <TimeInput
        label="Start Time:"
        name="startTime"
        value={startTime}
        onChange={onChange}
      />
      <TimeInput
        label="End Time:"
        name="endTime"
        value={endTime}
        onChange={onChange}
      />
      <button
        onClick={onSet}
        className="absolute right-3 top-[50%] translate-y-[-50%] inline-flex items-center px-7 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Set
      </button>
    </div>
  </div>
);

const UnavailableSection = () => {
  const [dateFields, setDateFields] = useState([{ id: 0, value: "" }]);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const addDateField = () => {
    setDateFields([...dateFields, { id: dateFields.length, value: "" }]);
  };

  const handleDateChange = (id, value) => {
    const updatedFields = dateFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setDateFields(updatedFields);
  };

  const handleSetUnavailableDates = async () => {
    const newDates = dateFields.map((field) => field.value).filter(Boolean);
    try {
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error("Failed to fetch current unavailable dates");
      const currentData = await response.json();
      const updatedDates = [
        ...new Set([...currentData.unavailableDates, ...newDates]),
      ];
      const updateResponse = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unavailableDates: updatedDates }),
      });
      if (!updateResponse.ok)
        throw new Error("Failed to update unavailable dates");
      setUnavailableDates(updatedDates);
      alert("Unavailable dates updated successfully!");
      setDateFields([{ id: 0, value: "" }]);
    } catch (error) {
      console.error("Error updating unavailable dates:", error);
      alert("Failed to update unavailable dates. Please try again.");
    }
  };

  return (
    <div className="time-bounds-selection-wrapper mt-10">
      <p className="text-xl font-semibold">Select Dates of Unavailability</p>
      <div className="relative my-3 border-2 border-gray-300 rounded-md p-5 bg-gray-700 text-white">
        {dateFields.map((field) => (
          <div key={field.id} className="mb-2">
            <input
              type="date"
              name={`date-${field.id}`}
              id={`date-${field.id}`}
              value={field.value}
              onChange={(e) => handleDateChange(field.id, e.target.value)}
              className="text-black rounded-sm py-1 text-sm mr-2"
            />
          </div>
        ))}
        <button
          onClick={addDateField}
          className="inline-flex items-center px-7 py-1 text-sm font-medium text-center text-white bg-green-700 rounded-sm hover:bg-green-800 focus:outline-none dark:bg-green-600 dark:hover:bg-green-700"
        >
          Add
        </button>
        <button
          onClick={handleSetUnavailableDates}
          className="absolute right-3 top-[50%] translate-y-[-50%] inline-flex items-center px-7 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Set
        </button>
      </div>
    </div>
  );
};

const TimeInput = ({ label, name, value, onChange }) => (
  <div className="border-r-2 pr-10">
    <label htmlFor={name} className="mr-3">
      {label}
    </label>
    <input
      name={name}
      id={name}
      type="time"
      className="text-black rounded-sm py-1 text-sm"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default Availability;
