import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import DashboardStats from "../../../components/Admin/Dashboard/DashboardStats/DashboardStats";
import MonthWiseTrainingsStats from "../../../components/Admin/Dashboard/MonthWiseTrainingsStats/MonthWiseTrainingsStats";
import PieChartDonut from "../../../components/common/PieChartDonut/PieChartDonut";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import axios from "axios";
import DoughnutChart from "../../../components/common/DoughnutChart";
import StackedBarChart from "../../../components/common/StackedBarChart";
import MonthWiseCourseStats from "../../../components/Admin/Dashboard/MonthWiseCourseStats/MonthWiseTrainingsCourse";

const Dashboard = () => {
  const [counts, setCounts] = useState();
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);
  const [userTypeLoading, setUserTypeLoading] = useState(false);
  const [courseTypeLoading, setCourseTypeLoading] = useState(false);
  const [trainingTypeLoading, setTrainingTypeLoading] = useState(false);
  const [trainingByDivisionLoading, setTrainingByDivisionLoading] =
    useState(false);
  const [userCountByStatus, setUserCountByStatus] = useState();
  const [courseCountsByType, setCourseCountsByType] = useState();
  const [trainingCountsByEventType, setTrainingCountsByEventType] = useState();
  const [trainingByDivisionData, setTrainingByDivisionData] = useState();

  const getCounts = () => {
    setDashboardStatsLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/adminDashboard/getCounts",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setCounts(res.data.data);
        setDashboardStatsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserCountsByStatus = () => {
    setUserTypeLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/adminDashboard/getUserCountsByStatus",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setUserCountByStatus(res.data.data);
        setUserTypeLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCourseCountsByType = () => {
    setCourseTypeLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/adminDashboard/getCourseCountsByType",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setCourseCountsByType(res.data.data);
        setCourseTypeLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTrainingCountsByEventType = () => {
    setTrainingTypeLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/adminDashboard/getTrainingCountsByEventType",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setTrainingCountsByEventType(res.data.data);
        setTrainingTypeLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTrainingsByDivisions = () => {
    setTrainingByDivisionLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/adminDashboard/getEnrollmentStatistics",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setTrainingByDivisionData(res.data.data);
        setTrainingByDivisionLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCounts();
    getUserCountsByStatus();
    getCourseCountsByType();
    getTrainingCountsByEventType();
    getTrainingsByDivisions();
  }, []);

  return (
    <div className="Dashboard">
      <div className="Dashboard__sec1">
        <div className="Dashboard__sec1__DashboardStats">
          <DashboardStats
            title="Total Users"
            icon={<PeopleIcon />}
            data={counts?.usersCount}
            loading={dashboardStatsLoading}
          />
        </div>
        <div className="Dashboard__sec1__DashboardStats">
          <DashboardStats
            title="Total Courses"
            icon={<LibraryBooksIcon />}
            data={counts?.coursesCount}
            loading={dashboardStatsLoading}
          />
        </div>
        <div className="Dashboard__sec1__DashboardStats">
          <DashboardStats
            title="Total Books"
            icon={<MenuBookIcon />}
            data={counts?.booksCount}
            loading={dashboardStatsLoading}
          />
        </div>
        <div className="Dashboard__sec1__DashboardStats">
          <DashboardStats
            title="Total Training"
            icon={<SchoolRoundedIcon />}
            data={counts?.trainingsCount}
            loading={dashboardStatsLoading}
          />
        </div>
      </div>
      <div className="Dashboard__sec2">
        <div className="Dashboard__sec2__Courses">
          <PieChartDonut
            title="Users by Status"
            data={userCountByStatus}
            loading={userTypeLoading}
          />
        </div>
        <div className="Dashboard__sec2__Courses">
          <PieChartDonut
            title="Courses by Type"
            data={courseCountsByType}
            loading={courseTypeLoading}
          />
        </div>
        <div className="Dashboard__sec2__Courses">
          <PieChartDonut
            title="Training by Event Type"
            data={trainingCountsByEventType}
            loading={trainingTypeLoading}
          />
        </div>
        <div className="Dashboard__sec2__Courses">
          <DoughnutChart
            title="Score by Divisions"
            data={trainingByDivisionData}
            loading={trainingByDivisionLoading}
          />
        </div>
      </div>
      <div className="Dashboard__sec2">
        <div className="Dashboard__sec2__MonthWiseTrainingsStats">
          <StackedBarChart
            title="Courses by Divisions"
            data={trainingByDivisionData}
            loading={trainingByDivisionLoading}
          />
        </div>
      </div>
      <div className="Dashboard__sec2">
        <div className="Dashboard__sec2__MonthWiseTrainingsStats">
          <MonthWiseCourseStats />
        </div>
      </div>
      <div className="Dashboard__sec2">
        <div className="Dashboard__sec2__MonthWiseTrainingsStats">
          <MonthWiseTrainingsStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
