import React, { useState, useEffect } from "react";
import "./NewCourses.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";
import { borderRadius } from "@mui/system";

const NewCourses = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const [courses, setCourses] = useState();
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft - 400)
      : (slider.scrollLeft = slider.scrollLeft - 200);
    //console.log(slider);
  };
  const slideRight = () => {
    var slider = document.getElementById("slider");
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft + 400)
      : (slider.scrollLeft = slider.scrollLeft + 200);
  };
  const mouseSlideRight = () => {
    var slider = document.getElementById("slider");
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft + 90)
      : (slider.scrollLeft = slider.scrollLeft + 60);
  };
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
  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  const getListedCourses = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/courses/getListedCourses")
      .then((res) => {
        setCourses(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getListedCourses();
  }, []);

  const training = [
    {
      url: "https://lca.mulphico.pk/wp-content/uploads/2022/05/WP-3-1536x1024.jpg",
      caption: "Slide 1",
    },
    {
      url: "https://lca.mulphico.pk/wp-content/uploads/2022/05/QMS.jpg",
      caption: "Slide 2",
    },
    {
      url: "https://lca.mulphico.pk/wp-content/uploads/2022/05/cs-4.jpg",
      caption: "Slide 3",
    },
    {
      url: "https://lca.mulphico.pk/wp-content/uploads/2022/05/power-bi-1-1-1.jpg",
      caption: "Slide 4",
    },
    {
      url: "https://lca.mulphico.pk/wp-content/uploads/2022/05/cs-4.jpg",
      caption: "Slide 5",
    },
  ];

  return (

    <div
      className="new__courses__section"
      onMouseEnter={mouseSlideRight}
      onMouseLeave={mouseSlideRight}
    >
      <div className="new__courses__section__heading">New Online Courses</div>
      <div className="new__courses__section__text__content__box">
        <div className="new__courses__section__text__content__heading">
          Delivering a large number of courses with confidence
        </div>
        <div className="new__courses__section__text__content__text">
          Learn without limits with M&P Lesrning Circles Academy, featuring a wide variety of different courses to choose from. Whether it'd an in-depth Microsoft Excel Training, or M&P's very own SOP training, you can now attend these sessions, in the comfort of your home, with the world on your fingertips!
        </div>
      </div>
      <div className="courses__card__btn__box">
        {windowDimensions.width >= 750 ? (
          <div className="courses__btn" onClick={slideLeft}>
            <ArrowBackIosNewIcon />
          </div>
        ) : null}
        <div id="slider" className="courses__cards__container">
          {courses ?
            <>
              {courses?.map((cur, ind) => (
                <div className="courses__card" key={ind}>
                  {/* <div className="courses__card__title">Courses Names</div> */}
                  <div
                    className="courses__card__img"
                    onClick={() => {
                      navigate("/course", { state: { id: cur._id, backUrl: path } });
                    }}
                  >
                    <img src={cur.courseThumbnail} />
                  </div>
                  {/* <div className="courses__card__details">
                details details details details details details
              </div> */}
                </div>
              ))}
            </>
            : <>
              <div className="courses__cards__container">
                <div className="courses__card__img">

                  <Skeleton
                    sx={{ bgcolor: 'grey.900', borderRadius: "5%" }}
                    variant="rectangular"
                    width={210}
                    height={118}
                  />
                </div>
                <div className="courses__card__img">

                  <Skeleton
                    sx={{ bgcolor: 'grey.900', borderRadius: "5%" }}
                    variant="rectangular"
                    width={210}
                    height={118}
                  />
                </div>
                <div className="courses__card__img">

                  <Skeleton
                    sx={{ bgcolor: 'grey.900', borderRadius: "5%" }}
                    variant="rectangular"
                    width={210}
                    height={118}
                  />
                </div>
              </div>
            </>
          }

        </div>
        {windowDimensions.width >= 750 ? (
          <div className="courses__btn" onClick={slideRight}>
            <ArrowForwardIosIcon />
          </div>
        ) : null}
      </div>

      <div className="courses__btn__box">
        {windowDimensions.width <= 750 ? (
          <div className="courses__btn" onClick={slideLeft}>
            {<ArrowBackIosNewIcon />}
          </div>
        ) : null}
        {windowDimensions.width <= 750 ? (
          <div className="courses__btn" onClick={slideRight}>
            <ArrowForwardIosIcon />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewCourses;
