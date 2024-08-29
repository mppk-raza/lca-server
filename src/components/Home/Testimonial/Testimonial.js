import React, { useEffect, useState } from "react";
import "./Testimonial.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Skeleton from "@mui/material/Skeleton";
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';

import axios from "axios";

const Testimonial = () => {
  const [testimonialData, setTestimonialData] = useState();
  let skeletons = [1, 2,];
  const getActiveTestimonials = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
        "/api/testimonials/getActiveTestimonials"
      )
      .then((res) => {
        //console.log(res);
        setTestimonialData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getActiveTestimonials();
  }, []);

  const slideLeft = () => {
    var slider = document.getElementById("testimonialSlider");
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft - 580)
      : (slider.scrollLeft = slider.scrollLeft - 200);
    //console.log(slider);
  };
  const slideRight = () => {
    var slider = document.getElementById("testimonialSlider");
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft + 580)
      : (slider.scrollLeft = slider.scrollLeft + 200);
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

  return (
    <div className="testimonial">
      <div className="testimonial__heading">Testimonials</div>
      {testimonialData ? (
        <>
          <div className="testimonial__cards__btn__container">
            {windowDimensions.width >= 750 ? (
              <div className="learning__partner__btn" onClick={slideLeft}>
                <ArrowBackIosNewIcon sx={{ color: "black" }} />
              </div>
            ) : null}

            <div id="testimonialSlider" className="testimonial__cards__box">
              {testimonialData?.map((cur, ind) => {
                let text = cur.testimonial + "It was a huge win for our organization and I hit my training goal in under a year. Our traffic went through the roof! The completion rates and feedback were great it's really helping the company from a number of business standpoints."
                return (
                  <div className="testimonial__card" key={ind}>
                    <div className="testimonial__card__icon"> <FormatQuoteRoundedIcon sx={{ fontSize: "60px", color: "#00a0ad" }} /></div>
                    <div className="testimonial__card__text">
                      {(text.length > 250) ? text.slice(0, 250)+ "..." : text}
                    </div>
                    <div>

                      <img className="testimonial__card__img" src={cur.authorImage} alt={cur.authorName} />
                    </div>

                    <div className="testimonial__card__author">
                      {cur.authorName}
                    </div>
                    <div className="designation"> {cur.authorDesignation}</div>
                  </div>
                );
              })}
            </div>
            {windowDimensions.width >= 750 ? (
              <div className="learning__partner__btn" onClick={slideRight}>
                <ArrowForwardIosIcon sx={{ color: "black" }} />
              </div>
            ) : null}
          </div>
          <div className="learning__partner__btn__box">
            {windowDimensions.width <= 750 ? (
              <div className="learning__partner__btn" onClick={slideLeft}>
                {<ArrowBackIosNewIcon sx={{ color: "black" }} />}
              </div>
            ) : null}
            {windowDimensions.width <= 750 ? (
              <div className="learning__partner__btn" onClick={slideRight}>
                <ArrowForwardIosIcon sx={{ color: "black" }} />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="skeleton__container">
          {skeletons.map((cur, ind) => {
            return (
              <div key={ind} className="skeletons">
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height="200px"
                  width="90%"
                  style={{ margin: "10px auto" }}
                />

                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={60}
                  height={60}
                  style={{ margin: "10px auto" }}
                />
                <Skeleton
                  animation="wave"
                  height={20}
                  width="30%"
                  style={{ margin: "auto" }}

                />
                <Skeleton
                  animation="wave"
                  height={10}
                  width="50%"
                  style={{ margin: "auto" }}

                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Testimonial;
