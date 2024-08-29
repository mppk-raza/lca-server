import React from "react";
import { Button } from "@mui/material";
import "./QuizSection.css";
import DevicesIcon from "@mui/icons-material/Devices";
import { Link } from "react-router-dom";

const QuizSection = () => {
  let data = [
    {
      name: "JavaScript",
      link: "/",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/2048px-Unofficial_JavaScript_logo_2.svg.png",
      score: "2.4",
    },
    {
      name: "HTML",
      link: "/",
      icon: "https://play-lh.googleusercontent.com/85WnuKkqDY4gf6tndeL4_Ng5vgRk7PTfmpI4vHMIosyq6XQ7ZGDXNtYG2s0b09kJMw",
      score: "4.4",
    },
    {
      name: "CSS",
      link: "/",
      icon: "https://play-lh.googleusercontent.com/RTAZb9E639F4JBcuBRTPEk9_92I-kaKgBMw4LFxTGhdCQeqWukXh74rTngbQpBVGxqo",
      score: "8.4",
    },
  ];

  return (
    <div className="QuizSection">
      <div className="QuizSection__header__box">
        <div className="QuizSection__header__heading">
          My Quiz
          <div className="QuizSection__header_sub_heading">Score</div>
        </div>
        <div className="QuizSection__header__btn">
          <Button variant="text" sx={{ bgcolor: "#fff", color: "black" }}>
            View all
          </Button>
        </div>
      </div>
      {data.map((cur, ind) => {
        return (
          <div key={ind} className="QuizSection__courses__Quiz__box">
            <div className="QuizSection__courses__Quiz__box__left">
              <div className="QuizSection__courses__icon">
                <img height="100%" width="100%" src={cur.icon} alt={cur.name} />
              </div>
              <div className="QuizSection__courses__courseNameQuiz__container">
                <div className="QuizSection__courses__name">
                  Level 1 {cur.name}
                </div>
                <div className="QuizSection__courses__video">
                  <DevicesIcon fontSize="small" sx={{ marginRight: "7px" }} />
                  <Link
                    to={cur.link}
                    style={{ textDecoration: "none", color: "#0000EE" }}
                  >
                    {" "}
                    Basics of {cur.name}
                  </Link>
                </div>
              </div>
            </div>
            <div className="QuizSection__courses__Quiz__box__right">
              <div
                className="QuizSection__courses__Quiz__tag"
                style={
                  cur.score < 3
                    ? { backgroundColor: "#ff6961" }
                    : cur.score < 6
                    ? { backgroundColor: "#ffe600" }
                    : { backgroundColor: "#00A86B" }
                }
              >
                {cur.score < 3 ? "Failed" : cur.score < 6 ? "Good" : "Great"}
              </div>
              <div
                className="QuizSection__courses__Quiz__score"
                style={
                  cur.score < 3
                    ? { color: "#ff6961" }
                    : cur.score < 6
                    ? { color: "#ffe600" }
                    : { color: "#00A86B" }
                }
              >
                {cur.score}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizSection;
