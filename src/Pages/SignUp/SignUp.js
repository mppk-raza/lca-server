import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import EmployeeSignup from "./EmployeeSignup";
import UserSignup from "./UserSignup";
import "./SignUp.css";

const SignUp = () => {
  const [value, setValue] = React.useState("employee");
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Header />
      <div className="signUp">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h3>Register</h3>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab value="employee" label="Employee" />
              <Tab value="external" label="External Users" />
            </TabList>
          </Box>
          <TabPanel value="employee">
            <EmployeeSignup />
          </TabPanel>
          <TabPanel value="external">
            <UserSignup />
          </TabPanel>
        </TabContext>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
