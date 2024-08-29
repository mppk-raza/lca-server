import React, { useState, useEffect } from "react";
import "./UpdateBannerForm.css";
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
import { CompactPicker } from "react-color";
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
const UpdateBannerForm = () => {
  const [refresh, setRefresh] = React.useState(false);
  const [openBannerModal, setOpenBannerModal] = React.useState(false);
  const [openHeadlineModal, setOpenHeadlineModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [bannerLoadingBtn, setBannerLoadingBtn] = useState(false);
  const [textColor, setTextColor] = useState("");
  const [banner, setBanner] = useState({
    altText: "",
    bannerLink: "",
    token: localStorage.getItem("token"),
  });
  const [headlineLoadingBtn, setHeadlineLoadingBtn] = useState(false);
  const [headline, setHeadline] = useState({
    headlineText: "",
    description: "",
    token: localStorage.getItem("token"),
  });
  const [getBanner, setGetBanner] = useState();
  const [getHeadline, setGetHeadline] = useState();
  const handleBannerChange = (e) => {
    let { name, value } = e.target;
    setBanner({ ...banner, [name]: value });
  };
  const handleHeadlineChange = (e) => {
    let { name, value } = e.target;
    setHeadline({ ...headline, [name]: value });
  };

  const handleOpenBannerModal = (alt, link) => {
    setOpenBannerModal(true);
    setBanner({
      altText: alt,
      bannerLink: link,
      token: localStorage.getItem("token"),
    });
  };
  const handleCloseBannerModal = () => setOpenBannerModal(false);

  const handleOpenHeadlineModal = (text, desc, color) => {
    setOpenHeadlineModal(true);
    setHeadline({
      headlineText: text,
      description: desc,
    });
    setTextColor(color);
  };
  const handleCloseHeadlineModal = () => setOpenHeadlineModal(false);

  const getHomeBanner = () => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/api/homeBanner/getHomeBanner")
      .then((res) => {
        //console.logres);
        setGetBanner(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getHomeHeadline = () => {
    setLoading(true);

    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + "/api/homeHeadline/getHomeHeadline"
      )
      .then((res) => {
        //console.log(res);
        setGetHeadline(res.data.data);
        // alert(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getHomeBanner();
    getHomeHeadline();
  }, [refresh]);

  const changeBannerSubmit = (e) => {
    e.preventDefault();
    if (!banner.altText || !banner.bannerLink) {
    } else if (!validator.isURL(banner.bannerLink)) {
      toast.warn("Please input valid link");
    } else {
      setBannerLoadingBtn(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/api/homeBanner/changeBanner",
          banner
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            //console.log(res.data.message);
          } else {
            toast.warn(res.data.message);
          }
          setBannerLoadingBtn(false);
          setRefresh(!refresh);
        })
        .catch((err) => {
          console.log(err);
          setBannerLoadingBtn(false);
        });
    }
  };
  let body = {
    token: localStorage.getItem("token"),
    headlineText: headline.headlineText,
    descriptionColor: textColor,
    description: headline.description,
    headlineColor: textColor,
  };
  //console.log(body);

  const changeHeadlineSubmit = (e) => {
    e.preventDefault();
    if (!textColor) {
      toast.warn("Please input all the data required");
    } else {
      setHeadlineLoadingBtn(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL +
            "/api/homeHeadline/changeHeadline",
          body
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            //console.log(res.data.message);
          } else {
            toast.warn(res.data.message);
          }
          setHeadlineLoadingBtn(false);
          setRefresh(!refresh);
        })
        .catch((err) => {
          console.log(err);
          setHeadlineLoadingBtn(false);
        });
    }
  };
  //console.log(textColor);
  return (
    <div className="UpdateBannerForm">
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
      {getBanner && getHeadline ? (
        <>
          <div className="banner__img__form">
            <h3>
              Banner Image{" "}
              <span style={{ fontWeight: "lighter", fontSize: "medium" }}>
                (View below as will be shown on home)
              </span>{" "}
            </h3>
            <div
              style={{
                backgroundImage: `url(${
                  getBanner && getBanner.bannerLink
                    ? getBanner.bannerLink
                    : "Loading"
                })`,
              }}
              className="banner__img"
            />
            <div className="edit__banner__btn">
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
                onClick={() =>
                  handleOpenBannerModal(getBanner.altText, getBanner.bannerLink)
                }
              >
                Modify
              </Button>
            </div>
          </div>
          <div className="banner__img__form">
            <h3>Headline</h3>
            <div className="banner__details__box">
              <div className="banner__detail">
                <div className="banner__detail__title">Headline Text: </div>
                <div className="banner__detail__text">
                  {getHeadline.headlineText}
                </div>
              </div>

              <div className="banner__detail">
                <div className="banner__detail__title">Description: </div>
                <div className="banner__detail__text">
                  {getHeadline.description}
                </div>
              </div>
            </div>
            <div className="edit__banner__btn">
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
                fullWidth
                endIcon={<EditIcon />}
                variant="outlined"
                onClick={() =>
                  handleOpenHeadlineModal(
                    getHeadline.headlineText,
                    getHeadline.description,
                    getHeadline.headlineColor
                  )
                }
              >
                Modify
              </Button>
            </div>
          </div>

          <Modal
            open={openBannerModal}
            onClose={handleCloseBannerModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="banner__modal">
              <div>
                <form onSubmit={changeBannerSubmit}>
                  <h3 className="banner__img__heading">Change Banner Image</h3>
                  <div className="Banner__img__textfield__container">
                    <div className="Banner__img__textfield">
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        label="Image Link"
                        required
                        name="bannerLink"
                        value={banner.bannerLink}
                        onChange={handleBannerChange}
                      />
                    </div>
                    <div className="Banner__img__textfield  ">
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        label="Alternate Text"
                        required
                        name="altText"
                        value={banner.altText}
                        onChange={handleBannerChange}
                      />
                    </div>
                  </div>
                  <div className="Banner__img__btn">
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
                      loading={bannerLoadingBtn}
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
          <Modal
            open={openHeadlineModal}
            onClose={handleCloseHeadlineModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="headline__modal">
              <div>
                <form onSubmit={changeHeadlineSubmit}>
                  <h3 className="banner__img__heading">
                    Change Headline Text & Color
                  </h3>
                  <div className="Banner__img__textfield">
                    <div className="Banner__img__textfield">
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        label="Headline Text"
                        name="headlineText"
                        value={headline.headlineText}
                        onChange={handleHeadlineChange}
                      />
                    </div>
                    <div className="Banner__img__textfield  ">
                      <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        variant="outlined"
                        label="Description"
                        multiline
                        rows={4}
                        name="description"
                        value={headline.description}
                        onChange={handleHeadlineChange}
                      />
                    </div>
                    <div className="Banner__text__color__box">
                      <div className="Banner__text__color__heading">
                        Text Color
                      </div>
                      <CompactPicker
                        color={textColor}
                        onChange={(color) => setTextColor(color.hex)}
                      />
                    </div>
                  </div>
                  <div className="Banner__img__btn">
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
                      loading={headlineLoadingBtn}
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
        </>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
};

export default UpdateBannerForm;
