import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { compareAsc, format } from "date-fns";
import axios from "axios";

const MonthWiseCourseStats = () => {
  const [trainingStats, setTrainingStats] = useState();
  const theme = useTheme();
  let labels = trainingStats?.map((cur) =>
    format(new Date(cur._id.year, cur._id.month - 1), "MMM, yy")
  );
  const getTrainingCountsByMonth = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/adminDashboard/getCourseCompletionCountsByMonth",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setTrainingStats(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTrainingCountsByMonth();
  }, []);
  console.log(trainingStats);
  const data = {
    datasets: [
      {
        backgroundColor: "#41424C",
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: trainingStats?.map((cur) => cur.total_count_month),
        label: "This year",
        maxBarThickness: 10,
      },
      // {
      //   backgroundColor: '#41424C',
      //   barPercentage: 0.5,
      //   barThickness: 12,
      //   borderRadius: 4,
      //   categoryPercentage: 0.5,
      //   data: [11, 20, 12, 29, 30, 25, 13],
      //   label: 'Last year',
      //   maxBarThickness: 10
      // }
    ],
    labels: labels,
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
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
    <Card>
      <CardHeader
        // action={(
        //   <Button
        //     endIcon={<ArrowDropDownIcon fontSize="small" />}
        //     size="small"
        //   >
        //     Last 7 days
        //   </Button>
        // )}
        title="Courses Completed against Time (Monthly Count)"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        {/* <Button
            color="primary"
            endIcon={<ArrowRightIcon fontSize="small" />}
            size="small"
          >
            Overview
          </Button> */}
      </Box>
    </Card>
  );
};

export default MonthWiseCourseStats;
