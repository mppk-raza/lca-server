import React, { useEffect, useState } from "react";
import "./Home.css";
import NewCourses from "../../components/Home/NewCourses/NewCourses";
import UpcomingTrainings from "../../components/Home/UpcomingTrainings/UpcomingTrainings";
import LearningPartners from "../../components/Home/LearningPartners/LearningPartners";
import StatsBanner from "../../components/Home/StatsBanner/StatsBanner";
import Testimonial from "../../components/Home/Testimonial/Testimonial";
import HighLights from "../../components/Home/HighLights/HighLights";
import GetStarted from "../../components/Home/GetStarted/GetStarted";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";

const Home = () => {
  const [homeHeadline, setHomeHeadline] = useState(null);
  const [homeBanner, setHomeBanner] = useState(null);

  const getHomeBanner = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/homeBanner/getHomeBanner")
      .then((res) => {
        //console.log(res);
        setHomeBanner(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getHomeHeadline = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + "/api/homeHeadline/getHomeHeadline"
      )
      .then((res) => {
        //console.log(res);
        setHomeHeadline(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getHomeBanner();
    getHomeHeadline();
  }, []);
  return (
    <>
      <Header />
      <div className="Home">
        {homeHeadline && homeBanner ? (
          <div
            className="banner__section"
            style={{
              backgroundImage: `url(${
                homeBanner && homeBanner.bannerLink
                  ? homeBanner.bannerLink
                  : "Loading"
              })`,
            }}
          >
            <div className="banner__content">
              {/* <div className="banner__title">LMS</div> */}
              <div
                className="banner__heading"
                style={{ color: homeHeadline.headlineColor }}
              >
                {homeHeadline ? homeHeadline?.headlineText ?? "" : "Loading..."}
              </div>
              <p
                className="banner__text"
                style={{ color: homeHeadline.descriptionColor }}
              >
                {homeHeadline ? homeHeadline?.description ?? "" : "Loading..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="90%"
              height="65vh"
            />
            <Skeleton width="90%" height="15vh" />
            <Skeleton animation="wave" width="90%" height="10vh" />
          </>
        )}

        <HighLights />
        <div style={{ minHeight: "40px" }}></div>
        <StatsBanner />
        <div style={{ minHeight: "25px" }}></div>
        <UpcomingTrainings />
        <NewCourses />
        <LearningPartners />
        <Testimonial />
        <GetStarted />
      </div>
      <Footer />
    </>
  );
};

export default Home;
