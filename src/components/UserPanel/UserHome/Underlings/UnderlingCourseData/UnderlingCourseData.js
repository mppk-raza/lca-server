import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./UnderlingCourseData.css";
import UnderlingCoursesTable from "../../../../Admin/Course/UnderlingTable/UnderlingCoursesTable";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
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
  color: "inherit",
  "& .MuiInputBase-input": {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "27ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));

const UnderlingCourseData = () => {
  let location = useLocation();
  const underlingID = location.state?.underlingID;

  const [loading, setLoading] = React.useState(false);
  const [underlingCourses, setUnderlingCourses] = useState([]);
  const [searchCourses, setSearchCourses] = useState("");
  const [courseID, setCourseID] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setCourseID(null);
  };

  const getAllBooks = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/getUnderlingCourses`,
        {
          underlingID,
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        let temp = res.data.data ? res.data.data : [];
        setUnderlingCourses(temp);
      })
      .catch((err) => {
        console.log(err);
        setUnderlingCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const enrollCourseDialog = (data) => {
    setOpen(true);
    setCourseID(data?.id);
  };

  const enrollCourseNow = () => {
    setLoading(true);
    setOpen(false);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/enrollment/enrollUnderlingCourse`,
        {
          underlingID,
          courseID,
          token: localStorage.getItem("token"),
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className="Users">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#41424C",
            borderRadius: "60px",
            margin: "10px auto",
            width: "95%",
            color: "white",
            padding: 0,
            marginTop: "30px",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              // flexWrap: "wrap",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            <Search sx={{ minWidth: "98%" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchCourses}
                onChange={(e) => setSearchCourses(e.target.value)}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ width: "95%", typography: "body1", margin: "30px auto" }}>
        <UnderlingCoursesTable
          underlingCourses={underlingCourses}
          searchUnderlingCourses={searchCourses}
          underlingID={underlingID}
          enrollCourseDialog={enrollCourseDialog}
        />
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to enroll in this course?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={enrollCourseNow} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UnderlingCourseData;
