import LabtestForm from "@/app/components/LabtestForm";
import React from "react";

const NewLabTestPage = ({ params }) => {
  return <LabtestForm appointmentId={params.appointmentId} />;
};

export default NewLabTestPage;
