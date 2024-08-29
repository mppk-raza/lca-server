import React, { useState, useEffect } from "react";
import "./AddCourse.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import Stepper from "@mui/material/Stepper";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import AddCourseTable from "../../../components/Admin/Course/AddCourseTable/AddCourseTable";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import validator from "validator";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const orangeTheme = createTheme({
  palette: { primary: { main: "#00a0ad" }, secondary: { main: "#41424C" } },
});

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const steps = ["Course details", "Course content", "Course availability"];

const AddCourse = () => {
  const theme = useTheme();

  const [OpenArr, setOpenArr] = React.useState([true]);
  const [OpenLessArr, setOpenLessArr] = React.useState([true]);
  const [loading, setLoading] = React.useState(false);
  const [prerequisites, setPrerequisites] = useState([]);
  const [prereqDropdownData, setPrereqDropdownData] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [countSec, setCountSec] = useState(1);

  const [countLess, setCountLess] = useState(1);
  const [forEmployees, setForEmployees] = useState(false);
  const [forExternals, setForExternals] = useState(true);
  const [step1Data, setStep1Data] = useState({
    name: "",
    instructorName: "",
    type: "",
    imgUrl: "",
    abstract: "",
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasCertificate: false,
  });
  const [quizTime, setQuizTime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });
  //console.log(prerequisites);
  const getprereqdropdown = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/getprereqdropdown",
        {
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        console.log(res);
        setPrereqDropdownData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getprereqdropdown();
  }, []);

  const step1HandleChange = (e) => {
    let { name, value } = e.target;
    setStep1Data({ ...step1Data, [name]: value });
  };
  const prerequisitesHandleChange = (e) => {
    const {
      target: { value },
    } = e;
    // let obj = JSON.parse(value);

    setPrerequisites(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  //console.log(prerequisites);
  const [sections, setSections] = useState([
    {
      sectionTitle: "",
      sectionAbstract: "",
      sectionLessons: [
        {
          lessonNumber: 1,
          lessonName: "",
          lessonVideo: "",
          lessonThumbnail: "",
          isQuiz: false,
          lessonQuiz: [],
        },
      ],
    },
  ]);

  const handleAddSections = (ind) => {
    setCountSec(countSec + 1);
    setSections([
      ...sections,
      {
        sectionTitle: "",
        sectionAbstract: "",
        sectionLessons: [
          {
            lessonNumber: 1,
            lessonName: "",
            lessonVideo: "",
            lessonThumbnail: "",
            isQuiz: false,
            lessonQuiz: [],
          },
        ],
      },
    ]);
    setOpenArr([...OpenArr, true]);
  };
  const handleDeleteSections = (ind) => {
    setCountSec(countSec - 1);
    const delSec = [...sections];
    delSec.splice(ind, 1);
    setSections(delSec);
    const delOpArr = [...OpenArr];
    delOpArr.splice(ind, 1);
    setOpenArr(delOpArr);
  };
  const handleAddLessons = (ind) => {
    setCountLess(countLess + 1);
    let temp_sections = [...sections];
    temp_sections[ind]["sectionLessons"].push({
      lessonNumber: temp_sections[ind]["sectionLessons"].length + 1,
      lessonName: "",
      lessonVideo: "",
      lessonThumbnail: "",
      isQuiz: false,
      lessonQuiz: [],
    });
    setSections(temp_sections);
    setOpenLessArr([...OpenLessArr, true]);
  };
  const handleDeleteLessons = (superind, subind, item) => {
    setCountLess(countLess - 1);
    let temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"].splice(subind, 1);
    setSections(temp_sections);
    const delOpArr = [...OpenLessArr];
    delOpArr.splice(subind, 1);
    setOpenLessArr(delOpArr);
  };
  //console.log(OpenLessArr);
  const handleAddQuiz = (superInd, subInd) => {
    let temp_sections = [...sections];
    temp_sections[superInd]["sectionLessons"][subInd]["lessonQuiz"].push({
      question: "",
      answerOptions: [{ option1: "", option2: "", option3: "", option4: "" }],
      correctAnswer: "",
      isDuringVideo: false,
      quizTime: "",
    });
    setSections(temp_sections);
  };
  const handleDeleteQuiz = (superind, subind, quizInd) => {
    let temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"].splice(
      quizInd,
      1
    );
    setSections(temp_sections);
  };
  const handleSectionChange = (e, ind, name) => {
    const secChange = [...sections];
    secChange[ind][name] = e.target.value;
    setSections(secChange);
  };
  const handleLessonChange = (e, superind, subind) => {
    let { name, value } = e.target;
    const temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind][name] = value;
    setSections(temp_sections);
  };
  const handleQuizSwitch = (e, superind, subind) => {
    let { name, checked } = e.target;
    const temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind][name] = checked;
    setSections(temp_sections);

    if (sections[superind]["sectionLessons"][subind]["isQuiz"] === true) {
      let temp_sections = [...sections];
      temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"].push({
        question: "",
        answerOptions: [{ option1: "", option2: "", option3: "", option4: "" }],
        correctAnswer: "",
        isDuringVideo: false,
        quizTime: "",
      });
      setSections(temp_sections);
    } else if (
      sections[superind]["sectionLessons"][subind]["isQuiz"] === false
    ) {
      let temp_sections = [...sections];
      temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"] = [];
      setSections(temp_sections);
    }
  };

  const handleQuizChange = (e, superind, subind, quizInd) => {
    let { name, value } = e.target;
    const temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
      name
    ] = value;
    setSections(temp_sections);
  };
  const handleQuizQAOptionsChange = (e, superind, subind, quizInd, opInd) => {
    let { name, value } = e.target;
    const temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
      "answerOptions"
    ][opInd][name] = value;
    setSections(temp_sections);
  };

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

  let courseData = {
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
    watchTime: combineWatchTime(),
    countSections: countSec,
    countLessons: countLess,
    availability: {
      employeeList: employeeList,
      forEmployees: forEmployees,
      forExternals: forExternals,
    },
    hasCertificate: step1Data.hasCertificate,
  };
  console.log("course data", courseData.watchTime);
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
      // console.log(courseData);

      setLoading(true);
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/api/courses/addNewCourse", {
          // .post("http://localhost:7000" + "/api/courses/addNewCourse", {
          token: localStorage.getItem("token"),
          course: courseData,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setPrerequisites([]);
            setActiveStep(0);
            setEmployeeList([]);
            setCountSec(1);

            setCountLess(1);
            setForEmployees(false);
            setForExternals(true);
            setStep1Data({
              name: "",
              instructorName: "",
              type: "",
              imgUrl: "",
              abstract: "",
              hours: 0,
              minutes: 0,
              seconds: 0,
              hasCertificate: false,
            });
            setSections([
              {
                sectionTitle: "",
                sectionAbstract: "",
                sectionLessons: [
                  {
                    lessonNumber: 1,
                    lessonName: "",
                    lessonVideo: "",
                    lessonThumbnail: "",
                    isQuiz: false,
                    lessonQuiz: [],
                  },
                ],
              },
            ]);
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

  const handleSwitchTimer = (e, superind, subind, quizInd) => {
    let { checked } = e.target;
    const temp_sections = [...sections];
    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
      "isDuringVideo"
    ] = checked;
    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
      "quizTime"
    ] = null;
    setSections(temp_sections);
  };

  const quizTimeHandler = (e, superind, subind, quizInd) => {
    let { name, value } = e.target;
    const temp_sections = [...sections];
    if (
      temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
        "isDuringVideo"
      ]
    ) {
      temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
        "quizTime"
      ] = `${name === "hour" ? value : quizTime.hour} hour(s) ${
        name === "minute" ? value : quizTime.minute
      } minute(s) ${name === "second" ? value : quizTime.second} second(s)`;
    }
    setSections(temp_sections);
  };
  return (
    <div className="AddCourse">
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
      <div className="AddCourse__steps__box">
        <div className="AddCourse__heading1">Add New Course</div>
        <Box sx={{ width: "85%", margin: "0 auto" }}>
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
        <>
          <div className="AddCourse__form__box">
            <form>
              <div className="AddCourse__textfield__container">
                <div className="AddCourse__textfield">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Name"
                    fullWidth
                    required
                    onKeyPress={(event) => {
                      if (/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    name="name"
                    value={step1Data.name}
                    onChange={step1HandleChange}
                  />
                </div>
                <div className="AddCourse__textfield">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Instructor Name"
                    fullWidth
                    required
                    onKeyPress={(event) => {
                      if (/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    name="instructorName"
                    value={step1Data.instructorName}
                    onChange={step1HandleChange}
                  />
                </div>
              </div>
              <div className="AddCourse__textfield__container">
                <div className="AddCourse__textfield watch_time">
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Watch Hours"
                    fullWidth
                    required
                    name="hours"
                    type="number"
                    value={step1Data.hours}
                    onChange={step1HandleChange}
                  />
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Watch Minutes"
                    fullWidth
                    required
                    type="number"
                    name="minutes"
                    defaultValue={step1Data?.minutes}
                    value={step1Data.minutes}
                    onChange={step1HandleChange}
                  />
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Watch Seconds"
                    fullWidth
                    type="number"
                    required
                    name="seconds"
                    value={step1Data.seconds}
                    onChange={step1HandleChange}
                  />
                </div>
                <div className="AddCourse__textfield">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={step1Data.type}
                      name="type"
                      label="Type"
                      onChange={step1HandleChange}
                    >
                      <MenuItem value={"All"}>All</MenuItem>
                      <MenuItem value={"TNA"}>TNA</MenuItem>
                      <MenuItem value={"SOP"}>SOP</MenuItem>
                      <MenuItem value={"Public Orientation"}>
                        Public Orientation
                      </MenuItem>
                      <MenuItem value={"Others"}>Others</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="AddCourse__textfield__container">
                <div className="AddCourse__textfield">
                  <TextField
                    sx={{ marginBottom: "20px" }}
                    id="outlined-basic"
                    variant="outlined"
                    label="Thumbnail/img URL"
                    fullWidth
                    required
                    name="imgUrl"
                    value={step1Data.imgUrl}
                    onChange={step1HandleChange}
                  />
                </div>
                <div className="AddCourse__textfield">
                  {/* HERE */}
                  <ThemeProvider theme={orangeTheme}>
                    <Switch
                      checked={step1Data.hasCertificate}
                      onChange={() => {
                        setStep1Data({
                          ...step1Data,
                          hasCertificate: !step1Data.hasCertificate,
                        });
                      }}
                    />
                    <span>
                      {step1Data.hasCertificate
                        ? "With Certificate"
                        : "No Certificate"}
                    </span>
                  </ThemeProvider>
                </div>
              </div>

              {/* <div className='AddCourse__textfield__container'>
                <TextField
                  sx={{ marginBottom: '20px' }}
                  id='outlined-basic'
                  variant='outlined'
                  label='Thumbnail/img URL'
                  fullWidth
                  required
                  name='imgUrl'
                  value={step1Data.imgUrl}
                  onChange={step1HandleChange}
                />
              </div> */}

              <div className="AddCourse__textfield__container">
                <TextField
                  sx={{ marginBottom: "20px" }}
                  id="outlined-multiline-static"
                  label="Abstract"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  name="abstract"
                  value={step1Data.abstract}
                  onChange={step1HandleChange}
                />
              </div>
              <div className="AddCourse__textfield__container">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-chip-label">
                    Prerequisites
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={prerequisites}
                    onChange={prerequisitesHandleChange}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Prerequisites"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value, ind) => {
                          let temp = JSON.parse(value);
                          return <Chip key={ind} label={temp.courseName} />;
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {prereqDropdownData?.map((name, ind) => (
                      <MenuItem
                        key={ind}
                        // value={name.courseName}
                        value={JSON.stringify({
                          _id: name._id,
                          courseName: name.courseName,
                          courseInstructor: name.courseInstructor,
                        })}
                        style={getStyles(name, prerequisites, theme)}
                      >
                        {name.courseName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </form>
          </div>
        </>
      ) : activeStep === 1 ? (
        <>
          <form>
            {sections?.map((cur, ind) => {
              return (
                <div
                  key={ind}
                  className={
                    OpenArr[ind] === false
                      ? "AddCourse__form__box__ex"
                      : "AddCourse__form__box"
                  }
                >
                  <div
                    className={
                      OpenArr[ind] === false
                        ? "AddCourse__heading__expnd__box__ex"
                        : "AddCourse__heading__expnd__box"
                    }
                  >
                    <div className="AddCourse__heading">Section {ind + 1}</div>
                    <div className="AddCourse__expand__btn">
                      <ExpandMore
                        expand={OpenArr[ind]}
                        onClick={() => {
                          const temp = [...OpenArr];
                          temp[ind] = !OpenArr[ind];
                          setOpenArr(temp);
                        }}
                        aria-expanded={OpenArr[ind]}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </div>
                  </div>
                  <Collapse in={OpenArr[ind]} timeout="auto" unmountOnExit>
                    <div className="AddCourse__textfield__container">
                      <TextField
                        sx={{ marginBottom: "20px" }}
                        id="outlined-basic"
                        variant="outlined"
                        label="Section Title"
                        fullWidth
                        required
                        name="sectionTitle"
                        value={sections[ind].sectionTitle}
                        onChange={(e) =>
                          handleSectionChange(e, ind, "sectionTitle")
                        }
                      />
                    </div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      label="Abstract"
                      multiline
                      rows={4}
                      fullWidth
                      required
                      name="sectionAbstract"
                      value={sections[ind].sectionAbstract}
                      onChange={(e) =>
                        handleSectionChange(e, ind, "sectionAbstract")
                      }
                    />
                    {cur.sectionLessons?.map((cur, subind) => {
                      return (
                        <div
                          key={subind}
                          className={
                            OpenLessArr[subind] === false
                              ? "AddCourse__sec__box__exp"
                              : "AddCourse__sec__box"
                          }
                        >
                          <div
                            className={
                              OpenLessArr[subind] === false
                                ? "AddCourse__heading__expnd__box__ex"
                                : "AddCourse__heading__expnd__box"
                            }
                          >
                            <div className="AddCourse__heading">
                              Lesson {subind + 1}
                            </div>
                            <div className="AddCourse__expand__btn">
                              <ExpandMore
                                expand={OpenLessArr[subind]}
                                onClick={() => {
                                  const temp = [...OpenLessArr];
                                  temp[subind] = !OpenLessArr[subind];
                                  setOpenLessArr(temp);
                                }}
                                aria-expanded={OpenLessArr[subind]}
                                aria-label="show more"
                              >
                                <ExpandMoreIcon />
                              </ExpandMore>
                            </div>
                          </div>
                          <Collapse
                            in={OpenLessArr[subind]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="AddCourse__textfield__container">
                              <div className="AddCourse__textfield">
                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  label="Lesson Name"
                                  fullWidth
                                  required
                                  value={cur.lessonName}
                                  name="lessonName"
                                  onChange={(e) => {
                                    handleLessonChange(e, ind, subind);
                                  }}
                                />
                              </div>
                              {/* <div className="AddCourse__textfield">
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              label="Lesson Number"
                              fullWidth
                              required
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              value={cur.lessonNumber}
                              name="lessonNumber"
                              onChange={(e) => {
                                handleLessonChange(e, ind, subind);
                              }}
                              disabled
                            />
                          </div> */}
                              <div className="AddCourse__textfield">
                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  label="Lesson Video URL"
                                  fullWidth
                                  required
                                  value={cur.lessonVideo}
                                  name="lessonVideo"
                                  onChange={(e) => {
                                    handleLessonChange(e, ind, subind);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="AddCourse__textfield__container">
                              <TextField
                                sx={{ margin: "0 0 20px 0" }}
                                id="outlined-basic"
                                variant="outlined"
                                label="Lesson Thumbnail URL"
                                fullWidth
                                required
                                value={cur.lessonThumbnail}
                                name="lessonThumbnail"
                                onChange={(e) => {
                                  handleLessonChange(e, ind, subind);
                                }}
                              />
                            </div>
                            <div>
                              <FormGroup sx={{ margin: "0 0 20px 0" }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={cur.isQuiz}
                                      name="isQuiz"
                                      onChange={(e) =>
                                        handleQuizSwitch(e, ind, subind)
                                      }
                                    />
                                  }
                                  label="Quiz"
                                />
                              </FormGroup>
                            </div>
                            {cur.lessonQuiz.map((curQuiz, quizInd) => {
                              let hours = 0;
                              let minutes = 0;
                              let seconds = 0;
                              if (curQuiz?.isDuringVideo) {
                                const time = curQuiz?.quizTime;
                                const durationRegex = new RegExp(
                                  /(?:(\d+) hour\(s\)\s*)?(?:(\d+) minute\(s\)\s*)?(?:(\d+) second\(s\))?/
                                );
                                const match = time?.match(durationRegex);
                                if (match) {
                                  [, hours, minutes, seconds] =
                                    match?.map(Number);
                                }
                              }
                              return (
                                <>
                                  {cur.isQuiz ? (
                                    <div
                                      key={quizInd}
                                      className="AddCourse__sec__box"
                                    >
                                      <div className="AddCourse__heading">
                                        <h3>Question {quizInd + 1}</h3>
                                      </div>
                                      <div>
                                        <TextField
                                          sx={{ marginBottom: "20px" }}
                                          id="outlined-basic"
                                          variant="outlined"
                                          label="Question"
                                          fullWidth
                                          required
                                          name="question"
                                          value={curQuiz.question}
                                          onChange={(e) => {
                                            handleQuizChange(
                                              e,
                                              ind,
                                              subind,
                                              quizInd
                                            );
                                          }}
                                        />
                                      </div>
                                      {curQuiz.answerOptions.map(
                                        (curOpt, optInd) => {
                                          return (
                                            <div key={optInd}>
                                              <div className="AddCourse__textfield__container">
                                                <div className="AddCourse__textfield">
                                                  <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label="Option 1"
                                                    fullWidth
                                                    required
                                                    name="option1"
                                                    value={curOpt.option1}
                                                    onChange={(e) => {
                                                      handleQuizQAOptionsChange(
                                                        e,
                                                        ind,
                                                        subind,
                                                        quizInd,
                                                        optInd
                                                      );
                                                    }}
                                                  />
                                                </div>
                                                <div className="AddCourse__textfield">
                                                  <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label="Option 2"
                                                    fullWidth
                                                    required
                                                    name="option2"
                                                    value={curOpt.option2}
                                                    onChange={(e) => {
                                                      handleQuizQAOptionsChange(
                                                        e,
                                                        ind,
                                                        subind,
                                                        quizInd,
                                                        optInd
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                              <div className="AddCourse__textfield__container">
                                                <div className="AddCourse__textfield">
                                                  <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label="Option 3"
                                                    fullWidth
                                                    name="option3"
                                                    value={curOpt.option3}
                                                    onChange={(e) => {
                                                      handleQuizQAOptionsChange(
                                                        e,
                                                        ind,
                                                        subind,
                                                        quizInd,
                                                        optInd
                                                      );
                                                    }}
                                                  />
                                                </div>
                                                <div className="AddCourse__textfield">
                                                  <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label="Option 4"
                                                    fullWidth
                                                    name="option4"
                                                    value={curOpt.option4}
                                                    onChange={(e) => {
                                                      handleQuizQAOptionsChange(
                                                        e,
                                                        ind,
                                                        subind,
                                                        quizInd,
                                                        optInd
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}

                                      <div className="AddCourse__textfield__container">
                                        <div className="AddCourse__textfield">
                                          <TextField
                                            sx={{ marginBottom: "20px" }}
                                            id="outlined-basic"
                                            variant="outlined"
                                            label="Correct Answer"
                                            fullWidth
                                            required
                                            name="correctAnswer"
                                            value={curQuiz.correctAnswer}
                                            onChange={(e) => {
                                              handleQuizChange(
                                                e,
                                                ind,
                                                subind,
                                                quizInd
                                              );
                                            }}
                                          />
                                        </div>
                                        <div className="AddCourse__textfield watch_time">
                                          <FormControlLabel
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                            }}
                                            control={
                                              <Switch
                                                checked={curQuiz.isDuringVideo}
                                                name="isDuringVideo"
                                                onChange={(e) =>
                                                  handleSwitchTimer(
                                                    e,
                                                    ind,
                                                    subind,
                                                    quizInd
                                                  )
                                                }
                                              />
                                            }
                                            label="During Video"
                                          />

                                          {curQuiz?.isDuringVideo && (
                                            <>
                                              <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                label="Watch Hours"
                                                fullWidth
                                                required
                                                name="hour"
                                                type="number"
                                                value={hours}
                                                onChange={(e) => {
                                                  setQuizTime((prev) => ({
                                                    ...prev,
                                                    hour: e.target.value,
                                                  }));
                                                  quizTimeHandler(
                                                    e,
                                                    ind,
                                                    subind,
                                                    quizInd
                                                  );
                                                }}
                                              />
                                              <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                label="Watch Minutes"
                                                fullWidth
                                                required
                                                type="number"
                                                name="minute"
                                                value={minutes}
                                                onChange={(e) => {
                                                  setQuizTime((prev) => ({
                                                    ...prev,
                                                    minute: e.target.value,
                                                  }));
                                                  quizTimeHandler(
                                                    e,
                                                    ind,
                                                    subind,
                                                    quizInd
                                                  );
                                                }}
                                              />
                                              <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                label="Watch Seconds"
                                                fullWidth
                                                type="number"
                                                required
                                                name="second"
                                                value={seconds}
                                                onChange={(e) => {
                                                  setQuizTime((prev) => ({
                                                    ...prev,
                                                    second: e.target.value,
                                                  }));
                                                  quizTimeHandler(
                                                    e,
                                                    ind,
                                                    subind,
                                                    quizInd
                                                  );
                                                }}
                                              />
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div className="AddCourse__quiz__btn">
                                        <Button
                                          endIcon={<DeleteIcon />}
                                          color="error"
                                          variant="contained"
                                          onClick={() =>
                                            handleDeleteQuiz(
                                              ind,
                                              subind,
                                              quizInd
                                            )
                                          }
                                          fullWidth
                                        >
                                          Remove Question
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null}
                                </>
                              );
                            })}

                            <div className="AddCourse__btn__box">
                              {cur.isQuiz ? (
                                <Button
                                  endIcon={<AddIcon />}
                                  variant="contained"
                                  onClick={() => handleAddQuiz(ind, subind)}
                                >
                                  Add Question
                                </Button>
                              ) : null}

                              <div>
                                {subind > 0 ? (
                                  <Button
                                    endIcon={<DeleteIcon />}
                                    color="error"
                                    variant="contained"
                                    onClick={() =>
                                      handleDeleteLessons(ind, subind, cur)
                                    }
                                  >
                                    Remove Lesson
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      );
                    })}
                    <div className="AddCourse__btn__box">
                      <Button
                        endIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => handleAddLessons(ind, "sectionLessons")}
                      >
                        Add Lessons
                      </Button>
                      <div>
                        {sections.length > 1 ? (
                          <Button
                            endIcon={<DeleteIcon />}
                            color="error"
                            variant="contained"
                            onClick={() => handleDeleteSections(ind)}
                          >
                            Remove Section
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Collapse>
                </div>
              );
            })}
            <div className="addSection__btn_box">
              <Button
                endIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  handleAddSections();
                }}
              >
                Add Section
              </Button>
            </div>
          </form>
        </>
      ) : activeStep === 2 ? (
        <>
          <div className="addCourse__forEmployees__external__box">
            <Box sx={{ minWidth: "30%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  For Employees
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={forEmployees}
                  label="For Employees"
                  onChange={(e) => setForEmployees(e.target.value)}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: "30%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  For Externals
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  displayEmpty
                  value={forExternals}
                  label="For Externals"
                  onChange={(e) => setForExternals(e.target.value)}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  {forEmployees ? <MenuItem value={false}>No</MenuItem> : null}
                </Select>
              </FormControl>
            </Box>
          </div>
          <AddCourseTable
            employeeList={employeeList}
            setEmployeeList={setEmployeeList}
            forEmployees={forEmployees}
          />
        </>
      ) : null}
      <Box sx={{ width: "85%", margin: "20px auto" }}>
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
                  sx={{
                    bgcolor: "#00a0ad",
                    color: "#41424C",
                    borderColor: "#41424C",
                    "&:hover": {
                      backgroundColor: "#41424C",
                      color: "#00a0ad",
                    },
                  }}
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
    </div>
  );
};

export default AddCourse;
