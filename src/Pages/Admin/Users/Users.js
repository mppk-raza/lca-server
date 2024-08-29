import React, { useState, useEffect } from "react";
import "./Users.css";
import UsersTable from "../../../components/Admin/Users/UsersTable/UsersTable";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import AddEmployees from "../../../components/Admin/Users/AddEmployees/AddEmployees";

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

const Users = () => {
  const [value, setValue] = React.useState("allUsers");
  const [loading, setLoading] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("All");
  const [refresh, setRefresh] = React.useState(null);
  const [users, setUsers] = useState();
  const [searchUser, setSearchUser] = useState("");

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTabs = () => {
    return (
      <>
        {radioValue === "Internal" ? (
          <>
            <Box
              sx={{ width: "95%", typography: "body1", margin: "30px auto" }}
            >
              <TabContext value={value}>
                <Box
                  className="users__Tabs"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <TabList
                    onChange={handleChange}
                    onClick={() => setRefresh(!refresh)}
                    variant="scrollable"
                    TabIndicatorProps={{
                      style: { background: "#00a0ad", textColor: "red" },
                    }}
                    sx={{ "& button.Mui-selected": { color: "#00a0ad" } }}
                  >
                    <Tab label="All Users" value="allUsers" />
                    <Tab label="Active Users" value="activeUsers" />
                    {/* <Tab label="Approval Users" value="approvalUsers" /> */}
                    <Tab label="Suspended Users" value="suspendedUsers" />
                  </TabList>
                </Box>
                <TabPanel inkBarStyle={{ background: "red" }} value="allUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                <TabPanel value="activeUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                {/* <TabPanel value="approvalUsers">
              <UsersTable users={users} value={value} refresh={refresh} setRefresh={setRefresh} setLoading={setLoading} searchUser={searchUser}/>
            </TabPanel> */}
                <TabPanel value="suspendedUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{ width: "95%", typography: "body1", margin: "30px auto" }}
            >
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
                    onClick={() => setRefresh(!refresh)}
                  >
                    <Tab label="All Users" value="allUsers" />
                    <Tab label="Active Users" value="activeUsers" />
                    <Tab label="Unverified User" value="unverifiedUser" />
                    <Tab label="Pending  Approval" value="pendingUsers" />
                    {/* <Tab label="Approval Users" value="approvalUsers" /> */}
                    <Tab label="Suspended Users" value="suspendedUsers" />
                  </TabList>
                </Box>
                <TabPanel value="allUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                <TabPanel value="activeUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                <TabPanel value="unverifiedUser">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                <TabPanel value="pendingUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
                {/* <TabPanel value="approvalUsers">
              <UsersTable users={users} value={value} refresh={refresh} setRefresh={setRefresh} setLoading={setLoading} searchUser={searchUser}/>
            </TabPanel> */}
                <TabPanel value="suspendedUsers">
                  <UsersTable
                    users={users}
                    value={value}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setLoading={setLoading}
                    searchUser={searchUser}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </>
        )}
      </>
    );
  };

  const getAllUsers = () => {
    setLoading(true);
    axios
      // .post("http://localhost:7000" + "/api/users/getAllUsers", {
      .post(process.env.REACT_APP_BACKEND_URL + "/api/users/getAllUsers", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        let temp = res.data.data ? res.data.data : [];
        if (radioValue === "All") {
          setUsers(temp);
        } else if (radioValue === "Internal") {
          const found = temp.filter((obj) => {
            return obj.isEmployee.isTrue === true;
          });
          setUsers(found);
        } else if (radioValue === "External") {
          const found = temp.filter((obj) => {
            return obj.isEmployee.isTrue === false;
          });
          setUsers(found);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getTabs();
  }, [radioValue]);
  useEffect(() => {
    getAllUsers();
  }, [refresh]);
  return (
    <div className="Users">
      <AddEmployees
        refresh={refresh}
        setRefresh={setRefresh}
        setLoading={setLoading}
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#41424C",
            borderRadius: "60px",
            margin: "10px auto",
            width: "95%",
            color: "white",
            padding: 0
          }}
        >
          <Toolbar disableGutters sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", padding: "0 4px" }} >
            <Search sx={{ minWidth: "65%" }}>
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
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={radioValue}
              onChange={handleRadioChange}
              onClick={() => setRefresh(!refresh)}
            >
              <FormControlLabel
                label="All"
                value="All"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Employees"
                value="Internal"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
              />
              <FormControlLabel
                label="External"
                value="External"
                control={
                  <Radio
                    sx={{
                      "&, &.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
              />
            </RadioGroup>
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

export default Users;
