import React, { useState, useEffect, useMemo } from "react";
import "./EditCourse.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import validator from "validator";
import Step1 from "../../../components/Admin/EditCoures/Step1/Step1";
import Step2 from "../../../components/Admin/EditCoures/Step2/Step2";
import Step3 from "../../../components/Admin/EditCoures/Step3/Step3";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const steps = ["Course details", "Course content", "Course availability"];

const EditCourse = ({ courseData }) => {
  const orangeTheme = createTheme({
    palette: {
      primary: {
        main: "#00a0ad",
      },
      secondary: {
        main: "#41424C",
      },
    },
  });
  const theme = useTheme();
  const navigate = useNavigate();
  const [OpenArr, setOpenArr] = React.useState([true]);
  const [OpenLessArr, setOpenLessArr] = React.useState([true]);
  const [loading, setLoading] = React.useState(false);
  let preReq = courseData.prerequisites.map((cur) => {
    let temp = JSON.stringify(cur);
    return temp;
  });
  const [prerequisites, setPrerequisites] = useState(preReq);
  const [prereqDropdownData, setPrereqDropdownData] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [employeeList, setEmployeeList] = useState(
    courseData.availability.employeeList
  );
  const [countSec, setCountSec] = useState(1);

  const [countLess, setCountLess] = useState(1);
  const [forEmployees, setForEmployees] = useState(
    courseData.availability.forEmployees
  );
  const [forExternals, setForExternals] = useState(
    courseData.availability.forExternals
  );
  const watchTime = courseData.courseStats.watchTime;
  const durationRegex = new RegExp(
    /(?:(\d+) hour\(s\)\s*)?(?:(\d+) minute\(s\)\s*)?(?:(\d+) second\(s\))?/
  );
  const match = watchTime.match(durationRegex);
  console.log(match);
  let [, hours, minutes, seconds] = match.map(Number);
  if (match) {
    hours = hours || 0;
    minutes = minutes || 0;
    seconds = seconds || 0;
  }

  const [step1Data, setStep1Data] = useState({
    name: courseData.courseName,
    instructorName: courseData.courseInstructor,
    type: courseData.courseType,
    imgUrl: courseData.courseThumbnail,
    abstract: courseData.courseAbstract,
    hasCertificate: courseData.hasCertificate,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  });

  const [sections, setSections] = useState(courseData.courseContent);
  const getprereqdropdown = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/getprereqdropdown",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        //console.log(res);
        setPrereqDropdownData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getprereqdropdown();
  }, []);

  const combineWatchTime = () => {
    const { hours, minutes, seconds } = step1Data;
    let hour = "";
    let minute = "";
    let second = "";
    if (hours > 0) {
      hour = `${hours} hour(s) `;
    }
    if (minutes > 0) {
      minute = `${minutes} minute(s) `;
    }
    if (seconds > 0) {
      second = `${seconds} second(s)`;
    }
    return (`${hour}${minute}${second}`).trim();
  };
  const calculation = useMemo(() => combineWatchTime(), []);

  let courseUpdateData = {
    _id: courseData._id,
    courseName: step1Data.name,
    courseInstructor: step1Data.instructorName,
    courseThumbnail: step1Data.imgUrl,
    courseType: step1Data.type,
    prerequisites: prerequisites.map((cur) => {
      let temp = JSON.parse(cur);
      return temp;
    }),
    courseAbstract: step1Data.abstract,
    courseContent: sections,
    courseStats: {
      watchTime: combineWatchTime(),
      countSections: countSec,
      countLessons: countLess,
    },
    availability: {
      employeeList: employeeList,
      forEmployees: forEmployees,
      forExternals: forExternals,
    },
    hasCertificate: step1Data.hasCertificate,
  };
  const sectionValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var i = 0; i < sections.length; i++) {
        if (
          sections[i].sectionTitle === "" ||
          sections[i].sectionAbstract === ""
        ) {
          return false;
        }
      }
      return true;
    } else return false;
  };
  const lessonValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var s = 0; s < sections.length; s++) {
        if (
          sections[s]["sectionLessons"] &&
          sections[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < sections[s]["sectionLessons"].length; l++) {
            if (
              sections[s]["sectionLessons"][l]["lessonName"] === "" ||
              sections[s]["sectionLessons"][l]["lessonNumber"] === "" ||
              sections[s]["sectionLessons"][l]["lessonVideo"] === "" ||
              sections[s]["sectionLessons"][l]["lessonThumbnail"] === ""
            ) {
              return false;
            }
          }
        } else return true;
      }
      return true;
    } else return false;
  };
  const lessonVideoUrlValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var s = 0; s < sections.length; s++) {
        if (
          sections[s]["sectionLessons"] &&
          sections[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < sections[s]["sectionLessons"].length; l++) {
            if (
              !validator.isURL(sections[s]["sectionLessons"][l]["lessonVideo"])
            ) {
              return false;
            }
          }
        } else return true;
      }
      return true;
    } else return false;
  };
  const lessonThumbnailUrlValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var s = 0; s < sections.length; s++) {
        if (
          sections[s]["sectionLessons"] &&
          sections[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < sections[s]["sectionLessons"].length; l++) {
            if (
              !validator.isURL(
                sections[s]["sectionLessons"][l]["lessonThumbnail"]
              )
            ) {
              return false;
            }
          }
        } else return true;
      }
      return true;
    } else return false;
  };
  const quizValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var s = 0; s < sections.length; s++) {
        if (
          sections[s]["sectionLessons"] &&
          sections[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < sections[s]["sectionLessons"].length; l++) {
            if (
              sections[s]["sectionLessons"][l]["lessonQuiz"] &&
              sections[s]["sectionLessons"][l]["lessonQuiz"].length > 0
            ) {
              for (
                var q = 0;
                q < sections[s]["sectionLessons"][l]["lessonQuiz"].length;
                q++
              ) {
                if (
                  sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                    "question"
                  ] === "" ||
                  sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                    "correctAnswer"
                  ] === ""
                ) {
                  return false;
                }
              }
            } else return true;
          }
        } else return true;
      }
      return true;
    } else return false;
  };
  const quizOptionValidation = (sections) => {
    if (sections && sections.length > 0) {
      for (var s = 0; s < sections.length; s++) {
        if (
          sections[s]["sectionLessons"] &&
          sections[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < sections[s]["sectionLessons"].length; l++) {
            if (
              sections[s]["sectionLessons"][l]["lessonQuiz"] &&
              sections[s]["sectionLessons"][l]["lessonQuiz"].length > 0
            ) {
              for (
                var q = 0;
                q < sections[s]["sectionLessons"][l]["lessonQuiz"].length;
                q++
              ) {
                if (
                  sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                    "answerOptions"
                  ] &&
                  sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                    "answerOptions"
                  ].length > 0
                ) {
                  for (
                    var qO = 0;
                    qO <
                    sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                      "answerOptions"
                    ].length;
                    qO++
                  ) {
                    if (
                      sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                        "answerOptions"
                      ][qO]["option1"] === "" ||
                      sections[s]["sectionLessons"][l]["lessonQuiz"][q][
                        "answerOptions"
                      ][qO]["option2"] === ""
                    ) {
                      return false;
                    }
                  }
                } else return true;
              }
            } else return true;
          }
        } else return true;
      }
      return true;
    } else return false;
  };

  const timeTester = (watchTime) => {
    const durationRegex = new RegExp(
      /(?:(\d+) hour\(s\)\s*)?(?:(\d+) minute\(s\)\s*)?(?:(\d+) second\(s\))?/
    );
    const match = watchTime.match(durationRegex);
    const arr = [];
    if (match) {
      match?.map((item) => arr.push(item === undefined ? 0 : parseInt(item)));
    }
    arr.shift();
    return arr;
  };

  const quizTimeValidator = (section) => {
    if (section && section.length > 0) {
      for (var s = 0; s < section.length; s++) {
        if (
          section[s]["sectionLessons"] &&
          section[s]["sectionLessons"].length > 0
        ) {
          for (var l = 0; l < section[s]["sectionLessons"].length; l++) {
            if (
              section[s]["sectionLessons"][l]["lessonQuiz"] &&
              section[s]["sectionLessons"][l]["lessonQuiz"].length > 0
            ) {
              for (
                var m = 0;
                m < section[l]["sectionLessons"][l]["lessonQuiz"].length;
                m++
              ) {
                if (
                  section[s]["sectionLessons"][l]["lessonQuiz"][m][
                    "quizTime"
                  ] !== undefined
                ) {
                  for (var n = 0; n < 3; n++) {
                    if (
                      timeTester(
                        section[s]["sectionLessons"][l]["lessonQuiz"][m][
                          "quizTime"
                        ]
                      )[n] > timeTester(watchTime)[n]
                    ) {
                      console.log("failed");
                      return false;
                    }
                  }
                }
              }
            }
          }
        } else return true;
      }
      return true;
    } else return false;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        !step1Data.abstract ||
        !step1Data.imgUrl ||
        !step1Data.instructorName ||
        !step1Data.name ||
        !step1Data.type ||
        ((step1Data?.hours === 0 || step1Data.hours === "") &&
          (step1Data?.minutes === 0 || step1Data.minutes === "") &&
          (step1Data?.seconds === 0 || step1Data.seconds === ""))
      ) {
        toast.warn("Please fill the data");
      } else if (!validator.isURL(step1Data.imgUrl)) {
        toast.warn("Please enter valid URL");
      } else {
        setActiveStep(activeStep + 1);
      }
    } else if (activeStep === 1) {
      console.log("inside next handler", quizTimeValidator(sections));
      if (!sectionValidation(sections)) {
        toast.warn("Please fill the section data");
      } else if (!lessonValidation(sections)) {
        toast.warn("Please fill the lesson's data");
      } else if (!lessonVideoUrlValidation(sections)) {
        toast.warn("Please enter valid lesson's video URL");
      } else if (!lessonThumbnailUrlValidation(sections)) {
        toast.warn("Please enter valid lesson's thumbnail URL");
      } else if (!quizValidation(sections)) {
        toast.warn("Please fill the quiz data");
      } else if (!quizOptionValidation(sections)) {
        toast.warn("Please fill the quiz answers options data");
      } else if (!quizTimeValidator(sections)) {
        console.log("inside next greater");
        toast.warn(`Quiz Time is not greater than watch time ${calculation}`);
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    if (forEmployees === false) {
      setForExternals(true);
    }
  }, [forEmployees]);

  const handleSubmit = (e) => {
    if (forEmployees === true && employeeList.length < 1) {
      toast.warn("Please select employee");
    } else if (forEmployees === false && forExternals === false)
      toast.warn(
        "Both employee and external can't be empty. Please select at least one between them"
      );
    else {
      //console.log(courseUpdateData);

      setLoading(true);
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/api/courses/editCourse", {
          token: localStorage.getItem("token"),
          course: courseUpdateData,
        })
        .then((res) => {
          //console.log(res);
          setLoading(false);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setActiveStep(0);
            setTimeout(() => {
              navigate("/admin/AllCourses");
            }, 5000);
          } else {
            toast.warn(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  //console.log(courseUpdateData);

  return (
    <div className="EditCourse">
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
      <ThemeProvider theme={orangeTheme}>
        <div className="AddCourse__steps__box">
          <div className="AddCourse__heading1">Edit Course</div>
          <Box sx={{ width: "95.5%", margin: "0 auto" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step
                    key={label}
                    {...stepProps}
                    sx={{
                      "& .MuiStepLabel-root .Mui-completed": {
                        color: "#198754 ", // circle color (COMPLETED)
                      },
                      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                        {
                          color: "#41424C", // Just text label (COMPLETED)
                        },
                      "& .MuiStepLabel-root .Mui-active": {
                        color: "#00a0ad", // circle color (ACTIVE)
                      },
                      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                        {
                          color: "common.white", // Just text label (ACTIVE)
                        },
                      "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                        fill: "black", // circle's number (ACTIVE)
                      },
                    }}
                  >
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography
                  sx={{ mt: 2, mb: 1, p: "0 10px", textAlign: "center" }}
                >
                  Step {activeStep + 1}
                </Typography>
              </React.Fragment>
            )}
          </Box>
        </div>
        {activeStep === 0 ? (
          <Step1
            step1Data={step1Data}
            setStep1Data={setStep1Data}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            prereqDropdownData={prereqDropdownData}
          />
        ) : activeStep === 1 ? (
          <Step2
            sections={sections}
            setSections={setSections}
            watchTime={calculation}
            OpenArr={OpenArr}
            setOpenArr={setOpenArr}
            OpenLessArr={OpenLessArr}
            setOpenLessArr={setOpenLessArr}
            countLess={countLess}
            setCountLess={setCountLess}
            countSec={countSec}
            setCountSec={setCountSec}
          />
        ) : activeStep === 2 ? (
          <Step3
            forEmployees={forEmployees}
            setForEmployees={setForEmployees}
            forExternals={forExternals}
            setForExternals={setForExternals}
            employeeList={employeeList}
            setEmployeeList={setEmployeeList}
          />
        ) : null}
        <Box sx={{ width: "95%", margin: "20px auto" }}>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  startIcon={<ArrowBackIosNewIcon />}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep === steps.length - 1 ? (
                  <Button
                    color="inherit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    variant="contained"
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Box>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </ThemeProvider>
    </div>
  );
};

export default EditCourse;
