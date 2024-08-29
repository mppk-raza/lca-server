import React, { useState, useEffect, useRef } from "react";
import "./UserCoursePlayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CourseSections from "../../../components/UserPanel/UserCoursePlayer/CourseSections/CourseSections";
import CourseLesson from "../../../components/UserPanel/UserCoursePlayer/CourseLesson/CourseLesson";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LoadingButton from "@mui/lab/LoadingButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormLabel from "@mui/material/FormLabel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Replay5Icon from "@mui/icons-material/Replay5";
import Replay10Icon from "@mui/icons-material/Replay10";
import Replay30Icon from "@mui/icons-material/Replay30";
import Forward10Icon from "@mui/icons-material/Forward10";
import TextField from "@mui/material/TextField";
import axios from "axios";
import LongText from "../../../components/LongText/LongText";
import { Rating } from "@mui/material";
import ReactToPrint from "react-to-print";
import { PDFToPrint } from "../../Course/PDFToPrint";

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
// let questionsArr = [];

const UserCoursePlayer = () => {
  const videoRef = useRef();
  const PDFRef = useRef();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  let { state } = useLocation();
  let navigate = useNavigate();
  const [courseData, setCourseData] = useState();
  const [enrollCourseData, setEnrollCourseData] = useState();

  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [quizBtn, setQuizBtn] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pause, setPause] = useState(false);

  const [firstTime, setFirstTime] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  const [quizValue, setQuizValue] = useState([]);
  const [quizResult, setQuizResult] = useState();
  const [score, setScore] = useState();
  const [maxScore, setMaxScore] = useState();
  const [grade, setGrade] = useState();
  const [ratings, setRatings] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completedData, setCompletedData] = useState(null);
  const [rated, setRated] = useState(false);
  const [timerRun, setTimerRun] = useState(false);

  const [minute, setMinute] = useState(null);
  const [second, setSecond] = useState(null);

  const [indQuiz, setIndQuiz] = useState(null);

  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }
  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  const openFullScreen = () => {
    setFullScreen(!fullScreen);
    const elem = videoRef.current;
    if (fullScreen === true) {
      if (elem.requestExitFullscreen) {
        elem.requestExitFullscreen();
      } else if (elem.mozCancelFullscreen) {
        elem.mozCancelFullscreen();
      } else if (elem.webkitExitFullscreen) {
        elem.webkitExitFullscreen();
      } else if (elem.exitFullscreen) {
        elem.exitFullscreen();
      }
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  };

  const handleBackward = (sec) => {
    if (videoRef.current) {
      videoRef.current.currentTime -= sec; // Backward 10 seconds
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleForward = (sec) => {
    if (videoRef.current) {
      videoRef.current.currentTime += sec; // Forward 10 seconds
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleQuizChange = (e, ind, cur) => {
    if (cur?.isDuringVideo) {
      setIndQuiz({ value: e.target.value, question: cur });
    }
    setQuizValue((prev) =>
      prev.filter((item) => item?.question !== cur.question)
    );
    setQuizValue((prev) => [
      ...prev,
      {
        question: cur?.question,
        correctAnswer: cur?.correctAnswer,
        myAnswer: e.target.value,
      },
    ]);
  };
  const handleQuizSubmit = () => {
    if (
      quizValue?.length <
      courseData?.courseContent[sectionIndex].sectionLessons[lessonIndex]
        .lessonQuiz.length
    ) {
      toast.warn("Please Solve all Questions");
    } else {
      let ans = quizValue.filter(
        (item) => item.correctAnswer === item?.myAnswer
      );
      setMaxScore(quizValue.length);
      setScore(ans.length);
      let per = (ans.length / quizValue.length) * 100;
      setQuizResult(per);
      setLoadingBtn(true);
      let scoreBody = {
        token: localStorage.getItem("token"),
        enrollmentID: enrollCourseData._id,
        score: ans.length,
        maxScore:
          !enrollCourseData.completed &&
          sectionIndex >= enrollCourseData.sectionIndex &&
          lessonIndex >= enrollCourseData.lessonIndex
            ? ans.length
            : 0,
      };
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/enrollment/score",
          scoreBody
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            if (res.data.data.completed) {
              setCompletedData(res.data.data);
              setRatings(res?.data?.data?.rating);
              setFeedback(res?.data?.data?.feedback);
              setCompleted(true);
              setRated(true);
            }
            setLoadingBtn(false);
            setOpenResult(true);
          } else {
            toast.warn(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingBtn(false);
        });
      setNextBtn(true);
    }
  };

  const getSingleEnrolled = () => {
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/enrollment/getSingleEnrolled",
        { token: localStorage.getItem("token"), courseID: state.id }
      )
      .then((res) => {
        //console.log(res);
        setCourseData(res.data.course);
        setEnrollCourseData(res.data.data);
        setSecond(res.data.data.second ? res.data.data.second : 0);
        setMinute(res.data.data.minute ? res.data.data.minute : 0);
        setSectionIndex(res.data.data.sectionIndex);
        setLessonIndex(res.data.data.lessonIndex);
        setLoading(false);
        setPlaying(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleEnrolled();
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getGrade = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/enrollment/getGrade", {
        token: localStorage.getItem("token"),
        enrollmentID: enrollCourseData?._id,
      })
      .then((res) => {
        //console.log(res);
        setGrade(res.data.grade);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getGrade();
  }, [enrollCourseData, maxScore]);

  const handleLessonComplete = () => {
    let secInd = sectionIndex;
    let lessInd = lessonIndex;
    setLoadingBtn(true);
    if (
      lessonIndex + 1 <
      courseData.courseContent[sectionIndex].sectionLessons.length
    ) {
      lessInd = lessInd + 1;
    } else if (
      lessonIndex + 1 ===
      courseData.courseContent[sectionIndex].sectionLessons.length
    ) {
      if (sectionIndex + 1 < courseData.courseContent.length) {
        secInd = secInd + 1;
        lessInd = 0;
      } else if (sectionIndex + 1 === courseData.courseContent.length) {
        secInd = sectionIndex;
      }
    }
    let body = {
      token: localStorage.getItem("token"),
      enrollmentID: enrollCourseData._id,
      sectionIndex: secInd,
      lessonIndex: lessInd,
    };
    // console.log(body);

    sectionIndex + 1 >= courseData.courseContent.length &&
    lessonIndex + 1 >=
      courseData.courseContent[sectionIndex].sectionLessons.length
      ? axios
          .post(
            process.env.REACT_APP_BACKEND_URL +
              "/api/enrollment/markAsCompleted",

            {
              token: localStorage.getItem("token"),
              enrollmentID: enrollCourseData._id,
              rating: ratings,
              feedback,
            }
          )
          .then((res) => {
            //console.log(res);

            if (res.data.error === false) {
              // setCourseData(res.data.course);
              toast.success(res.data.message);
              setLoadingBtn(false);
              setPlaying(false);
              setQuizBtn(false);
              setNextBtn(false);
              setOpen(false);
              setRatings(0);
              setRated(false);
              setFeedback("");
            } else {
              toast.warn(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
      : axios
          .post(
            process.env.REACT_APP_BACKEND_URL +
              "/api/enrollment/updateProgress",
            body
          )
          .then((res) => {
            //console.log(res);
            if (res.data.error === false) {
              toast.success(res.data.message);
              setEnrollCourseData(res.data.data);
              setSectionIndex(res.data.data.sectionIndex);
              setLessonIndex(res.data.data.lessonIndex);
              setLoadingBtn(false);
              setPlaying(false);
              setQuizBtn(false);
              setNextBtn(false);
              setOpen(false);
            } else {
              setLoadingBtn(false);
              toast.warn(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setLoadingBtn(false);
          });
  };

  const TIMER = 10000;
  const TIMERC = 1000;
  useEffect(() => {
    const intervalC = setInterval(() => {
      let video = document.getElementById("mnp_video_player");
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    }, TIMERC);

    const interval = setInterval(() => {
      let video = document.getElementById("mnp_video_player");
      let min = Math.floor(video.currentTime / 60);
      let sec = Math.floor(video.currentTime - min * 60);
      setMinute(min);
      setSecond(sec);
    }, TIMER);

    return () => {
      clearInterval(interval);
      clearInterval(intervalC);
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    if (firstTime && document.getElementById("mnp_video_player")) {
      document.getElementById("mnp_video_player").currentTime =
        minute !== null && second !== null ? minute * 60 + second : 0;
      setFirstTime(false);
    }
    if (
      second !== null &&
      minute !== null &&
      localStorage.getItem("token") &&
      enrollCourseData &&
      enrollCourseData._id
    ) {
      let LINK =
        process.env.REACT_APP_BACKEND_URL +
        "/api/enrollment/updateTime?minute=" +
        minute +
        "&second=" +
        second +
        "&token=" +
        localStorage.getItem("token") +
        "&enrollmentID=" +
        enrollCourseData._id;
      axios
        .get(LINK)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }, [second, minute]);

  const [questionsArr, setQuestionsArr] = useState([]);
  const [indQuizToggler, setIndQuizToggler] = useState(false);

  useEffect(() => {
    let questionArr;
    if (videoRef?.current?.duration === currentTime) {
      questionArr = courseData?.courseContent[sectionIndex]?.sectionLessons[
        lessonIndex
      ].lessonQuiz.filter((item) => !item.isDuringVideo);
    } else {
      questionArr = courseData?.courseContent[sectionIndex]?.sectionLessons[
        lessonIndex
      ].lessonQuiz.filter((item) => item.isDuringVideo && test(item?.quizTime));
      if (questionArr?.length) {
        setIndQuizToggler(true);
      }
    }

    if (questionArr?.length) {
      const filteredArr = questionArr?.filter(
        (item) =>
          !quizValue.some(
            (ele) =>
              ele.question === item.question &&
              item.correctAnswer === ele.myAnswer
          )
      );
      if (filteredArr?.length) {
        setQuestionsArr(filteredArr);
        setOpen(true);
        setPlaying(false);
        setPause(true);
        videoRef.current.pause();
      }
    }
  }, [currentTime]);

  useEffect(() => {
    setTimeout(() => {
      setTimerRun(true);
    }, 5000);
  }, []);

  const test = (time) => {
    const durationRegex = new RegExp(
      /(?:(\d+) hour\(s\)\s*)?(?:(\d+) minute\(s\)\s*)?(?:(\d+) second\(s\))?/
    );
    const match = time?.match(durationRegex);
    const arr = [];
    if (match) {
      match?.map((item) => arr.push(item === undefined ? 0 : parseInt(item)));
    }
    arr.shift();
    const updatedTime = formatTime(arr[0] * 3600 + arr[1] * 60 + arr[2]);
    if (updatedTime === formatTime(currentTime)) {
      return true;
    } else {
      return false;
    }
  };

  const handleIndQuizSubmit = () => {
    if (indQuiz?.value === indQuiz?.question.correctAnswer) {
      handleForward(1);
    } else {
      handleBackward(10);
    }
    indQuizHandler();
    setIndQuiz(null);
    setIndQuizToggler(false);
  };
  const indQuizHandler = () => {
    setOpen(false);
    setPlaying(true);
    setPause(false);
    if (videoRef) {
      videoRef.current.play();
    }
  };

  return (
    <>
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
      {!loading ? (
        <div className="UserCoursePlayer">
          {windowDimensions.width <= 550 ? (
            <div className="UserCoursePlayer__videoPlayer__box__mob">
              <div
                className="UserCoursePlayer__videoPlayer__box"
                onMouseEnter={() => setPause(true)}
                onMouseLeave={() => setPause(false)}
                onDoubleClick={openFullScreen}
              >
                <video
                  src={
                    courseData?.courseContent[sectionIndex]?.sectionLessons[
                      lessonIndex
                    ].lessonVideo
                  }
                  onEnded={() => {
                    if (
                      courseData.courseContent[sectionIndex].sectionLessons[
                        lessonIndex
                      ].lessonQuiz.length > 0
                    ) {
                      setOpen(true);
                      setQuizBtn(true);
                    } else setNextBtn(true);
                  }}
                  poster={
                    courseData?.courseContent[sectionIndex]?.sectionLessons[
                      lessonIndex
                    ].lessonThumbnail
                  }
                  width="100%"
                  height="100%"
                  id="mnp_video_player"
                  controlsList="noplaybackrate nodownload"
                  ref={videoRef}
                  onPlaying={(e) => {
                    setPlaying(true);
                  }}
                  // onTimeUpdate={(e) => { (e.target.currentTime); }}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onDoubleClick={openFullScreen}
                  onClick={() => {
                    setPlaying(!playing);
                    playing
                      ? videoRef.current.pause()
                      : videoRef.current.play();
                  }}
                >
                  {" "}
                </video>
                {playing ? (
                  <div
                    className="UserCoursePlayer__videoPlayer__hover"
                    onDoubleClick={openFullScreen}
                    onClick={() => {
                      videoRef.current.pause();
                      setPlaying(false);
                    }}
                  >
                    <div className="UserCoursePlayer__videoPlayer__hover__top">
                      {" "}
                    </div>
                    <div
                      onDoubleClick={openFullScreen}
                      onClick={() => {
                        videoRef.current.pause();
                        setPlaying(false);
                      }}
                      className="UserCoursePlayer__videoPlayer__hover__center"
                    ></div>

                    <div className="UserCoursePlayer__videoPlayer__hover__bottom">
                      <div
                        onClick={openFullScreen}
                        className="UserCoursePlayer__videoPlayer__hover__bottom__icon"
                      >
                        <FullscreenIcon
                          fontSize="large"
                          sx={{ color: "#00a0ad" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : !playing ? (
                  <div
                    onDoubleClick={openFullScreen}
                    onClick={() => {
                      videoRef.current.play();
                      setPause(false);
                      setPlaying(true);
                    }}
                    className="UserCoursePlayer__videoPlayer__hover__pause"
                  >
                    <PlayArrowIcon
                      className="UserCoursePlayer__videoPlayer__hover__btn"
                      sx={{ color: "#41424C", fontSize: "50px" }}
                    />
                  </div>
                ) : null}
              </div>
              <div className="UserCoursePlayer__heading">
                {
                  courseData?.courseContent[sectionIndex]?.sectionLessons[
                    lessonIndex
                  ].lessonName
                }
              </div>
              <div className="UserCoursePlayer__leftSec__btn__box">
                {/* {playing ? ( */}
                {/* <Button
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
                    endIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={() => {
                      playing
                        ? videoRef.current.pause()
                        : videoRef.current.play();
                      setPlaying(!playing);
                    }}
                  >
                    {playing ? "Pause" : "play"}
                  </Button> */}
                {/* ) : null} */}

                {nextBtn && !quizBtn ? (
                  <LoadingButton
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
                    loading={loadingBtn}
                    variant="outlined"
                    onClick={handleLessonComplete}
                  >
                    Next
                  </LoadingButton>
                ) : quizBtn && !open ? (
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
                    onClick={() => setOpen(true)}
                  >
                    {openResult ? "Result" : "Retake Quiz"}
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="UserCoursePlayer__leftRight__container">
            <div className="UserCoursePlayer__rightSec">
              <div className="UserCoursePlayer__box">
                {/* <div className="UserCoursePlayer__header">
                  <div className="">
                    Course Sections
                  </div>
                </div> */}
                <CourseSections
                  sections={courseData?.courseContent}
                  setSectionIndex={setSectionIndex}
                  setLessonIndex={setLessonIndex}
                  setNextBtn={setNextBtn}
                  setQuizBtn={setQuizBtn}
                  setOpen={setOpen}
                  setOpenResult={setOpenResult}
                  setPlaying={setPlaying}
                  setQuizValue={setQuizValue}
                  setQuizResult={setQuizResult}
                  sectionIndex={sectionIndex}
                  lessonIndex={lessonIndex}
                  enrollCourseData={enrollCourseData}
                  videoRef={videoRef}
                />
              </div>
            </div>
            <div className="UserCoursePlayer__leftSec">
              {windowDimensions.width > 550 ? (
                <>
                  <div className="UserCoursePlayer__heading">
                    {
                      courseData?.courseContent[sectionIndex]?.sectionLessons[
                        lessonIndex
                      ].lessonName
                    }
                  </div>
                  <div
                    className="UserCoursePlayer__videoPlayer__box"
                    onMouseEnter={() => setPause(true)}
                    onMouseLeave={() => setPause(false)}
                    onDoubleClick={openFullScreen}
                  >
                    <video
                      src={
                        courseData?.courseContent[sectionIndex]?.sectionLessons[
                          lessonIndex
                        ].lessonVideo
                      }
                      onEnded={() => {
                        if (
                          courseData.courseContent[sectionIndex].sectionLessons[
                            lessonIndex
                          ].lessonQuiz.length > 0
                        ) {
                          setOpen(true);
                          setQuizBtn(true);
                        } else setNextBtn(true);
                      }}
                      poster={
                        courseData?.courseContent[sectionIndex]?.sectionLessons[
                          lessonIndex
                        ].lessonThumbnail
                      }
                      width="100%"
                      height="100%"
                      ref={videoRef}
                      controlsList="noplaybackrate nodownload"
                      id="mnp_video_player"
                      onPlaying={() => setPlaying(true)}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onDoubleClick={openFullScreen}
                      onClick={() => {
                        setPlaying(!playing);
                        playing
                          ? videoRef.current.pause()
                          : videoRef.current.play();
                      }}
                    >
                      {" "}
                    </video>
                    {pause && playing ? (
                      <div
                        onDoubleClick={openFullScreen}
                        className="UserCoursePlayer__videoPlayer__hover"
                      >
                        <div className="UserCoursePlayer__videoPlayer__hover__top">
                          {" "}
                        </div>
                        <div
                          onDoubleClick={openFullScreen}
                          onClick={() => {
                            videoRef.current.pause();
                            setPlaying(false);
                          }}
                          className="UserCoursePlayer__videoPlayer__hover__center"
                        >
                          <PauseIcon
                            onClick={() => {
                              videoRef.current.pause();
                              setPlaying(false);
                            }}
                            className="UserCoursePlayer__videoPlayer__hover__btn"
                            sx={{ color: "#41424C", fontSize: "70px" }}
                          />
                        </div>

                        <div className="UserCoursePlayer__videoPlayer__hover__bottom">
                          <div className="UserCoursePlayer__videoPlayer__hover__bottom__icon">
                            <div
                              onClick={() => {
                                videoRef.current.pause();
                                setPlaying(false);
                              }}
                            >
                              <PauseIcon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div>
                            <div
                              onClick={() => {
                                handleBackward(5);
                              }}
                            >
                              <Replay5Icon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div>
                            <div
                              onClick={() => {
                                handleBackward(10);
                              }}
                            >
                              <Replay10Icon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div>
                            <div
                              onClick={() => {
                                handleBackward(30);
                              }}
                            >
                              <Replay30Icon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div>
                            {/* <div
                              onClick={() => {
                                handleForward(60);
                              }}
                            >
                              <Forward10Icon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div> */}
                          </div>
                          {/* <div className="UserCoursePlayer__videoPlayer__hover__bottom__icon" style={{ position: 'relative', height: '10px', backgroundColor: '#ccc', width: '50%' }}>
                            <div style={{ position: 'absolute', left: '0', height: '100%', backgroundColor: '#f00', width: '10%' }} />
                          </div> */}
                          <div className="UserCoursePlayer__videoPlayer__hover__bottom__icon">
                            <div>
                              <span>{formatTime(currentTime)}</span> /{" "}
                              <span>{formatTime(duration)}</span>
                            </div>
                            <div onClick={openFullScreen}>
                              <FullscreenIcon
                                fontSize="large"
                                sx={{ color: "#00a0ad" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : !playing ? (
                      <div
                        onDoubleClick={openFullScreen}
                        onClick={() => {
                          videoRef.current.play();
                          setPause(false);
                          setPlaying(true);
                        }}
                        className="UserCoursePlayer__videoPlayer__hover__pause"
                      >
                        <PlayArrowIcon
                          className="UserCoursePlayer__videoPlayer__hover__btn"
                          sx={{ color: "#41424C", fontSize: "70px" }}
                        />
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
              <div className="UserCoursePlayer__leftSec__description__box">
                <div className="UserCoursePlayer__leftSec__btn__box">
                  {/* {playing ? ( */}
                  {/* <Button
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
                    endIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={() => {
                      playing
                        ? videoRef.current.pause()
                        : videoRef.current.play();
                      setPlaying(!playing);
                    }}
                  >
                    {playing ? "Pause" : "play"}
                  </Button> */}
                  {/* ) : null} */}

                  {nextBtn && !quizBtn ? (
                    <LoadingButton
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
                      loading={loadingBtn}
                      variant="outlined"
                      onClick={handleLessonComplete}
                    >
                      Next
                    </LoadingButton>
                  ) : quizBtn && !open ? (
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
                      onClick={() => setOpen(true)}
                    >
                      {openResult ? "Result" : "Retake Quiz"}
                    </Button>
                  ) : null}
                </div>
                {/* <div className="UserCoursePlayer__leftSec__description__heading">
                  About Course
                </div> */}
                <div className="UserCoursePlayer__leftSec__description__heading">
                  {courseData?.courseName}
                </div>
                {windowDimensions.width <= 550 ? (
                  <div className="UserCoursePlayer__leftSec__description__box __mob">
                    <div className="UserCoursePlayer__instr__box__mob">
                      <div className="UserCoursePlayer__heading__mob">
                        Instructor:
                      </div>
                      <div className="UserCoursePlayer__instr__name__mob">
                        {courseData.courseInstructor}
                      </div>
                    </div>
                    <div className="UserCoursePlayer__abstract__box__mob">
                      <div className="UserCoursePlayer__heading__mob">
                        Abstract
                      </div>

                      <div className="UserCoursePlayer__abstract__mob">
                        <LongText
                          content={courseData.courseAbstract}
                          limit={70}
                        />
                      </div>
                    </div>
                    <div className="UserCoursePlayer__abstract__box__mob">
                      <div className="UserCoursePlayer__heading__mob">FAQs</div>

                      <div className="UserCoursePlayer__abstract__mob">
                        FAQS
                      </div>
                    </div>
                  </div>
                ) : (
                  <CourseLesson courseData={courseData} />
                )}
              </div>
            </div>
          </div>
          {open && (
            <Modal
              open={open}
              // onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="UserCoursePlayer__quiz__box">
                {!openResult ? (
                  <>
                    <div className="UserCoursePlayer__quiz__heading">Quiz</div>
                    <div className="UserCoursePlayer__quiz__ques__container">
                      {questionsArr?.map((cur, ind) => {
                        return (
                          <div
                            key={ind}
                            className="UserCoursePlayer__quiz__ques__box"
                          >
                            <div className="UserCoursePlayer__quiz__ques">
                              Q{ind + 1}
                              {")"}
                              {"  "}
                              {cur.question}
                            </div>
                            <div className="UserCoursePlayer__quiz__ans__opt">
                              <div>Answers</div>
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={
                                    quizValue.find(
                                      (item) => item?.question === cur?.question
                                    )?.myAnswer
                                  }
                                  onChange={(e) =>
                                    handleQuizChange(e, ind, cur)
                                  }
                                >
                                  {cur.answerOptions?.map((curSub, subInd) => {
                                    return (
                                      <>
                                        <FormControlLabel
                                          key={subInd}
                                          value={curSub?.option1}
                                          control={
                                            <Radio
                                              sx={{
                                                "&, &.Mui-checked": {
                                                  color: "#00a0ad",
                                                },
                                              }}
                                            />
                                          }
                                          label={curSub?.option1}
                                        />
                                        <FormControlLabel
                                          key={subInd}
                                          value={curSub?.option2}
                                          control={
                                            <Radio
                                              sx={{
                                                "&, &.Mui-checked": {
                                                  color: "#00a0ad",
                                                },
                                              }}
                                            />
                                          }
                                          label={curSub?.option2}
                                        />
                                        {curSub?.option3 ? (
                                          <FormControlLabel
                                            key={subInd}
                                            value={curSub?.option3}
                                            control={
                                              <Radio
                                                sx={{
                                                  "&, &.Mui-checked": {
                                                    color: "#00a0ad",
                                                  },
                                                }}
                                              />
                                            }
                                            label={curSub?.option3}
                                          />
                                        ) : null}
                                        {curSub.option4 ? (
                                          <FormControlLabel
                                            key={subInd}
                                            value={curSub?.option4}
                                            control={
                                              <Radio
                                                sx={{
                                                  "&, &.Mui-checked": {
                                                    color: "#00a0ad",
                                                  },
                                                }}
                                              />
                                            }
                                            label={curSub?.option4}
                                          />
                                        ) : null}
                                      </>
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </div>
                        );
                      })}
                      <div className="UserCoursePlayer__quiz__btn__box">
                        <>
                          {!indQuizToggler && (
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
                              onClick={() => {
                                setIndQuiz(null);
                                setQuizValue([]);
                                setOpen(false);
                              }}
                            >
                              cancel
                            </Button>
                          )}
                          <LoadingButton
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
                            onClick={() => {
                              indQuizToggler
                                ? handleIndQuizSubmit()
                                : handleQuizSubmit();
                            }}
                            loading={loadingBtn}
                          >
                            Submit
                          </LoadingButton>
                        </>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="UserCoursePlayer__quiz__heading">
                      Result
                    </div>
                    <div className="UserCoursePlayer__result__container">
                      <div className="UserCoursePlayer__result__left">
                        {courseData?.courseContent[
                          sectionIndex
                        ]?.sectionLessons[lessonIndex].lessonQuiz.map(
                          (cur, ind) => {
                            return (
                              <div className="UserCoursePlayer__quiz__ques__box">
                                <div className="UserCoursePlayer__quiz__ques">
                                  Q{ind + 1}
                                  {")"}
                                  {"  "}
                                  {cur.question}
                                </div>
                                <div className="UserCoursePlayer__result__left__ans">
                                  Ans{")"} {cur.correctAnswer}{" "}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="UserCoursePlayer__result__right">
                        <div>
                          <TaskAltIcon
                            sx={{ fontSize: "100px", color: "#00A86B" }}
                          />
                        </div>
                        <div className="UserCoursePlayer__result__right__score__box">
                          <div className="UserCoursePlayer__result__right__score">
                            Score {quizResult}%
                          </div>
                          <div className="UserCoursePlayer__result__right__score">
                            Section {sectionIndex + 1}
                          </div>
                          <div className="UserCoursePlayer__result__right__score">
                            Lesson {lessonIndex + 1}
                          </div>
                        </div>
                        <div className="UserCoursePlayer__feedback__container">
                          <span style={{ fontSize: "20px" }}>
                            Your feedback is valuable for us!
                          </span>
                          <Rating
                            name="ratings"
                            value={ratings}
                            onChange={(event, newValue) => {
                              setRatings(newValue);
                              setRated(true);
                            }}
                            size="large"
                            disabled={completed}
                          />
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
                            disabled={completed}
                          />
                        </div>
                        {rated && completed && (
                          <div className="UserCoursePlayer__certifcate__box">
                            <div className="UserCoursePlayer__certificate__heading">
                              Do you want to download the Certificate?
                            </div>
                            {courseData.hasCertificate ? (
                              quizResult > 70 ? (
                                timerRun ? (
                                  <>
                                    <ReactToPrint
                                      trigger={() => (
                                        <div className="box__left__btn__color3">
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
                                        date={completedData?.completedDate}
                                        ref={PDFRef}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="box__left__btn__color3">
                                    Generating Certificate...
                                  </div>
                                )
                              ) : (
                                <div
                                  className="box__left__btn__color3"
                                  onClick={() => {
                                    toast.info(
                                      "Your quiz score is lower than 70%. Please retake the quizzes to gain a better score and get a certificate"
                                    );
                                    setOpenCertificateModal(false);
                                  }}
                                >
                                  Low Quiz Score ({quizResult}%)
                                </div>
                              )
                            ) : (
                              <div>
                                <br />
                                This course has no certification
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="UserCoursePlayer__quiz__btn__box">
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
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Close
                      </Button>
                      {!completed && (
                        <LoadingButton
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
                          loading={loadingBtn}
                          variant="outlined"
                          onClick={handleLessonComplete}
                          disabled={!rated}
                        >
                          Next
                        </LoadingButton>
                      )}
                    </div>
                  </>
                )}
              </Box>
            </Modal>
          )}
        </div>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default UserCoursePlayer;
