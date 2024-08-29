import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Login from "./Pages/Login/Login";
import Updates from "./Pages/Updates/Updates";
import Gallery from "./Pages/Gallery/Gallery";
import SignUp from "./Pages/SignUp/SignUp";
import Admin from "./Pages/Admin/Admin";
import ViewCourse from "./Pages/Course/ViewCourse";
import Error from "./Pages/Error/Error";
import Verify from "./Pages/Verify/Verify";
import AdminLogin from "./Pages/Admin/AdminLogin/AdminLogin";
import UserPanel from "./Pages/UserPanel/UserPanel";
import { useState, useEffect } from "react";
import PasswordVerify from "./Pages/Admin/AdminPasswordVerify/Verify";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const orangeTheme = createTheme({
  palette: { primary: { main: "#00a0ad" }, secondary: { main: "#41424C" } },
});

function AdminWhole() {
  const [refresh, setrefresh] = React.useState(true);
  return (
    <div className="App">
      <ThemeProvider theme={orangeTheme}>
        {localStorage.getItem("token") && localStorage.userType === "Admin" ? (
          <Admin
            setrefresh={(item) => {
              setrefresh(item);
            }}
            refresh={refresh}
          />
        ) : (
          <AdminLogin
            setrefresh={(item) => {
              setrefresh(item);
            }}
            refresh={refresh}
          />
        )}
      </ThemeProvider>
    </div>
  );
}
function UserWhole() {
  const [refresh, setRefresh] = React.useState(true);
  return (
    <div className="App">
      {localStorage.getItem("token") && localStorage.userType === "User" ? (
        <>
          <UserPanel
            setRefresh={(item) => {
              setRefresh(item);
            }}
            refresh={refresh}
          />
        </>
      ) : (
        <Login
          setRefresh={(item) => {
            setRefresh(item);
          }}
          refresh={refresh}
        />
      )}
    </div>
  );
}

function App() {
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/global/verify", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        //console.log(res);
        if (res.data.verified === false) {
          localStorage.clear();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/course" element={<ViewCourse />} />
          <Route path="/course/preReq" element={<ViewCourse />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={UserWhole()} />

          <Route path="/UserPanel" element={UserWhole()} />
          <Route path="/UserPanel/UserCourses" element={UserWhole()} />
          <Route path="/UserPanel/UserBook" element={UserWhole()} />
          <Route path="/UserPanel/Trainings" element={UserWhole()} />
          <Route path="/UserPanel/oneTraining" element={UserWhole()} />
          <Route path="/UserPanel/UserCoursePlayer" element={UserWhole()} />
          <Route path="/UserPanel/UserViewBook" element={UserWhole()} />
          <Route path="/UserPanel/enrollCourses" element={UserWhole()} />

          <Route path="/admin" element={AdminWhole()} />
          <Route path="/admin/settings" element={AdminWhole()} />
          <Route path="/admin/users" element={AdminWhole()} />
          <Route path="/admin/books" element={AdminWhole()} />
          <Route path="/admin/issuedBooks" element={AdminWhole()} />
          <Route path="/admin/updates" element={AdminWhole()} />
          <Route path="/admin/trainings" element={AdminWhole()} />
          <Route path="/admin/banner" element={AdminWhole()} />
          <Route path="/admin/statistics" element={AdminWhole()} />
          <Route path="/admin/video" element={AdminWhole()} />
          <Route path="/admin/testimonials" element={AdminWhole()} />
          <Route path="/admin/learningPartners" element={AdminWhole()} />
          <Route path="/admin/gallery" element={AdminWhole()} />
          <Route path="/admin/addCourse" element={AdminWhole()} />
          <Route path="/admin/AllCourses" element={AdminWhole()} />
          <Route path="/admin/reports" element={AdminWhole()} />

          <Route exact path="/verify" element={<Verify />} />
          <Route
            exact
            path="/AdminPasswordVerify"
            element={<PasswordVerify type={"admin"} />}
          />
          <Route
            exact
            path="/UserPasswordVerify"
            element={<PasswordVerify type={"users"} />}
          />

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
