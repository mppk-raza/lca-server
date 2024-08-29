import React, { useState, useEffect } from "react";
import "./UpcomingTrainings.css";
import axios from "axios";
import "react-slideshow-image/dist/styles.css";
import background from "../../../assets/waveblue2.png";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const UpcomingTrainings = () => {
  const navigate = useNavigate();
  const orangeTheme = createTheme({
    palette: { primary: { main: "#00a0ad" }, secondary: { main: "#41424C" } },
  });

  const [trainings, setTrainings] = useState(null);

  const getUpcomingTrainings = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          "/api/trainings/getAllActiveTrainings"
      )
      .then((res) => {
        setTrainings(res.data.data);
      });
  };

  useEffect(() => {
    getUpcomingTrainings();
  }, []);

  return (
    <div
      className="training__section"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "left",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ThemeProvider theme={orangeTheme}>
        <div className="training__section__container">
          <div className="training__section__heading"> Regularly Scheduled</div>
          <div className="training__slider__container">
            <div className="training__content__box">
              <div className="training__content__heading">
                Upcoming In Person Trainings
              </div>
              <div className="training__content__text">
                To create and foster a learning environment, Continuous Learning
                is what paves the way. Virtual, in person, on the job, off the
                job, specialized assignments, role plays, and delegation all
                play their part in Development some way or the other. To create
                an Ongoing learning culture, new courses are introduced every
                month.
              </div>
              <div>
                <div
                  className="nomination__btn color"
                  onClick={() => navigate("/UserPanel/Trainings")}
                  variant="contained"
                >
                  View Trainings
                </div>
              </div>
            </div>
            {trainings?.length > 0 && (
              <div className="slide-container">
                <AwesomeSlider transitionDelay={1}>
                  {trainings?.map((item, index) => (
                    <div>
                      <img
                        className="slide-back"
                        src={item.trainingThumbnail}
                        alt={item.name}
                      />
                    </div>
                  ))}
                </AwesomeSlider>
              </div>
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default UpcomingTrainings;
