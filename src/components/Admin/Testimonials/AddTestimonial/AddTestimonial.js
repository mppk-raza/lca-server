import React, { useState } from "react";
import "./AddTestimonial.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
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

const AddTestimonial = ({ refresh, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [addTestimonialBtnLoading, setAddTestimonialBtnLoading] =
    useState(false);
  const [addTestimonialData, setAddTestimonialData] = useState({
    testimonial: "",
    authorName: "",
    authorDesignation: "",
    authorImage: "",
    token: localStorage.getItem("token"),
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addTestimonial = (e) => {
    e.preventDefault();
    if (
      !addTestimonialData.authorName ||
      !addTestimonialData.authorDesignation ||
      !addTestimonialData.authorImage ||
      !addTestimonialData.testimonial 
    ) {
      toast.warn("Please input all the data required");
    } else if (!validator.isURL(addTestimonialData.authorImage)) {
      toast.warn("Please input valid link");
    } else {
      setAddTestimonialBtnLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            `/api/testimonials/addTestimonial`,
          addTestimonialData
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setAddTestimonialBtnLoading(false);
            setRefresh(!refresh);
            setOpen(false);
            setAddTestimonialData({
              testimonial: "",
              authorName: "",
              authorDesignation: "",
              authorImage: "",
              token: localStorage.getItem("token"),
            });
          } else {
            toast.warn(res.data.message);
            setAddTestimonialBtnLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setAddTestimonialBtnLoading(false);
        });
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setAddTestimonialData({ ...addTestimonialData, [name]: value });
  };

  return (
    <div className="AddTestimonial">
      <Button
        sx={{
          bgcolor: "#41424C",
          color: "#00a0ad",
          borderColor: "#00a0ad",
          "&:hover": {
            backgroundColor: "#00a0ad",
            color: "#41424C",
            borderColor: "#41424C",
          },
          "&:active": { backgroundColor: "#00a0ad" },
        }}
        variant="contained"
        onClick={handleOpen}
      >
        Add New Testimonial
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="AddTestimonial__modal">
          <div className="AddTestimonial__form">
            <h3>Add Testimonial</h3>
            <form onSubmit={addTestimonial}>
              <div className="AddTestimonial__textfield__box">
                <div className="AddTestimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Image URL"
                    variant="outlined"
                    value={addTestimonialData.authorImage}
                    name="authorImage"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddTestimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Name"
                    variant="outlined"
                    value={addTestimonialData.authorName}
                    name="authorName"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddTestimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Designation"
                    variant="outlined"
                    value={addTestimonialData.authorDesignation}
                    name="authorDesignation"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddTestimonial__textfield">
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Testimonial"
                    multiline
                    rows={5}
                    value={addTestimonialData.testimonial}
                    name="testimonial"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 10,
                    }}
                  />
                </div>
              </div>
              <div className="AddTestimonial__form__btn">
                <LoadingButton
                  fullWidth
                  type="submit"
                  loading={addTestimonialBtnLoading}
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

export default AddTestimonial;
