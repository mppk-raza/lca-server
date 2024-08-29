import React, { useEffect, useState } from "react";
import "./Step2.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";

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

const Step2 = ({
  sections,
  setSections,
  OpenArr,
  setOpenArr,
  OpenLessArr,
  setOpenLessArr,
  countLess,
  setCountLess,
  countSec,
  setCountSec,
  watchTime,
}) => {
  const [quizTime, setQuizTime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });
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
      quizTime: null,
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
        quizTime: null,
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
    console.log("temp_sections", temp_sections);

    temp_sections[superind]["sectionLessons"][subind]["lessonQuiz"][quizInd][
      "answerOptions"
    ][opInd][name] = value;
    setSections(temp_sections);
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
    setQuizTime({
      hour: 0,
      minute: 0,
      second: 0,
    });
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

  const [timeInSeconds, setTimeInSeconds] = useState(false);

  const getTimeInSec = () => {
    const durationRegex = new RegExp(
      /(?:(\d+) hour\(s\)\s*)?(?:(\d+) minute\(s\)\s*)?(?:(\d+) second\(s\))?/
    );
    const match = watchTime?.match(durationRegex);
    const arr = [];
    if (match) {
      match?.map((item) => arr.push(item === undefined ? 0 : parseInt(item)));
    }
    arr.shift();
    let timesInSec = arr[0] * 3600 + arr[1] * 60 + arr[2];
    setTimeInSeconds(timesInSec);
  };

  const quizTimeValidator = () => {
    const inputTime =
      parseInt(quizTime.hour * 3600) +
      parseInt(quizTime.minute * 60) +
      parseInt(quizTime.second);
    if (timeInSeconds >= inputTime) {
    } else {
      toast.warning(`*Quiz time is not greater than watch
      time: ${watchTime}`);
    }
  };
  useEffect(() => {
    quizTimeValidator();
  }, [quizTime]);

  useEffect(() => {
    getTimeInSec();
  }, [watchTime]);

  return (
    <>
      {sections?.map((cur, ind) => {
        return (
          <div
            key={ind}
            className={
              OpenArr[ind] === false
                ? "AddCourse__form__box__ex"
                : "AddCourse__form__box"
            }
            style={{ width: "94%" }}
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
                  label="sectionTitle"
                  fullWidth
                  required
                  name="sectionTitle"
                  value={sections[ind].sectionTitle}
                  onChange={(e) => handleSectionChange(e, ind, "sectionTitle")}
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
                onChange={(e) => handleSectionChange(e, ind, "sectionAbstract")}
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
                    style={{ width: "94%" }}
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
                            [, hours, minutes, seconds] = match?.map(Number);
                          }
                        }
                        return (
                          <>
                            {cur.isQuiz ? (
                              <div
                                key={quizInd}
                                className="AddCourse__sec__box"
                                style={{ width: "94%" }}
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
                                      handleQuizChange(e, ind, subind, quizInd);
                                    }}
                                  />
                                </div>
                                {curQuiz?.answerOptions?.map(
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
                                  <div
                                    className="AddCourse__textfield watch_time"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
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
                                              if (e.target.value >= 0) {
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
                                              } else {
                                                toast.warning(
                                                  "Hours should be greater than 0"
                                                );
                                              }
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
                                              if (
                                                e.target.value >= 0 &&
                                                e.target.value <= 60
                                              ) {
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
                                              } else {
                                                toast.warning(
                                                  "Minutes should be greater than 0 and less than 60"
                                                );
                                              }
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
                                              if (
                                                e.target.value >= 0 &&
                                                e.target.value <= 60
                                              ) {
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
                                              } else {
                                                toast.warning(
                                                  "Seconds should be greater than 0 and less than 60"
                                                );
                                              }
                                            }}
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="AddCourse__quiz__btn">
                                  <Button
                                    endIcon={<DeleteIcon />}
                                    color="error"
                                    variant="contained"
                                    onClick={() =>
                                      handleDeleteQuiz(ind, subind, quizInd)
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
      <div className="addSection__btn_box" style={{ width: "95%" }}>
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
    </>
  );
};

export default Step2;
