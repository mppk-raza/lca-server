// Import required modules
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Skeleton from "@mui/material/Skeleton";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";

// Register the necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = ({ title, loading, data }) => {
  const theme = useTheme();

  // Define the data for the chart
  const stackChartData = {
    labels: data?.map((item) => item._id[0]),
    datasets: [
      {
        label: "Enrolled Course",
        data: data?.map((item) => item.enrollmentCount),
        backgroundColor: "#b6e9d1",
      },
      {
        label: "Completed Course",
        data: data?.map((item) => item.completedCount),
        backgroundColor: "#00a0ad",
      },
    ],
  };

  const options = {
    animation: true,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    plugins: {
      legend: {
        position: "top",
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          autoSkip: false,
        },
      },
      y: {
        stacked: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card sx={{ textAlign: "center" }}>
      <CardHeader title={title} />
      <Divider />
      {!loading ? (
        <CardContent>
          <Box
            sx={{
              height: 300,
              position: "relative",
            }}
          >
            <Bar data={stackChartData} options={options} />
          </Box>
        </CardContent>
      ) : (
        <Skeleton
          sx={{ margin: "20px auto" }}
          variant="circular"
          width={260}
          height={260}
        />
      )}
    </Card>
  );
};

export default StackedBarChart;
