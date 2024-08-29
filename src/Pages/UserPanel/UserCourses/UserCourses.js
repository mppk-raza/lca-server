import React, { useState, useEffect } from "react";
import "./UserCourses.css";
import CoursesList from "../../../components/UserPanel/UserCourses/CoursesList/CoursesList";
import CoursesFilterBar from "../../../components/UserPanel/UserCourses/CoursesFilterBar/CoursesFilterBar";
import CoursesPagination from "../../../components/CoursesPagination/CoursesPagination";
import axios from "axios";

const UserCourses = () => {
  const [coursesData, setCoursesData] = useState();
  const [allCourses, setAllCourses] = useState();
  const [EnrolledCourses, setEnrolledCourses] = useState();
  const [Enrollments, setEnrollments] = useState([]);
  const [MonthWiseTrainingsStats, setMonthWiseTrainingsStats] = useState();
  const [availableCourses, setAvailableCourses] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const pageSize = 8;

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const getAllCourses = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/courses/getListedCourses")
      .then((res) => {
        //console.log(res);
        setAllCourses(res.data.data);
        setPagination({ ...pagination, count: res.data.data.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getEnrolledCourses = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/getEnrolledCourses",
        { token: localStorage.getItem("token") }
      )
      .then((res) => {
        console.log(res);
        setEnrolledCourses(res.data.data);
        setEnrollments(res.data.enrollments);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkAvailability = (allCourses) => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/api/courses/checkAvailability",
        { token: localStorage.getItem("token") }
      )
      .then((res) => {
        console.log(res);
        const availableCoursesTemp = allCourses.filter((itemA) =>
          res.data.data.some((itemB) => itemB._id === itemA._id)
        );
        setAvailableCourses(availableCoursesTemp);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const tempFilter = coursesData?.filter((obj) => {
      if (search === "") {
        return obj;
      } else if (obj.courseName.toLowerCase().includes(search?.toLowerCase())) {
        return obj;
      }
    });
    setPagination({ ...pagination, from: 0, count: tempFilter?.length });
  }, [search]);

  useEffect(() => {
    setLoading(true);
    getEnrolledCourses();
    getAllCourses();
  }, [refresh]);

  useEffect(() => {
    if (allCourses) {
      checkAvailability(allCourses);
    }
  }, [allCourses]);

  useEffect(() => {
    if (status === "All") {
      setCoursesData(allCourses);
      setPagination({ ...pagination, from: 0, count: allCourses?.length });
    } else if (status === "Available") {
      setCoursesData(availableCourses);
      setPagination({
        ...pagination,
        from: 0,
        count: availableCourses?.length,
      });
    } else {
      setCoursesData(EnrolledCourses);
      setPagination({ ...pagination, from: 0, count: EnrolledCourses?.length });
    }
  }, [status, allCourses, availableCourses, EnrolledCourses]);

  return (
    <div className="UserCourses">
      <div className="UserCourses__heading">Courses List</div>
      <CoursesFilterBar
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />
      <CoursesList
        coursesData={coursesData}
        availableCourses={availableCourses}
        enrollments={Enrollments}
        enrolledCourses={EnrolledCourses}
        search={search}
        category={category}
        pagination={pagination}
        loading={loading}
      />
      {!loading ? (
        <CoursesPagination
          pageSize={pageSize}
          pagination={pagination}
          setPagination={setPagination}
        />
      ) : null}
    </div>
  );
};

export default UserCourses;
