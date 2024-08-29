import React, { useState, useEffect } from "react";
import "./LearningPartnersList.css";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import AddLearningPartner from "../AddLearningPartner/AddLearningPartner";
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

const LearningPartnersList = () => {
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [filter, setFilter] = useState("All");

  const [editLearningPartnerBtnLoading, setEditLearningPartnerBtnLoading] =
    useState(false);
  const [statusLearningPartnerBtnLoading, setStatusLearningPartnerBtnLoading] =
    useState(false);

  const handleRadioChange = (event) => {
    setFilter(event.target.value);
  };
  const [allLearningPartner, setAllLearningPartner] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [hideLearningPartnerData, setHideLearningPartnerData] = useState({
    LearningPartnerID: "",
    token: localStorage.getItem("token"),
  });
  const [editLearningPartnerData, setEditLearningPartnerData] = useState({
    _id: "",
    LearningPartner: "",
    authorName: "",
    authorDesignation: "",
    authorImage: "",
    token: localStorage.getItem("token"),
  });

  const handleOpen = (id, test, authName,authDesignation, authImg) => {
    setOpen(true);
    setEditLearningPartnerData({
      _id: id,
      testimonial: test,
      authorName: authName,
      authorDesignation: authDesignation,
      authorImage: authImg,
      token: localStorage.getItem("token"),
    });
  };
  const handleClose = () => setOpen(false);

  const editLearningPartnerChange = (e) => {
    let { value, name } = e.target;
    setEditLearningPartnerData({ ...editLearningPartnerData, [name]: value });
  };

  const getAllLearningPartners = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          "/api/LearningPartners/getAllTestimonials"
      )
      .then((res) => {
        console.log(res);

        if(!res.data.error){
          let temp = res.data.data;
          if (filter === "All") {
            setAllLearningPartner(temp);
          } else if (filter === "Activated") {
            const found = temp.filter((obj) => {
              return obj.isDeleted === false;
            });
            setAllLearningPartner(found);
          } else if (filter === "Hidden") {
            const found = temp.filter((obj) => {
              return obj.isDeleted === true;
            });
            setAllLearningPartner(found);
          }
        }
        else{
          setErrorMessage(res.data.message);
          setAllLearningPartner([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editLearningPartner = (e) => {
    e.preventDefault();
    if (
      !editLearningPartnerData.authorName ||
      !editLearningPartnerData.authorImage ||
      !editLearningPartnerData.testimonial
    ) {
      toast.warn("Please input all the data required");
    } else if (!validator.isURL(editLearningPartnerData.authorImage)) {
      toast.warn("Please input valid link");
    } else {
      setEditLearningPartnerBtnLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            `/api/LearningPartners/editTestimonial`,
          editLearningPartnerData
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setEditLearningPartnerBtnLoading(false);
            setRefresh(!refresh);
            setOpen(false);
          } else {
            toast.warn(res.data.message);
            setEditLearningPartnerBtnLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const hideLearningPartner = (id, api) => {
    setStatusLearningPartnerBtnLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/LearningPartners/${api}`, {
        testimonialID: id,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        console.log(res);
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setRefresh(!refresh);
          setStatusLearningPartnerBtnLoading(false);
        } else {
          toast.warn(res.data.message);
          setStatusLearningPartnerBtnLoading(false);
          getAllLearningPartners();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllLearningPartners();
  }, [refresh]);
  return (
    <div className="LearningPartnersList">
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
      <div className="LearningPartnersList__heading__addtest__btn">
        <h3 className="LearningPartnersList__heading">All Learning Partners</h3>
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
        <AddLearningPartner refresh={refresh} setRefresh={setRefresh} />
      </div>
      {errorMessage ? (
        <div className="LearningPartnersList__card__author">
          {errorMessage}
        </div>
      ) : allLearningPartner ? (
        <div className="LearningPartnersList__cards__box">
          {allLearningPartner?.map((cur, ind) => {
            return (
              <div
                className={
                  cur.isDeleted === false
                    ? "LearningPartnersList__card"
                    : "LearningPartnersList__card__Deleted"
                }
                key={ind}
              >
                <div>
                  <img
                    className="LearningPartnersList__card__img"
                    src={cur.authorImage}
                    alt={cur.authorName}
                  />
                </div>

                <div className="LearningPartnersList__card__author">
                  {cur.authorName}
                </div>

                <div className="designation"> {cur.authorDesignation}</div>
                <div className="LearningPartnersList__card__text">
                  “{cur.testimonial}”
                </div>
                <div className="LearningPartnersList__card__btn__box">
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
                        hideLearningPartner(cur._id, "hideTestimonial")
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
                        hideLearningPartner(cur._id, "listTestimonial")
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
            open={statusLearningPartnerBtnLoading}
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
        <Box sx={style} className="edit__LearningPartner__modal">
          <div className="edit__LearningPartner__form">
            <h4>Edit Learning Partner form</h4>
            <form onSubmit={editLearningPartner}>
              <div className="edit__LearningPartner__textfield__box">
                <div className="edit__LearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Image"
                    variant="outlined"
                    value={editLearningPartnerData.authorImage}
                    name="authorImage"
                    onChange={editLearningPartnerChange}
                    required
                  />
                </div>
                <div className="edit__LearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Name"
                    variant="outlined"
                    value={editLearningPartnerData.authorName}
                    name="authorName"
                    onChange={editLearningPartnerChange}
                    required
                  />
                </div>
                <div className="edit__LearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Designation"
                    variant="outlined"
                    value={editLearningPartnerData.authorDesignation}
                    name="authorDesignation"
                    onChange={editLearningPartnerChange}
                    required
                  />
                </div>
                <div className="edit__LearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Testimonial"
                    multiline
                    rows={5}
                    value={editLearningPartnerData.testimonial}
                    name="testimonial"
                    onChange={editLearningPartnerChange}
                    required
                    inputProps={{
                      minLength: 10,
                    }}
                  />
                </div>
              </div>
              <div className="edit__LearningPartner__form__btn">
                <LoadingButton
                  fullWidth
                  type="submit"
                  loading={editLearningPartnerBtnLoading}
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

export default LearningPartnersList;
