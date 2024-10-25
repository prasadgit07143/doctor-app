import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const BarChart = ({ appointmentsData = null }) => {
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
  return (
    <div>
      <Bar
        data={{
          labels: ["All", "Confirmed", "Completed", "Cancelled", "Pending"],
          datasets: [
            {
              label: "Number of consultations",
              data: [
                appointmentsData.length,
                confirmed,
                completed,
                cancelled,
                pending,
              ],
              backgroundColor: [
                "white",
                "#00FF40",
                "#007FFF",
                "#F40009",
                "#FF4500",
              ],
              borderWidth: 5,
            },
          ],
        }}
        height={300}
        width={500}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};
export default BarChart;
