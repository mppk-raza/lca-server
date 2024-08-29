import React from "react";
import "./CoursesList.css";
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
const CoursesList = ({
  enrolledCourses,
  enrollments,
  coursesData,
  availableCourses,
  search,
  category,
  pagination,
  loading,
}) => {
  // const data = coursesData?.slice(pagination.from,pagination.to)
  console.log(enrollments);
  let skeleton = [1, 2, 3, 4];
  const path = useLocation().pathname;
  const navigate = useNavigate();
  console.log(coursesData);
  return (
    <div className="CoursesList">
      {!loading ? (
        <>
          {coursesData
            ?.filter((obj) => {
              if (search === "") {
                return obj;
              } else if (
                obj.courseName.toLowerCase().includes(search?.toLowerCase())
              ) {
                return obj;
              }
            }).filter((obj) => {
              if (category === "All") {
                return obj
              } else {
                return obj.courseType === category
              }
            })
            .slice(pagination.from, pagination.to)
            .map((cur, ind) => {
              return (
                <div
                  key={ind}
                  className={"CoursesList__card"}
                  onClick={() =>
                    navigate("/course", {
                      state: {
                        id: cur.courseId ? cur.courseId : cur._id,
                        backUrl: path,
                        courseData: cur,
                        availability: availableCourses?.find(
                          (id) => id._id === cur._id || id._id === cur.courseId
                        )
                          ? true
                          : false,
                      },
                    })
                  }
                >
                  <div className="CoursesList__card__img">
                    <img
                      alt={cur.courseName}
                      src={cur.courseThumbnail}
                    />{" "}
                  </div>
                  <div className="CoursesList__card__details__container">
                    <div className="CoursesList__card__title">
                      {cur.courseName}
                    </div>
                    <div className="CoursesList__card__instructor">
                      Instructor: {cur.courseInstructor}
                    </div>
                    <div className="CoursesList__card__sec__time__box">
                      <div className="CoursesList__card__sec__time__box__item">
                        <SummarizeIcon
                          sx={{ marginRight: "5px" }}
                          fontSize="small"
                        />
                        {cur.courseStats.countLessons} Lesson
                      </div>
                      <div className="CoursesList__card__sec__time__box__item">
                        <AccessTimeIcon
                          sx={{ marginRight: "5px" }}
                          fontSize="small"
                        />
                        {cur.courseStats.watchTime}
                      </div>
                    </div>
                  </div>
                  <div className="CoursesList__card__avail__container">
                    {availableCourses?.find((id) => id._id === cur._id || id._id === cur.courseId)
                      ? enrollments?.find((en_id) => cur._id === en_id.courseId && en_id.completed)
                        ? <div className="CoursesList__card__avail__icon__box"><EventAvailableIcon />Completed</div>
                        : <div className="CoursesList__card__avail__icon__box"><EventAvailableIcon />Available</div>
                      : (
                        <div className="CoursesList__card__avail__icon__box">
                          <EventBusyIcon />Not Available
                        </div>
                      )}
                  </div>

                </div>
              );
            })}
        </>
      ) : (
        <div className="CoursesList__skeletons__box">
          {skeleton.map((cur, ind) => {
            return (
              <div key={ind} className="CoursesList__skeletons">
                <div className="CoursesList__skeletons__top">
                  <Skeleton
                    sx={{ marginBottom: "10px" }}
                    variant="rounded"
                    width="100%"
                    height={250}
                  />
                </div>
                <div className="CoursesList__skeletons__bottom">

                  <Skeleton
                    sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }}
                    variant="rounded"
                    width="80%" height={20}
                  />
                  <Skeleton
                    sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }}
                    variant="rounded"
                    width="80%" height={15}
                  />
                  <div className="CoursesList__skeletons__bottom__iner">
                    <Skeleton
                      sx={{ bgcolor: '#c7c3c3' }}
                      variant="rounded"
                      width="40%" height={12}
                    />
                    <Skeleton
                      sx={{ bgcolor: '#c7c3c3' }}
                      variant="rounded"
                      width="40%" height={12}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
