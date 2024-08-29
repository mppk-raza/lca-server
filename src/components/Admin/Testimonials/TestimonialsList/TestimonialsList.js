import React, { useState, useEffect } from "react";
import "./TestimonialsList.css";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import AddTestimonial from "../AddTestimonial/AddTestimonial";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import validator from "validator";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TestimonialsList = () => {
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [filter, setFilter] = useState("All");

  const [editTestimonialBtnLoading, setEditTestimonialBtnLoading] =
    useState(false);
  const [statusTestimonialBtnLoading, setStatusTestimonialBtnLoading] =
    useState(false);

  const handleRadioChange = (event) => {
    setFilter(event.target.value);
  };
  const [allTestimonial, setAllTestimonial] = useState();
  const [hideTestimonialData, setHideTestimonialData] = useState({
    testimonialID: "",
    token: localStorage.getItem("token"),
  });
  const [editTestimonialData, setEditTestimonialData] = useState({
    _id: "",
    testimonial: "",
    authorName: "",
    authorDesignation: "",
    authorImage: "",
    token: localStorage.getItem("token"),
  });

  const handleOpen = (id, test, authName,authDesignation, authImg) => {
    setOpen(true);
    setEditTestimonialData({
      _id: id,
      testimonial: test,
      authorName: authName,
      authorDesignation: authDesignation,
      authorImage: authImg,
      token: localStorage.getItem("token"),
    });
  };
  const handleClose = () => setOpen(false);

  const editTestimonialChange = (e) => {
    let { value, name } = e.target;
    setEditTestimonialData({ ...editTestimonialData, [name]: value });
  };

  const getAllTestimonials = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/api/testimonials/getAllTestimonials"
      )
      .then((res) => {
        //console.log(res);
        let temp = res.data.data;
        if (filter === "All") {
          setAllTestimonial(temp);
        } else if (filter === "Activated") {
          const found = temp.filter((obj) => {
            return obj.isDeleted === false;
          });
          setAllTestimonial(found);
        } else if (filter === "Hidden") {
          const found = temp.filter((obj) => {
            return obj.isDeleted === true;
          });
          setAllTestimonial(found);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editTestimonial = (e) => {
    e.preventDefault();
    if (
      !editTestimonialData.authorName ||
      !editTestimonialData.authorImage ||
      !editTestimonialData.testimonial
    ) {
      toast.warn("Please input all the data required");
    } else if (!validator.isURL(editTestimonialData.authorImage)) {
      toast.warn("Please input valid link");
    } else {
      setEditTestimonialBtnLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            `/api/testimonials/editTestimonial`,
          editTestimonialData
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setEditTestimonialBtnLoading(false);
            setRefresh(!refresh);
            setOpen(false);
          } else {
            toast.warn(res.data.message);
            setEditTestimonialBtnLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const hideTestimonial = (id, api) => {
    setStatusTestimonialBtnLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/testimonials/${api}`, {
        testimonialID: id,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        console.log(res);
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setRefresh(!refresh);
          setStatusTestimonialBtnLoading(false);
        } else {
          toast.warn(res.data.message);
          setStatusTestimonialBtnLoading(false);
          getAllTestimonials();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllTestimonials();
  }, [refresh]);
  return (
    <div className="TestimonialsList">
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
      <div className="TestimonialsList__heading__addtest__btn">
        <h3 className="TestimonialsList__heading">All Testimonials</h3>
        <div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={filter}
            onChange={handleRadioChange}
            onClick={() => setRefresh(!refresh)}
          >
            <FormControlLabel
              label="All"
              value="All"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#00a0ad",
                    },
                  }}
                />
              }
            />
            <FormControlLabel
              label="Activated"
              value="Activated"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#00a0ad",
                    },
                  }}
                />
              }
            />
            <FormControlLabel
              label="Hidden"
              value="Hidden"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#00a0ad",
                    },
                  }}
                />
              }
            />
          </RadioGroup>
        </div>
        <AddTestimonial refresh={refresh} setRefresh={setRefresh} />
      </div>
      {allTestimonial ? (
        <div className="TestimonialsList__cards__box">
          {allTestimonial?.map((cur, ind) => {
            return (
              <div
                className={
                  cur.isDeleted === false
                    ? "TestimonialsList__card"
                    : "TestimonialsList__card__Deleted"
                }
                key={ind}
              >
                <div>
                  <img
                    className="TestimonialsList__card__img"
                    src={cur.authorImage}
                    alt={cur.authorName}
                  />
                </div>

                <div className="TestimonialsList__card__author">
                  {cur.authorName}
                </div>

                <div className="designation"> {cur.authorDesignation}</div>
                <div className="TestimonialsList__card__text">
                  “{cur.testimonial}”
                </div>
                <div className="TestimonialsList__card__btn__box">
                  {cur.isDeleted === false ? (
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
                        hideTestimonial(cur._id, "hideTestimonial")
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
                        hideTestimonial(cur._id, "listTestimonial")
                      }
                    >
                      Active
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
                    onClick={() =>
                      handleOpen(
                        cur._id,
                        cur.testimonial,
                        cur.authorName,
                        cur.authorDesignation,
                        cur.authorImage,
                      )
                    }
                    variant="outlined"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={statusTestimonialBtnLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="edit__testimonial__modal">
          <div className="edit__testimonial__form">
            <h4>Edit testimonial form</h4>
            <form onSubmit={editTestimonial}>
              <div className="edit__testimonial__textfield__box">
                <div className="edit__testimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Image"
                    variant="outlined"
                    value={editTestimonialData.authorImage}
                    name="authorImage"
                    onChange={editTestimonialChange}
                    required
                  />
                </div>
                <div className="edit__testimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Name"
                    variant="outlined"
                    value={editTestimonialData.authorName}
                    name="authorName"
                    onChange={editTestimonialChange}
                    required
                  />
                </div>
                <div className="edit__testimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Designation"
                    variant="outlined"
                    value={editTestimonialData.authorDesignation}
                    name="authorDesignation"
                    onChange={editTestimonialChange}
                    required
                  />
                </div>
                <div className="edit__testimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Testimonial"
                    multiline
                    rows={5}
                    value={editTestimonialData.testimonial}
                    name="testimonial"
                    onChange={editTestimonialChange}
                    required
                    inputProps={{
                      minLength: 10,
                    }}
                  />
                </div>
              </div>
              <div className="edit__testimonial__form__btn">
                <LoadingButton
                  fullWidth
                  type="submit"
                  loading={editTestimonialBtnLoading}
                  variant="contained"
                >
                  Submit
                </LoadingButton>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TestimonialsList;
