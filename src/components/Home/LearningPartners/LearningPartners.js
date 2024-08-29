import React, { useState, useEffect } from 'react'
import './LearningPartners.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

const LearningPartners = () => {
  const slideLeft = () => {
    var slider = document.getElementById('learningPartnerSlider')
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft - 730)
      : (slider.scrollLeft = slider.scrollLeft - 100)
    //console.log(slider);
  }
  const slideRight = () => {
    var slider = document.getElementById('learningPartnerSlider')
    windowDimensions.width >= 750
      ? (slider.scrollLeft = slider.scrollLeft + 730)
      : (slider.scrollLeft = slider.scrollLeft + 100)
  }
  const hasWindow = typeof window !== 'undefined'
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  function getWindowDimensions () {
    const width = hasWindow ? window.innerWidth : null
    return {
      width
    }
  }
  React.useEffect(() => {
    if (hasWindow) {
      function handleResize () {
        setWindowDimensions(getWindowDimensions())
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [hasWindow])
  
  const [trainingPartners, settrainingPartners] = useState();
  
  let skeletons = [1, 2, 3];

  const getActiveTrainingPartners = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
        "/api/LearningPartners/getActiveTestimonials"
      )
      .then((res) => {
        console.log(res);
        settrainingPartners(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getActiveTrainingPartners();
  }, []);

  return (
    <div className='learning__partner'>
      <div className='learning__partner__heading'>Our Learning Partners</div>
      {trainingPartners ? (
        <>
          <div className='learning__partner__card__btn__box'>
            {windowDimensions.width >= 750 ? (
              <div className='learning__partner__btn' onClick={slideLeft}>
                <ArrowBackIosNewIcon sx={{ color: 'black' }} />
              </div>
            ) : null}
            <div
              id='learningPartnerSlider'
              className='learning__partner__cards__container'
            >
              {trainingPartners.map((cur, ind) => (
                <div className='learning__partner___card' key={ind}>
                  <div className='card__img'>
                    <img className='card__img' src={cur.authorImage} />
                  </div>
                  <div className='card__name'>{cur.authorName}</div>
                  <div className='card__designation'>{cur.authorDesignation}</div>
                  <div className='card__details'>{cur.testimonial}</div>
                </div>
              ))}
            </div>
            {windowDimensions.width >= 750 ? (
              <div className='learning__partner__btn' onClick={slideRight}>
                <ArrowForwardIosIcon sx={{ color: 'black' }} />
              </div>
            ) : null}
          </div>

          <div className='learning__partner__btn__box'>
            {windowDimensions.width <= 750 ? (
              <div className='learning__partner__btn' onClick={slideLeft}>
                {<ArrowBackIosNewIcon sx={{ color: 'black' }} />}
              </div>
            ) : null}
            {windowDimensions.width <= 750 ? (
              <div className='learning__partner__btn' onClick={slideRight}>
                <ArrowForwardIosIcon sx={{ color: 'black' }} />
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
  )
}

export default LearningPartners
