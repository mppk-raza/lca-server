import React, { useState, useEffect } from "react";
import "./Video.css";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
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
const Video = () => {
  const [getVideo, setGetVideo] = useState();
  const [video, setVideo] = useState();
  const [open, setOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpenVideoModal = (video) => {
    setVideo(video);
    setOpen(true);
  };

  const getHomeVideo = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/homeBanner/getHomeVideo")
      .then((res) => {
        console.log(res);
        setGetVideo(res.data.data.bannerLink);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!video) {
      toast.warn("Please fill the data");
    } else if (!validator.isURL(video)) {
      toast.warn("Please input valid link");
    } else {
      setLoadingBtn(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/homeBanner/changeHomeVideo",
          { token: localStorage.getItem("token"), videoLink: video },
        )
        .then((res) => {
          console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setOpen(false);
          } else {
            toast.warn(res.data.message);
          }
          setLoadingBtn(false);
          setRefresh(!refresh);
        })
        .catch((err) => {
          console.log(err);
          setLoadingBtn(false);
        });
    }
  };
  useEffect(() => {
    getHomeVideo();
  }, [refresh]);

  return (
    <>
      {!loading ? (
        <div className="Video">
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
          <h3 className="Video__heading"> Video </h3>
          <div className="Video__box">
            <video controls src={getVideo} />
          </div>
          <div className="Video__btn">
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
              fullWidth
              endIcon={<EditIcon />}
              onClick={() => handleOpenVideoModal(getVideo)}
            >
              Modify
            </Button>
          </div>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="Video__modal">
              <div>
                <form onSubmit={handleSubmit}>
                  <h3 className="Video__modal__heading">Change Video</h3>
                  <div className="Video__modal__textfield__container">
                    <div className="Video__modal__textfield">
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        label="Video Link"
                        required
                        value={video}
                        onChange={(e) => setVideo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="Video__modal__btn">
                    <LoadingButton
                      sx={{
                        bgcolor: "#00a0ad",
                        color: "#41424C",
                        borderColor: "#41424C",
                        "&:hover": {
                          backgroundColor: "#41424C",
                          color: "#00a0ad",
                        },
                      }}
                      fullWidth
                      loading={loadingBtn}
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>
        </div>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Video;
