import React, { useState, useEffect, useRef } from "react";
import "./ViewCourse.css";
import { useLocation, useNavigate } from "react-router-dom";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import Sections from "../../components/ViewCourse/Sections/Sections";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditCourse from "../Admin/EditCourse/EditCourse";
import LongText from "../../components/LongText/LongText";
import axios from "axios";
import ReactToPrint from "react-to-print";
import { PDFToPrint } from "./PDFToPrint";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ViewCourse = () => {
  const PDFRef = useRef();
  const [courseData, setCourseData] = useState();
  const [edit, setEdit] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(true);
  const [eligibility, setEligibility] = useState(false);
  const [availability, setAvailability] = useState(false);
  const [value, setValue] = useState("Abstract");
  const [timerRun, setTimerRun] = useState(false);
  const [enrolledUserList, setEnrolledUserList] = useState(null);
  const [enrolledUser, setEnrolledUser] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedbackList, setFilteredFeedbackList] = useState([]);
  const [searchFeedback, setSearchFeedback] = useState("");
  const [ratings, setRatings] = useState(0);
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false);

  let { state } = useLocation();
  let navigate = useNavigate();

  const path = useLocation().pathname;

  React.useEffect(() => {
    setTimeout(() => {
      setTimerRun(true);
    }, 15000);
  }, []);

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }

  const handleCloseFeedbackModal = () => {
    setRatings(0);
    setFeedback("");
    setEnrolledUser("");
    setOpenFeedbackModal(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const userType = localStorage.getItem("userType");

  const getCourseDetails = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/getCourseDetails",
        { courseID: state.id }
      )
      .then((res) => {
        setCourseData(res.data.data);
        setFeedbackList(res.data?.data.feedbacks[0]);
        setFilteredFeedbackList(res.data?.data.feedbacks[0]);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };
  const checkAvailability = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/checkAvailability",
        { token: localStorage.getItem("token") }
      )
      .then((res) => {
        let tempAvail = res.data.data?.find((id) => id._id === state.id)
          ? true
          : false;

        setAvailability(tempAvail);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkEligibility = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/checkEligibility",
        { token: localStorage.getItem("token"), courseID: state.id }
      )
      .then((res) => {
        if (res.data.error !== true) {
          setEligibility({ eligibility: true, message: res.data.message });
          setOpen(false);
        } else {
          setEligibility({ eligibility: false, message: res.data.message });
          setOpen(false);
        }
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  const getEnrolledUser = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/enrollment/getNoFeedbackEmployees",
        { token: localStorage.getItem("token"), courseID: state.id }
      )
      .then((res) => {
        if (res.data.error !== true) {
          setEnrolledUserList(res?.data?.data);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  const submitFeedbackHandler = (e) => {
    e.preventDefault();
    if (ratings > 0 && enrolledUser !== "") {
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            "/api/enrollment/addEmployeeFeedback",
          {
            token: localStorage.getItem("token"),
            enrollmentID: enrolledUser?._id,
            rating: ratings,
            feedback: feedback,
          }
        )
        .then((res) => {
          if (res.data.error !== true) {
            setOpenFeedbackModal(false);
            getCourseDetails();
            getEnrolledUser();
          }
        })
        .catch((err) => {
          toast.error("Something went wrong");
          console.log(err);
        });
    } else {
      toast.error("Please fill all the required fields");
    }
  };
  useEffect(() => {
    if (userType === "User") {
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            "/api/enrollment/getSingleEnrolled",
          { token: localStorage.getItem("token"), courseID: state.id }
        )
        .then((res) => {
          if (res.data.error !== true) {
            setIsComplete(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setOpen(false);
        });
    }
  }, []);
  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);
  useEffect(() => {
    getCourseDetails();
    getEnrolledUser();
  }, [state, path]);
  useEffect(() => {
    checkAvailability();
    checkEligibility();
  }, [state, path, refresh]);

  const handleEnroll = () => {
    setOpen(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/enrollment/enrollCourse",
        { token: localStorage.getItem("token"), courseID: state.id }
      )
      .then((res) => {
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setOpen(false);
          setRefresh(!refresh);
        } else {
          toast.warn(res.data.message);
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  const searchFeedbackHandler = () => {
    setFilteredFeedbackList(
      feedbackList.filter((item) =>
        item?.userName.toLowerCase().includes(searchFeedback.toLowerCase())
      )
    );
  };

  useEffect(() => {
    searchFeedbackHandler();
  }, [searchFeedback]);

  return (
    <div className="ViewCourse">
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
      {courseData ? (
        <>
          <div className="viewCourse__head">
            <div className="viewCourse__head__btn__box">
              <Button
                sx={{
                  color: "#00a0ad",
                  borderColor: "#00a0ad",
                  "&:hover": {
                    backgroundColor: "#00a0ad",
                    color: "#41424C",
                    borderColor: "#41424C",
                  },
                  "&:active": { backgroundColor: "#00a0ad" },
                }}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                component={Link}
                to={
                  state.backUrl === "/admin/AllCourses"
                    ? "/admin/AllCourses"
                    : state.backUrl === "/UserPanel/UserCourses"
                    ? "/UserPanel/UserCourses"
                    : state.backUrl === "/UserPanel"
                    ? "/UserPanel"
                    : "/"
                }
              >
                Back
              </Button>
              {userType === "Admin" && edit === false ? (
                <Button
                  sx={{
                    color: "#00a0ad",
                    borderColor: "#00a0ad",
                    "&:hover": {
                      backgroundColor: "#00a0ad",
                      color: "#41424C",
                      borderColor: "#41424C",
                    },
                    "&:active": { backgroundColor: "#00a0ad" },
                  }}
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
              ) : userType === "Admin" && edit === true ? (
                <Button
                  sx={{
                    color: "#00a0ad",
                    borderColor: "#00a0ad",
                    "&:hover": {
                      backgroundColor: "#00a0ad",
                      color: "#41424C",
                      borderColor: "#41424C",
                    },
                    "&:active": { backgroundColor: "#00a0ad" },
                  }}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
          {edit ? (
            <div className="viewCourse__edit__box">
              <EditCourse courseData={courseData} />
            </div>
          ) : (
            <>
              <div
                className="viewCourse__box"
                // style={{
                //   backgroundImage: `url(${background})`,
                //   backgroundPosition: "center",
                //   backgroundSize: "cover",
                //   backgroundRepeat: "no-repeat",
                // }}
              >
                <div className="custom-shape-divider-top-1669894152">
                  <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                      className="shape-fill"
                    ></path>
                  </svg>
                </div>
                <div className="viewCourse__box__left">
                  <img
                    className="box__left__img"
                    alt={courseData?.courseName}
                    src={courseData?.courseThumbnail}
                  />
                  {windowDimensions.width >= 550 ? (
                    <div>
                      {!availability && !userType === "User" ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" && availability === false ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Available
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === false &&
                        eligibility.eligibility === false ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message !== "Already enrolled." &&
                        eligibility.message !==
                          "Please complete course pre-requisites to enroll." ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message === "Already enrolled." ? (
                        <div className="box__left__btn__notEligible">
                          <div
                            onClick={() =>
                              navigate("/UserPanel/UserCoursePlayer", {
                                state: {
                                  id: state.id,
                                  courseData: state.courseData,
                                },
                              })
                            }
                            className="box__left__btn__color"
                          >
                            Play
                          </div>
                          {courseData.hasCertificate ? (
                            isComplete.completed ? (
                              (isComplete.score / isComplete.maxScore) * 100 >
                              70 ? (
                                timerRun ? (
                                  <>
                                    <ReactToPrint
                                      trigger={() => (
                                        <div className="box__left__btn__color2">
                                          Download Certificate
                                        </div>
                                      )}
                                      content={() => PDFRef.current}
                                    />
                                    <div style={{ display: "none" }}>
                                      <PDFToPrint
                                        name={
                                          JSON.parse(
                                            localStorage.getItem("user")
                                          )?.name
                                        }
                                        course={courseData?.courseName}
                                        date={isComplete?.completedDate}
                                        ref={PDFRef}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="box__left__btn__color2">
                                    Generating Certificate...
                                  </div>
                                )
                              ) : (
                                <div
                                  className="box__left__btn__color2"
                                  onClick={() => {
                                    toast.info(
                                      "Your quiz score is lower than 70%. Please retake the quizzes to gain a better score and get a certificate"
                                    );
                                  }}
                                >
                                  Low Quiz Score (
                                  {(isComplete.score / isComplete.maxScore) *
                                    100}
                                  %)
                                </div>
                              )
                            ) : (
                              <div>
                                <br />
                                Complete the course to get a certificate!
                              </div>
                            )
                          ) : (
                            <div>
                              <br />
                              This course has no certification
                            </div>
                          )}
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message ===
                          "Please complete course pre-requisites to enroll." ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            complete course pre-requisites
                          </div>
                        </div>
                      ) : userType === "Admin" ? null : (
                        <div
                          className="box__left__btn"
                          onClick={() => {
                            handleEnroll();
                          }}
                        >
                          <div className="box__left__btn__color">Enroll</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="viewCourse__box__right">
                      <div className="box__right__title">
                        {courseData.courseName}
                      </div>
                      <div className="box__right__rating">
                        <Rating
                          name="ratings"
                          value={courseData?.averageRating}
                          size="large"
                          disabled={true}
                        />
                      </div>
                      <div className="box__right__text">
                        {courseData.courseAbstract.length >= 110
                          ? courseData.courseAbstract.substring(0, 110) + "..."
                          : courseData.courseAbstract}
                      </div>
                    </div>
                  )}
                  <div className="box__left__details">
                    <div className="box__left__heading">
                      This course include:
                    </div>
                    <div className="box__left__details__content__box">
                      <AvTimerIcon />
                      <div className="box__left__details__content">
                        Watch Time :{" "}
                        {courseData.courseStats.watchTime
                          ? courseData.courseStats.watchTime
                          : "N/A"}
                      </div>
                    </div>
                    <div className="box__left__details__content__box">
                      <FactCheckOutlinedIcon />
                      <div className="box__left__details__content">
                        {courseData.courseStats.countSections}{" "}
                        {courseData.courseStats.countSections > 1
                          ? " Sections"
                          : "Section"}
                      </div>
                    </div>
                    <div className="box__left__details__content__box">
                      <MenuBookOutlinedIcon />
                      <div className="box__left__details__content">
                        {courseData.courseStats.countLessons}{" "}
                        {courseData.courseStats.countLessons > 1
                          ? " Lessons"
                          : "Lesson"}
                      </div>
                    </div>
                  </div>
                  {windowDimensions.width <= 550 ? (
                    <div>
                      {!availability && !userType === "User" ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" && availability === false ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === false &&
                        eligibility.eligibility === false ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message !== "Already enrolled." &&
                        eligibility.message !==
                          "Please complete course pre-requisites to enroll." ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            Not Eligible
                          </div>
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message === "Already enrolled." ? (
                        <div className="box__left__btn__notEligible">
                          <div
                            onClick={() =>
                              navigate("/UserPanel/UserCoursePlayer", {
                                state: {
                                  id: state.id,
                                  courseData: state.courseData,
                                },
                              })
                            }
                            className="box__left__btn__color"
                          >
                            Play
                          </div>
                          {courseData.hasCertificate ? (
                            isComplete.completed ? (
                              (isComplete.score / isComplete.maxScore) * 100 >
                              70 ? (
                                timerRun ? (
                                  <>
                                    <ReactToPrint
                                      trigger={() => (
                                        <div className="box__left__btn__color2">
                                          Download Certificate
                                        </div>
                                      )}
                                      content={() => PDFRef.current}
                                    />
                                    <div style={{ display: "none" }}>
                                      <PDFToPrint
                                        name={
                                          JSON.parse(
                                            localStorage.getItem("user")
                                          )?.name
                                        }
                                        course={courseData?.courseName}
                                        date={isComplete?.completedDate}
                                        ref={PDFRef}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="box__left__btn__color2">
                                    Generating Certificate...
                                  </div>
                                )
                              ) : (
                                <div
                                  className="box__left__btn__color2"
                                  onClick={() => {
                                    toast.info(
                                      "Your quiz score is lower than 70%. Please retake the quizzes to gain a better score and get a certificate"
                                    );
                                  }}
                                >
                                  Low Quiz Score (
                                  {(isComplete.score / isComplete.maxScore) *
                                    100}
                                  %)
                                </div>
                              )
                            ) : (
                              <div>
                                <br />
                                Complete the course to get a certificate!
                              </div>
                            )
                          ) : (
                            <div>This course has no certification</div>
                          )}
                        </div>
                      ) : userType === "User" &&
                        availability === true &&
                        eligibility.eligibility === false &&
                        eligibility.message ===
                          "Please complete course pre-requisites to enroll." ? (
                        <div className="box__left__btn__notEligible">
                          <div className="box__left__btn__color__notEligible">
                            complete course pre-requisites
                          </div>
                        </div>
                      ) : userType === "Admin" ? null : (
                        <div
                          className="box__left__btn"
                          onClick={() => {
                            handleEnroll();
                          }}
                        >
                          <div className="box__left__btn__color">Enroll</div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                {windowDimensions.width > 550 ? (
                  <div className="viewCourse__box__right">
                    <div className="box__right__title">
                      {courseData.courseName}
                    </div>
                    <div className="box__right__rating">
                      <Rating
                        name="ratings"
                        value={courseData?.averageRating}
                        size="large"
                        disabled={true}
                      />
                    </div>
                    <div className="box__right__text">
                      {courseData.courseAbstract.length >= 130
                        ? courseData.courseAbstract.substring(0, 130) + "..."
                        : courseData.courseAbstract}
                    </div>
                  </div>
                ) : null}
              </div>
              {windowDimensions.width >= 550 ? (
                <div className="viewCourse__tabs__container">
                  <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      margin: "30px 0 0 0",
                    }}
                  >
                    <TabContext value={value}>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          // bgcolor: "#00a0ad3a",
                        }}
                      >
                        <TabList
                          onChange={handleChange}
                          variant="scrollable"
                          TabIndicatorProps={{
                            style: { background: "#00a0ad" },
                          }}
                          sx={
                            windowDimensions.width >= 550
                              ? {
                                  marginLeft: "47%",
                                  "& button.Mui-selected": { color: "#00a0ad" },
                                }
                              : {
                                  marginLeft: "0",
                                  "& button.Mui-selected": { color: "#00a0ad" },
                                }
                          }
                        >
                          <Tab label="Abstract" value="Abstract" />
                          <Tab label="Instructor" value="Instructor" />
                          <Tab label="Sections" value="Sections" />
                          {courseData.prerequisites.length >= 1 ? (
                            <Tab label="Prerequisites" value="Prerequisites" />
                          ) : null}
                          {userType === "Admin" ? (
                            <Tab label="Feedbacks" value="Feedbacks" />
                          ) : null}
                        </TabList>
                      </Box>

                      <TabPanel value="Abstract">
                        <div className="tab__box">
                          <div className="tab__box__abstract">
                            {courseData.courseAbstract}
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel value="Instructor">
                        <div className="tab__box">
                          <div className="tab__box__instructor">
                            {courseData.courseInstructor}
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel value="Sections">
                        <Sections sections={courseData.courseContent} />
                      </TabPanel>
                      <TabPanel value="Prerequisites">
                        {courseData.prerequisites.map((cur, ind) => {
                          return (
                            <div key={ind} className="tab__box__preReq__list">
                              <div className="tab__box__preReq__name">
                                {cur.courseName}
                              </div>
                              <Button
                                sx={{
                                  color: "#00a0ad",
                                  borderColor: "#00a0ad",
                                  "&:hover": {
                                    backgroundColor: "#00a0ad",
                                    color: "#41424C",
                                    borderColor: "#00a0ad",
                                  },
                                  "&:active": { backgroundColor: "#00a0ad" },
                                }}
                                variant="outlined"
                                size="small"
                                component={Link}
                                to="/course"
                                state={{
                                  id: cur._id,
                                  backUrl:
                                    userType === "User"
                                      ? "/UserPanel/UserCourses"
                                      : userType === "Admin"
                                      ? "/admin/AllCourses"
                                      : "/",
                                }}
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </TabPanel>
                      <TabPanel value="Feedbacks">
                        <div className="tab__box__feedback__button">
                          <Button
                            sx={{
                              color: "#00a0ad",
                              borderColor: "#00a0ad",
                              "&:hover": {
                                backgroundColor: "#00a0ad",
                                color: "#41424C",
                                borderColor: "#00a0ad",
                              },
                              "&:active": { backgroundColor: "#00a0ad" },
                            }}
                            variant="outlined"
                            size="small"
                            onClick={() => setOpenFeedbackModal(true)}
                          >
                            Add Feedback
                          </Button>
                          <TextField
                            sx={{ width: "70%" }}
                            id="outlined"
                            label=""
                            variant="outlined"
                            name="searchFeedback"
                            autoComplete={false}
                            value={searchFeedback}
                            onChange={(e) => setSearchFeedback(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                        {filteredFeedbackList?.map((cur, ind) => {
                          return (
                            <div key={ind} className="tab__box__feedback__list">
                              <div className="tab__box__feedback__name">
                                <div className="tab__box__feedback__name__wrappper">
                                  <span>{cur.userName}</span>
                                  <span>{cur.userEmail}</span>
                                </div>
                                <div className="box__right__rating">
                                  <Rating
                                    name="ratings"
                                    value={cur?.rating}
                                    size="large"
                                    disabled={true}
                                  />
                                </div>
                              </div>
                              <div className="tab__box__abstract">
                                {cur.feedback}
                              </div>
                            </div>
                          );
                        })}
                      </TabPanel>
                    </TabContext>
                  </Box>
                </div>
              ) : (
                <div className="ViewCourse__details__box__mobile">
                  <div className="ViewCourse__instr__box__mob">
                    <div className="ViewCourse__heading__mob">Instructor:</div>
                    <div className="ViewCourse__instr__name__mob">
                      {courseData.courseInstructor}
                    </div>
                  </div>
                  <div className="ViewCourse__abstract__box__mob">
                    <div className="ViewCourse__heading__mob">Abstract</div>

                    <div className="ViewCourse__abstract__mob">
                      <LongText
                        content={courseData.courseAbstract}
                        limit={70}
                      />
                    </div>
                  </div>
                  {courseData.prerequisites.length >= 1 ? (
                    <div className="ViewCourse__preReq__box__mob">
                      <div className="ViewCourse__heading__mob">
                        Prerequisites
                      </div>
                      <div className="ViewCourse__preReq__mob">
                        {courseData.prerequisites.map((cur, ind) => {
                          return (
                            <div key={ind} className="tab__box__preReq__list">
                              <div className="tab__box__preReq__name">
                                <div className="tab__box__preReq__dot"></div>
                                {cur.courseName}
                              </div>
                              <Button
                                sx={{
                                  color: "#00a0ad",
                                  borderColor: "#00a0ad",
                                  "&:hover": {
                                    backgroundColor: "#00a0ad",
                                    color: "#41424C",
                                    borderColor: "#00a0ad",
                                  },
                                  "&:active": { backgroundColor: "#00a0ad" },
                                }}
                                variant="text"
                                size="small"
                                component={Link}
                                to="/course"
                                state={{
                                  id: cur._id,
                                  backUrl:
                                    userType === "User"
                                      ? "/UserPanel/UserCourses"
                                      : userType === "Admin"
                                      ? "/admin/AllCourses"
                                      : "/",
                                }}
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  <div className="ViewCourse__heading__mob">Sections</div>
                  <Sections sections={courseData.courseContent} />
                </div>
              )}
            </>
          )}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Modal
            open={openFeedbackModal}
            onClose={handleCloseFeedbackModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="Feedback__modal">
              <div>
                <form onSubmit={submitFeedbackHandler}>
                  <h3 className="Feedback__heading">Feedback</h3>
                  <div className="Feedback__textfield__container">
                    <div className="Feedback__textfield">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Select User
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={enrolledUser?.name}
                          name="enrolledUser"
                          label="enrolledUser"
                          onChange={(e) => setEnrolledUser(e.target.value)}
                        >
                          {enrolledUserList?.map((item) => (
                            <MenuItem value={item}>{item.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="Feedback__textfield Feedback__ratings">
                      <Rating
                        name="ratings"
                        value={ratings}
                        onChange={(event, newValue) => {
                          setRatings(newValue);
                        }}
                        size="large"
                      />
                    </div>
                    <div className="Feedback__textfield  ">
                      <TextField
                        fullWidth
                        id="outlined"
                        label="Feedback"
                        variant="outlined"
                        name="feedback"
                        autoComplete={false}
                        value={feedback}
                        multiline
                        rows={4}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="Feedback__btn">
                    <Button
                      sx={{
                        color: "#00a0ad",
                        borderColor: "#00a0ad",
                        "&:hover": {
                          backgroundColor: "#00a0ad",
                          color: "#41424C",
                          borderColor: "#00a0ad",
                        },
                        "&:active": { backgroundColor: "#00a0ad" },
                      }}
                      variant="outlined"
                      size="small"
                      onClick={handleCloseFeedbackModal}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      sx={{
                        bgcolor: "#00a0ad",
                        color: "#41424C",
                        borderColor: "#41424C",
                        "&:hover": {
                          backgroundColor: "#41424C",
                          color: "#00a0ad",
                        },
                      }}
                      // loading={loading}
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>
        </>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default ViewCourse;
