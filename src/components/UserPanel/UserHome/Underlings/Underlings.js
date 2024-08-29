import React from "react";
import "./Underlings.css";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Underlings = ({ underlingsStats }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [expandedTrainings, setExpandedTrainings] = React.useState(false);
  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleExpandTrainingsClick = () => {
    setExpandedTrainings(!expandedTrainings);
  };
  let data = underlingsStats;
  return (
    <div className="Underlings">
      <div className="Underlings__heading">Underlings</div>
      <div className="Underlings__card__container">
        {data.map((cur, ind) => {
          return (
            <div key={ind} className="Underlings__card">
              <div className="Underlings__card__head">
                <div className="Underlings__card__name">
                  {" "}
                  <Avatar
                    sx={{ bgcolor: "#41424C" }}
                    alt={cur.name}
                    src="/static/images/avatar/2.jpg"
                  />
                  {cur.name}
                </div>
                <div
                  className="Underlings__card__score__box"
                  style={{
                    backgroundColor:
                      cur.totalMaxScore === 0
                        ? "#00a0ad"
                        : (cur.totalScore / cur.totalMaxScore) * 100 >= 70
                        ? "#00FF00"
                        : (cur.totalScore / cur.totalMaxScore) * 100 >= 30
                        ? "#ffd700"
                        : (cur.totalScore / cur.totalMaxScore) * 100 >= 0
                        ? "#FF4444"
                        : "#00a0ad",
                  }}
                >
                  <div className="Underlings__card__score__icon">
                    <ScoreboardIcon />
                    Score:
                  </div>
                  {cur.totalMaxScore > 0
                    ? (cur.totalScore / cur.totalMaxScore) * 100
                    : "N/A"}
                </div>
              </div>
              <div className="Underlings__card__content__box">
                <div className="Underlings__card__content__item__box">
                  <div className="Underlings__card__content__item__name">
                    {" "}
                    <AssignmentTurnedInIcon />
                    Recent Course
                  </div>
                  <div className="Underlings__card__content__item__value">
                    {cur.recentEnrollment && cur.recentEnrollment.courseName
                      ? cur.recentEnrollment.courseName
                      : "N/A"}
                  </div>
                </div>
                <div className="Underlings__card__content__item__box">
                  <div className="Underlings__card__content__item__name">
                    {" "}
                    <LibraryBooksIcon />
                    Total courses
                  </div>
                  <div className="Underlings__card__content__item__value">
                    {cur.courseList ? cur.courseList.length : 0}
                  </div>
                </div>
                <div className="Underlings__card__content__item__box">
                  <div className="Underlings__card__content__item__name">
                    {" "}
                    <SchoolRoundedIcon />
                    total trainings attended
                  </div>
                  <div className="Underlings__card__content__item__value">
                    {cur.trainingList ? cur.trainingList.length : 0}
                  </div>
                </div>
                <div className="Underlying_Button_wrapper">
                  <Link
                    to={"/UserPanel/enrollCourses"}
                    state={{ underlingID: cur?.employeeID }}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      color: "#ffff",
                      fontWeight: "bold",
                      backgroundColor: "#00a0ad",
                      "&:hover": {
                        backgroundColor: "#ffff",
                        borderColor: "00a0ad",
                        color: "#00a0ad",
                      },
                    }}
                  >
                    Enroll
                  </Link>
                </div>
              </div>
              <div className="Underlings__card__expanded__box">
                <div className="Underlings__card__expanded__courses__box">
                  <div
                    onClick={handleExpandClick}
                    className="Underlings__card__expanded__courses__heading"
                  >
                    <div className="Underlings__card__content__item__name">
                      {" "}
                      <LibraryBooksIcon />
                      Courses List
                    </div>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </div>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div className="ProgressSection__courses__progress__box__container">
                      {cur.courseList.length > 0 ? (
                        cur.courseList.map((subCur, subInd) => {
                          return (
                            <div
                              key={subInd}
                              className="ProgressSection__courses__progress__box"
                            >
                              <div className="ProgressSection__courses__progress__box__left">
                                <div className="ProgressSection__courses__icon">
                                  <img
                                    className="ProgressSection__courses__icon__img"
                                    src={subCur.courseThumbnail}
                                    alt={subCur.courseName}
                                  />
                                </div>
                                <div className="ProgressSection__courses__courseName__progress__container">
                                  <div className="ProgressSection__courses__name">
                                    {subCur.courseName}
                                  </div>
                                  <div className="ProgressSection__courses__text__container">
                                    {"By : " + subCur.courseInstructor}
                                  </div>
                                </div>
                                <div
                                  className="ProgressSection__courses__percentage"
                                  style={{
                                    backgroundColor:
                                      !cur.scoreList[subInd].maxScore &&
                                      cur.scoreList[subInd].maxScore <= 0
                                        ? "#00a0ad"
                                        : (cur.scoreList[subInd].score /
                                            cur.scoreList[subInd].maxScore) *
                                            100 >=
                                          70
                                        ? "#00FF00"
                                        : (cur.scoreList[subInd].score /
                                            cur.scoreList[subInd].maxScore) *
                                            100 >=
                                          30
                                        ? "#ffd700"
                                        : (cur.scoreList[subInd].score /
                                            cur.scoreList[subInd].maxScore) *
                                            100 >=
                                          30
                                        ? "#FF4444"
                                        : "#00a0ad",
                                  }}
                                >
                                  <div className="ProgressSection__courses__percentage__icon">
                                    <FactCheckIcon />
                                  </div>
                                  <div className="ProgressSection__courses__percentage__num">
                                    {cur.scoreList[subInd].maxScore > 0
                                      ? (cur.scoreList[subInd].score /
                                          cur.scoreList[subInd].maxScore) *
                                          100 +
                                        "%"
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="ProgressSection__courses__progress__box__right">
                                <IconButton
                                  onClick={() => {
                                    navigate("/course", {
                                      state: {
                                        id: subCur._id,
                                        backUrl: "/UserPanel",
                                        courseData: subCur,
                                      },
                                    });
                                  }}
                                >
                                  <LaunchIcon />
                                </IconButton>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            marginTop: "100px",
                            fontSize: "x-large",
                            textAlign: "center",
                          }}
                        >
                          No Courses Enrolled Yet
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
                {!expanded && !expandedTrainings ? (
                  <div className="Underlings__card__expanded__divider"></div>
                ) : !expanded && expandedTrainings ? (
                  <div className="Underlings__card__expanded__divider"></div>
                ) : null}
                <div className="Underlings__card__expanded__training__box">
                  <div
                    onClick={handleExpandTrainingsClick}
                    className="Underlings__card__expanded__training__heading"
                  >
                    {" "}
                    <div className="Underlings__card__content__item__name">
                      {" "}
                      <SchoolRoundedIcon />
                      Trainings List
                    </div>
                    <ExpandMore
                      expand={expandedTrainings}
                      onClick={handleExpandTrainingsClick}
                      aria-expanded={expandedTrainings}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </div>
                  <Collapse in={expandedTrainings} timeout="auto" unmountOnExit>
                    <div className="ProgressSection__courses__progress__box__container">
                      {cur.trainingList.length > 0 ? (
                        cur.trainingList.map((subCur2, subInd2) => {
                          return (
                            <div
                              key={subInd2}
                              className="Underlings__card__expanded__training__item"
                            >
                              <div className="Underlings__card__expanded__training__name">
                                {subCur2.name}
                              </div>
                              <div className="Underlings__card__expanded__training__date__box">
                                <div
                                  style={{ backgroundColor: "green" }}
                                  className="Underlings__card__expanded__training__date"
                                >
                                  <CalendarMonthIcon />
                                  Start :{" "}
                                  <div>
                                    {new Date(
                                      subCur2.startDate
                                    ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                                <div
                                  style={{ backgroundColor: "#FF4444" }}
                                  className="Underlings__card__expanded__training__date"
                                >
                                  <CalendarMonthIcon />
                                  End :{" "}
                                  <div>
                                    {new Date(
                                      subCur2.endDate
                                    ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <IconButton
                                  onClick={() => {
                                    navigate("/UserPanel/oneTraining", {
                                      state: {
                                        id: subCur2._id,
                                        backUrl: "/UserPanel",
                                      },
                                    });
                                  }}
                                >
                                  <LaunchIcon />
                                </IconButton>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            marginTop: "100px",
                            fontSize: "x-large",
                            textAlign: "center",
                          }}
                        >
                          No Trainings Attended Yet
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Underlings;
