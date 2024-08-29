import React, { useState } from "react";
import "./AddLearningPartner.css";
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

const AddLearningPartner = ({ refresh, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [addLearningPartnerBtnLoading, setAddLearningPartnerBtnLoading] =
    useState(false);
  const [addLearningPartnerData, setAddLearningPartnerData] = useState({
    testimonial: "",
    authorName: "",
    authorDesignation: "",
    authorImage: "",
    token: localStorage.getItem("token"),
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addLearningPartner = (e) => {
    e.preventDefault();
    if (
      !addLearningPartnerData.authorName ||
      !addLearningPartnerData.authorDesignation ||
      !addLearningPartnerData.authorImage ||
      !addLearningPartnerData.testimonial 
    ) {
      toast.warn("Please input all the data required");
    } else if (!validator.isURL(addLearningPartnerData.authorImage)) {
      toast.warn("Please input valid link");
    } else {
      setAddLearningPartnerBtnLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            `/api/LearningPartners/addTestimonial`,
          addLearningPartnerData
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setAddLearningPartnerBtnLoading(false);
            setRefresh(!refresh);
            setOpen(false);
            setAddLearningPartnerData({
              testimonial: "",
              authorName: "",
              authorDesignation: "",
              authorImage: "",
              token: localStorage.getItem("token"),
            });
          } else {
            toast.warn(res.data.message);
            setAddLearningPartnerBtnLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setAddLearningPartnerBtnLoading(false);
        });
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setAddLearningPartnerData({ ...addLearningPartnerData, [name]: value });
  };

  return (
    <div className="AddLearningPartner">
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
        Add New Learning Partner
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="AddLearningPartner__modal">
          <div className="AddLearningPartner__form">
            <h3>Add Learning Partner</h3>
            <form onSubmit={addLearningPartner}>
              <div className="AddLearningPartner__textfield__box">
                <div className="AddLearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Image URL"
                    variant="outlined"
                    value={addLearningPartnerData.authorImage}
                    name="authorImage"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddLearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Name"
                    variant="outlined"
                    value={addLearningPartnerData.authorName}
                    name="authorName"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddLearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Author Designation"
                    variant="outlined"
                    value={addLearningPartnerData.authorDesignation}
                    name="authorDesignation"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 3,
                    }}
                  />
                </div>
                <div className="AddLearningPartner__textfield">
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Testimonial"
                    multiline
                    rows={5}
                    value={addLearningPartnerData.LearningPartner}
                    name="testimonial"
                    onChange={handleChange}
                    required
                    inputProps={{
                      minLength: 10,
                    }}
                  />
                </div>
              </div>
              <div className="AddLearningPartner__form__btn">
                <LoadingButton
                  fullWidth
                  type="submit"
                  loading={addLearningPartnerBtnLoading}
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

export default AddLearningPartner;
