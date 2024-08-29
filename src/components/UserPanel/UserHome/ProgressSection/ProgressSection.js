import { Button, IconButton } from "@mui/material";
import React from "react";
import "./ProgressSection.css";
import LaunchIcon from '@mui/icons-material/Launch';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate } from "react-router-dom";

const ProgressSection = ({ array }) => {

  const navigate = useNavigate();


  return (
    <div className="ProgressSection">
      <div className="ProgressSection__header__box">
        <div className="ProgressSection__header__heading">
          In progress
          <div className="ProgressSection__header_sub_heading">
            Recent Courses
          </div>
        </div>
        <div className="ProgressSection__header__btn">
          <Button onClick={() => { navigate("/UserPanel/UserCourses") }} variant="text" sx={{ bgcolor: "#fff", color: "black" }}>
            Browse all
          </Button>
        </div>
      </div>

      {array.map((cur, ind) => {
        if (cur.courseData) return (
          <div key={ind} className="ProgressSection__courses__progress__box">
            <div className="ProgressSection__courses__progress__box__left">
              <div className="ProgressSection__courses__icon">
                <img className="ProgressSection__courses__icon__img" src={cur.courseData?.courseThumbnail} alt={cur.courseData?.courseName} />
              </div>
              <div className="ProgressSection__courses__courseName__progress__container">
                <div className="ProgressSection__courses__name">{cur.courseData?.courseName}</div>
                {(cur.text && cur.text === "From Recent Courses Enrolled")
                  ?
                  <div className="ProgressSection__courses__progressBar__box">
                    <div className="ProgressSection__courses__progressBar">
                      <div
                        style={
                          cur.progress < 5
                            ? {
                              backgroundColor: "#FF4444",
                              minWidth: `${cur.progress + 1}%`,
                              maxWidth: `${cur.progress + 1}%`,
                            } : cur.progress < 30
                              ? {
                                backgroundColor: "#ff6961",
                                minWidth: `${cur.progress}%`,
                                maxWidth: `${cur.progress}%`,
                              }
                              : cur.progress < 70
                                ? {
                                  backgroundColor: "#ffd700",
                                  minWidth: `${cur.progress}%`,
                                  maxWidth: `${cur.progress}%`,
                                }
                                : {
                                  backgroundColor: "#00A86B",
                                  minWidth: `${cur.progress}%`,
                                  maxWidth: `${cur.progress}%`,
                                }
                        }
                        className="ProgressSection__courses__progressBar__fil"
                      ></div>
                    </div>
                    <div className="ProgressSection__courses__progressBar__value">
                      {cur.progress}%
                    </div>
                  </div>
                  : <div className="ProgressSection__courses__text__container">
                    Suggested Course for You
                  </div>
                }
              </div>
              <div className="ProgressSection__courses__percentage"
                style={{ backgroundColor: (cur.text && cur.text !== "From Recent Courses Enrolled") ? "#00a0ad" : (cur.percentage < 30 ? "#FF4444" : cur.percentage > 70 ? "green" : "#ffd700") }}
              >
                <div className="ProgressSection__courses__percentage__icon"><FactCheckIcon /></div>
                <div style={{fontSize:"small"}} className="ProgressSection__courses__percentage__num">{(cur.text && cur.text !== "From Recent Courses Enrolled") ? "New Course" : (cur.percentage) ? cur.percentage + "%" : "0%"}</div>
              </div>
            </div>
            <div className="ProgressSection__courses__progress__box__right">
              <IconButton onClick={() => {
                navigate("/course", {
                  state: {
                    id: cur.courseData._id,
                    backUrl: "/UserPanel",
                    courseData: cur.courseData
                  }
                })
              }}>
                <LaunchIcon />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSection;
