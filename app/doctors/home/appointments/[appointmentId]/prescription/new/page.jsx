import PrescriptionForm from "@/app/components/PrescriptionForm";
import React from "react";

const NewPrescriptionPage = ({ params }) => {
  return (
    <>
      <PrescriptionForm appointmentId={params.appointmentId} />
    </>
  );
};

export default NewPrescriptionPage;
