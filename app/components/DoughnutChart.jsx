import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ appointmentsData = null }) => {
  const confirmed = appointmentsData?.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;
  const pending = appointmentsData?.filter(
    (appointment) => appointment.status === "Pending"
  ).length;
  const completed = appointmentsData?.filter(
    (appointment) => appointment.status === "Completed"
  ).length;
  const cancelled = appointmentsData?.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;
  let data = [
    {
      label: "Confirmed",
      value: confirmed,
      color: "#00FF40",
      cutout: "50%",
    },
    {
      label: "Cancelled",
      value: cancelled,
      color: "#F40009",
      cutout: "50%",
    },
    {
      label: "Completed",
      value: completed,
      color: "#007FFF",
      cutout: "50%",
    },
    {
      label: "Pending",
      value: pending,
      color: "#FF4500",
      cutout: "50%",
    },
  ];

  const options = {
    plugins: {
      responsive: true,
    },
    cutout: data.map((item) => item.cutout),
  };

  const finalData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => Math.round(item.value)),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(data.length).fill(true),
      },
    ],
  };

  return <Doughnut data={finalData} options={options} />;
};

export default DoughnutChart;
