import Prescription from "@/app/components/Prescription";
import React from "react";

const PrescriptionPage = ({ params }) => {
  return (
    <>
      <Prescription appointmentId={params.appointmentId} />
    </>
  );
};

export default PrescriptionPage;
