"use client";

import React, { useEffect, useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const Heatmap = ({ appointmentsData = [] }) => {
  const [result, setResult] = useState([]);

  const processAppointments = useMemo(() => {
    const dateCounter = {};

    appointmentsData?.forEach((appointment) => {
      if (!appointment?.appointmentDate) return;

      const date = appointment.appointmentDate.split("T")[0];
      dateCounter[date] = (dateCounter[date] || 0) + 1;
    });

    return Object.entries(dateCounter).map(([date, count]) => ({
      date,
      count: Math.min(count, 5),
    }));
  }, [appointmentsData]);

  useEffect(() => {
    setResult(processAppointments);
  }, [processAppointments]);

  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  return (
    <div className="heatmap-container">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        gutterSize={2}
        onMouseOver={(value) =>
          value && {
            "data-tip": `${value.date}: ${value.count} appointments`,
          }
        }
        values={result}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return `color-github-${value.count}`;
        }}
        titleForValue={(value) =>
          value
            ? `Date: ${value.date}\nConsultations: ${value.count}`
            : "No consultations"
        }
        data-tip
        data-for="heatmap-tooltip"
      />
    </div>
  );
};

export default React.memo(Heatmap);
