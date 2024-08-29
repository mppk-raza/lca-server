import React from "react";
import "./UserPanel.css";
import UserHeader from "../../components/UserPanel/UserHeader/UserHeader";
import UserHome from "./UserHome/UserHome";
import UserCourses from "./UserCourses/UserCourses";
import UserTrainings from "./UserTrainings/UserTrainings";
import OneTraining from "./OneTraining/OneTraining";
import UserBook from "./UserBook/UserBook";
import UserCoursePlayer from "./UserCoursePlayer/UserCoursePlayer";
import UserViewBook from "./UserViewBook/UserViewBook";
import { useLocation } from "react-router-dom";
import UnderlingCourseData from "../../components/UserPanel/UserHome/Underlings/UnderlingCourseData/UnderlingCourseData";

const UserPanel = ({ refresh, setRefresh }) => {
  const path = useLocation().pathname;

  return (
    <div className="UserPanel">
      <UserHeader refresh={refresh} setRefresh={setRefresh} />
      {path === "/UserPanel" || path === "/login" ? (
        <UserHome />
      ) : path === "/UserPanel/UserCourses" ? (
        <UserCourses />
      ) : path === "/UserPanel/Trainings" ? (
        <UserTrainings />
      ) : path === "/UserPanel/oneTraining" ? (
        <OneTraining />
      ) : path === "/UserPanel/UserBook" ? (
        <UserBook />
      ) : path === "/UserPanel/UserCoursePlayer" ? (
        <UserCoursePlayer />
      ) : path === "/UserPanel/UserViewBook" ? (
        <UserViewBook />
      ) : path === "/UserPanel/enrollCourses" ? (
        <UnderlingCourseData />
      ) : null}
    </div>
  );
};

export default UserPanel;
