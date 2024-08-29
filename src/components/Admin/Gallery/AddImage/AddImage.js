import React from "react";
import "./AddImage.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
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

const AddImage = ({ refresh, setRefresh }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [imageData, setImageData] = React.useState({
    altText: "",
    event: "",
    imageLink: "",
  });
  const handleChange = (e) => {
    let { name, value } = e.target;
    setImageData({ ...imageData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(imageData);
    if (!imageData.altText || !imageData.event || !imageData.imageLink) {
      toast.warn("Please input all the data required");
    } else if (!validator.isURL(imageData.imageLink)) {
      toast.warn("Please input valid link");
    } else {
      setLoading(true);
      let myImgData = imageData;
      if (!myImgData.event || myImgData.event === "") {
        myImgData.event = "other";
      }
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/gallery/uploadGalleryMedia",
          { newMedia: myImgData, token: localStorage.getItem("token") }
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setLoading(false);
            setOpen(false);
            setImageData({
              altText: "",
              imageLink: "",
              event: "",
            });
            setRefresh(!refresh);
          } else {
            toast.warn(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  return (
    <div className="AddImage">
      <Button
        sx={{
          bgcolor: "#00a0ad",
          color: "#41424C",
          borderColor: "#41424C",
          "&:hover": {
            backgroundColor: "#41424C",
            color: "#00a0ad",
          },
        }}
        variant="contained"
        onClick={handleOpen}
      >
        Add Image
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="AddImage__modal">
          <div>
            <div className="AddImage__form">
              <h3>Add Image Form</h3>
              <form onSubmit={handleSubmit}>
                <div className="AddImage__textfield__container">
                  <div className="AddImage__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Image Link"
                      required
                      name="imageLink"
                      value={imageData.imageLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="AddImage__textfield  ">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Alternate Text"
                      required
                      name="altText"
                      value={imageData.altText}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="AddImage__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Event of Image"
                      required={false}
                      name="event"
                      value={imageData.event}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="AddImage__btn">
                  <LoadingButton
                    fullWidth
                    loading={loading}
                    variant="contained"
                    type="submit"
                    sx={{
                      bgcolor: "#00a0ad",
                      color: "#41424C",
                      borderColor: "#41424C",
                      "&:hover": {
                        backgroundColor: "#41424C",
                        color: "#00a0ad",
                      },
                    }}
                  >
                    Submit
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddImage;
