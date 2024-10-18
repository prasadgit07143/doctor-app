import React from "react";
import Appointment from "@/app/components/Appointment";

const AppointmentViewPage = async ({ params }) => {
  const appointmentResponse = await fetch(
    `http://localhost:3000/api/appointments/${params.appointmentId}`,
    {
      cache: "no-store",
    }
  );
  const appointmentData = await appointmentResponse.json();
  const patientResponse = await fetch(
    `http://localhost:3000/api/patients/${appointmentData.patientId}`,
    {
      cache: "no-store",
    }
  );
  const patientData = await patientResponse.json();
  return (
    <section className="appointments-section ml-[300px] mt-[100px] min-h-[100vh] mr-10">
      <h1 className="text-3xl font-bold mb-4">Appointment Details</h1>
      <div className="appointment-view-wrapper">
        <div className="appointment-details">
          <Appointment patient={patientData} appointment={appointmentData} />
        </div>
      </div>
    </section>
  );
};

export default AppointmentViewPage;
