import Labtest from "@/app/components/Labtest";
import React from "react";

const LabTestPage = ({ params }) => {
  return (
    <>
      <Labtest appointmentId={params.appointmentId} />
    </>
  );
};

export default LabTestPage;
