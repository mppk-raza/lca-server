import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ title, data, loading }) => {
  const theme = useTheme();

  // Define the data for the chart
  const doughnutData = {
    labels: data?.map((item) => item._id[0]),
    datasets: [
      {
        data: data?.map((item) => item.averageScore),
        backgroundColor: ["#b6e9d1", "#00a0ad", "#41424C"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
  };

  const options = {
    animation: true,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    plugins: {
      legend: {
        position: "bottom",
        display: false,
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
            <Doughnut data={doughnutData} options={options} />
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

export default DoughnutChart;
