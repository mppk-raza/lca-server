import React, { useState, useEffect } from "react";
import "./AllCourses.css";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CoursesPagination from "../../../components/CoursesPagination/CoursesPagination";
import Skeleton from "@mui/material/Skeleton";

const Search = styled("div")(({ theme }) => ({
  zIndex: 1,
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "lightGrey",
  "&:hover": {
    backgroundColor: " rgba(240, 238, 238, 0.816)",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    //   marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  zIndex: 1,
  color: "inherit",
  "& .MuiInputBase-input": {
    zIndex: 1,
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "22ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));
const ListedCourses = () => {
  const [listedCourses, setListedCourses] = useState(null);
  const [searchCourses, setSearchCourses] = useState(null);
  const [allData, setAllData] = useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("All");
  const [search, setSearch] = useState("");

  const path = useLocation().pathname;
  const pageSize = 15;

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/api/courses/getAllCourses", {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        setAllData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  useEffect(() => {
    if (allData) {
      setSearch("");
      let temp = allData;
      if (value === "All") {
        setListedCourses(temp);
        setPagination({ ...pagination, from: 0, count: temp.length });
      } else if (value === "Active") {
        const found = temp.filter((obj) => {
          return obj.status === "Listed";
        });
        setListedCourses(found);
        setPagination({ ...pagination, from: 0, count: found.length });
      } else if (value === "Hidden") {
        const found = temp.filter((obj) => {
          return obj.status === "Hidden";
        });
        setListedCourses(found);
        setPagination({ ...pagination, from: 0, count: found.length });
      }
    } else {
      setListedCourses(null);
    }
  }, [value, allData]);

  useEffect(() => {
    if (listedCourses) {
      if (listedCourses.length > 0) {
        if (search !== "") {
          let temp = listedCourses;
          temp = temp.filter((obj) => {
            let searchStr =
              obj.courseName +
              " " +
              obj.courseInstructor +
              " " +
              obj.courseType;
            if (searchStr.toLowerCase().includes(search?.toLowerCase())) {
              return obj;
            }
          });
          setPagination({ ...pagination, from: 0, count: temp.length });
          setSearchCourses(temp);
        } else {
          setPagination({
            ...pagination,
            from: 0,
            count: listedCourses.length,
          });
          setSearchCourses(listedCourses);
        }
      } else {
        setSearchCourses([]);
      }
    } else {
      setSearchCourses(null);
    }
  }, [search, listedCourses]);

  const activeHideCourse = (id, api) => {
    setOpen(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/courses/${api}`, {
        token: localStorage.getItem("token"),
        courseID: id,
      })
      .then((res) => {
        //console.log(res);
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setRefresh(!refresh);
          setOpen(false);
        } else {
          toast.warn(res.data.message);
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  return (
    <div className="ListedCourses">
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="ListedCourses__heading__add__btn">
        <h3 className="ListedCourses__heading">All Courses</h3>
      </div>
      <div className="ListedCourses__filterBar">
        <Box>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                // onClick={() => setRefresh(!refresh)}
                variant="scrollable"
                TabIndicatorProps={{
                  style: { background: "#00a0ad", textColor: "red" },
                }}
                sx={{ "& button.Mui-selected": { color: "#00a0ad" } }}
              >
                <Tab label="All" value="All" />
                <Tab label="Active" value="Active" />
                <Tab label="Hidden" value="Hidden" />
              </TabList>
            </Box>
          </TabContext>
        </Box>
        <div>
          <Search sx={{ zIndex: "1" }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ zIndex: "1" }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
        </div>
      </div>
      {searchCourses ? (
        <div className="ListedCourses__cards__box">
          {searchCourses
            .slice(pagination.from, pagination.to)
            .map((cur, ind) => {
              return (
                <div
                  className={
                    cur.status === "Listed"
                      ? "ListedCourses__card"
                      : "ListedCourses__card__Deleted"
                  }
                  key={ind}
                >
                  <div>
                    <img
                      className="ListedCourses__card__img"
                      src={cur.courseThumbnail}
                      alt={cur.courseName}
                    />
                  </div>
                  <div className="ListedCourses__card__author">
                    {" "}
                    {cur.courseName}{" "}
                  </div>
                  <div className="designation"> {cur.courseInstructor}</div>
                  <div className="ListedCourses__card__details__box">
                    <div className="ListedCourses__card__text">
                      Type: {cur.courseType}
                    </div>
                    <div className="ListedCourses__card__text">
                      WatchTime: {cur.courseStats?.watchTime}
                    </div>
                  </div>
                  <div className="ListedCourses__card__btn__box">
                    {cur.status === "Listed" ? (
                      <Button
                        sx={{
                          color: "#00a0ad",
                          borderColor: "#00a0ad",
                          "&:hover": {
                            backgroundColor: "#00a0ad",
                            color: "#41424C",
                            borderColor: "#41424C",
                          },
                          "&:active": { backgroundColor: "#00a0ad" },
                        }}
                        variant="outlined"
                        onClick={() =>
                          activeHideCourse(cur._id, "hideListedCourse")
                        }
                      >
                        Hide
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          color: "#00a0ad",
                          borderColor: "#00a0ad",
                          "&:hover": {
                            backgroundColor: "#00a0ad",
                            color: "#41424C",
                            borderColor: "#41424C",
                          },
                          "&:active": { backgroundColor: "#00a0ad" },
                        }}
                        variant="outlined"
                        onClick={() =>
                          activeHideCourse(cur._id, "listHiddenCourse")
                        }
                      >
                        Activate
                      </Button>
                    )}

                    <Button
                      sx={{
                        marginLeft: "15px",
                        color: "#00a0ad",
                        borderColor: "#00a0ad",
                        "&:hover": {
                          backgroundColor: "#00a0ad",
                          color: "#41424C",
                          borderColor: "#41424C",
                        },
                        "&:active": { backgroundColor: "#00a0ad" },
                      }}
                      variant="outlined"
                      component={Link}
                      to="/course"
                      state={{ id: cur._id, backUrl: path }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          <CoursesPagination
            pageSize={pageSize}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      ) : (
        <div className="ListedCourses__cards__box">
          {["", "", "", "", "", ""].map(() => {
            return (
              <div
                style={{
                  marginBottom: "20px",
                  minWidth: "28%",
                  backgroundColor: "rgba(126, 118, 104, 0.2)",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={330}
                  height={170}
                  sx={{ m: "5px auto" }}
                ></Skeleton>
                <Skeleton
                  variant="rectangular"
                  width={280}
                  height={40}
                  sx={{ m: "20px auto 20px auto" }}
                >
                  {" "}
                </Skeleton>
                <Skeleton
                  variant="rectangular"
                  width={250}
                  height={20}
                  sx={{ m: "5px auto" }}
                >
                  {" "}
                </Skeleton>
                <Skeleton
                  variant="rectangular"
                  width={250}
                  height={20}
                  sx={{ m: "5px auto 30px auto" }}
                ></Skeleton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListedCourses;
