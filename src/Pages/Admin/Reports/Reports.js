import SearchIcon from "@mui/icons-material/Search";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputBase from "@mui/material/InputBase";
import Tab from "@mui/material/Tab";
import Toolbar from "@mui/material/Toolbar";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EmployeesTable from "../../../components/Admin/Users/EmployeesTable/EmployeesTable";
import ExternalUserTable from "../../../components/Admin/Users/ExternalUserTable/ExternalUserTable";
import "./Reports.css";
import StackedBarChart from "../../../components/common/StackedBarChart";
import DoughnutChart from "../../../components/common/DoughnutChart";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "27ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));

const Reports = () => {
  const [value, setValue] = React.useState("employees");
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTabs = () => {
    return (
      <>
        <Box sx={{ width: "95%", typography: "body1", margin: "30px auto" }}>
          <TabContext value={value}>
            <Box
              className="users__Tabs"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <TabList
                variant="scrollable"
                TabIndicatorProps={{
                  style: { background: "#00a0ad" },
                }}
                sx={{ "& button.Mui-selected": { color: "#00a0ad" } }}
                onChange={handleChange}
              >
                <Tab label="Employees" value="employees" />
                <Tab label="External Users" value="externalUsers" />
              </TabList>
            </Box>
            <TabPanel value="employees">
              <EmployeesTable users={filteredData} searchUser={searchUser} />
            </TabPanel>
            <TabPanel value="externalUsers">
              <ExternalUserTable users={filteredData} searchUser={searchUser} />
            </TabPanel>
          </TabContext>
        </Box>
      </>
    );
  };

  const getAllUsers = () => {
    setLoading(true);
    axios
      // .post("http://localhost:7000" + "/api/users/getAllUsers", {
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/adminDashboard/getReport`,
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        setLoading(false);
        let temp = res.data.data ? res.data.data : [];
        setUsers(temp);
        setFilteredData(temp);
      })
      .catch((err) => {
        console.log(err);
        setUsers([]);
        setFilteredData([]);
        setLoading(false);
      });
  };

  const toggleTabs = () => {
    let temp;
    if (value === "employees") {
      temp = users?.filter((item) => item.empid !== null);
    } else {
      temp = users?.filter((item) => item.empid === null);
    }
    setFilteredData(temp);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    toggleTabs();
  }, [value]);

  return (
    <div className="Users">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#41424C",
            borderRadius: "60px",
            margin: "10px auto",
            width: "95%",
            color: "white",
            padding: 0,
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              // flexWrap: "wrap",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            <Search sx={{ minWidth: "98%" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      {getTabs()}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Reports;
