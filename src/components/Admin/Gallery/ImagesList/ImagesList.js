import React, { useState, useEffect } from "react";
import "./ImagesList.css";
import AddImage from "../AddImage/AddImage";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Backdrop from "@mui/material/Backdrop";
import ReplayIcon from "@mui/icons-material/Replay";
import { Button } from "@mui/material";
import CoursesPagination from "../../../CoursesPagination/CoursesPagination";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  p: 4,
};
const ImagesList = () => {
  const [imgHover, setImgHover] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [filter, setFilter] = useState("All");
  const [refresh, setRefresh] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setViewImage(true);
  const handleClose = () => setViewImage(false);

  const pageSize = 20;
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const handleRadioChange = (event) => {
    setFilter(event.target.value);
  };
  const nextImage = () => {
    const isLastSlide = imageIndex === imagesList.length - 1;
    const newIndex = isLastSlide ? 0 : imageIndex + 1;
    setImageIndex(newIndex);
  };
  const previousImage = () => {
    const isFirstSlide = imageIndex === 0;
    const newIndex = isFirstSlide ? imagesList.length - 1 : imageIndex - 1;
    setImageIndex(newIndex);
  };
  const handleViewImage = (index, open) => {
    setImageIndex(index);
    setViewImage(open);
  };
  const [imagesList, setImagesList] = useState();
  const getAllGalleryMedia = () => {
    setOpen(true);
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + "/api/gallery/getAllGalleryMedia"
      )
      .then((res) => {
        //console.log(res);

        let temp = res.data.data;
        if (filter === "All") {
          setImagesList(temp);
          setPagination({ ...pagination, count: temp.length });
        } else if (filter === "Activated") {
          const found = temp.filter((obj) => {
            return obj.isDeleted === false;
          });
          setImagesList(found);
          setPagination({ ...pagination, count: found.length });
        } else if (filter === "Hidden") {
          const found = temp.filter((obj) => {
            return obj.isDeleted === true;
          });
          setImagesList(found);
          setPagination({ ...pagination, count: found.length });
        }
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };
  useEffect(() => {
    getAllGalleryMedia();
  }, [refresh]);
  const activeDeleteGalleryMedia = (id, api) => {
    // //console.log(id);
    setOpen(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/gallery/${api}`, {
        mediaIDs: id,
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        //console.log(res);
        if (res.data.error !== true) {
          toast.success(res.data.message);
          setRefresh(!refresh);
          setOpen(false);
          setViewImage(false);
        } else {
          toast.warn(res.data.message);
          setOpen(false);
        }
      })
      .catch((err) => {
        //console.log(err);
        setOpen(false);
      });
  };
  return (
    <>
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
      {imagesList ? (
        <div className="imagesList">
          <div className="imagesList__heading">
            <h3>Gallery</h3>
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
            <AddImage refresh={refresh} setRefresh={setRefresh} />
          </div>
          <div className="imagesList__box">
            {imagesList
              ?.slice(pagination.from, pagination.to)
              .map((cur, ind) => {
                return (
                  <div
                    key={ind}
                    className={
                      cur.isDeleted === false
                        ? "imagesList__img__btn__box"
                        : "imagesList__img__btn__box__deleted"
                    }
                  >
                    <div
                      key={ind}
                      className="imagesList__img"
                      onMouseEnter={() => setImgHover(cur._id)}
                      onMouseLeave={() => setImgHover(null)}
                      onClick={() => handleViewImage(ind, true)}
                      style={{
                        backgroundImage: `url(${cur.imageLink})`,
                        width: "100%",
                        height: "100%",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      {/* // <img height="auto" width="100%" src={cur.imageLink} /> */}
                      {imgHover === cur._id ? (
                        <div className="imagesList__img__text__box">
                          <div className="imagesList__img__text">
                            {cur.altText}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {cur.isDeleted === true ? (
                      <Button
                        onClick={() =>
                          activeDeleteGalleryMedia(cur._id, "listGalleryMedia")
                        }
                        color="success"
                        startIcon={<ReplayIcon color="success" />}
                      >
                        Active
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          activeDeleteGalleryMedia(cur._id, "deleteGalleryMedia")
                        }
                        color="error"
                        startIcon={<DeleteIcon color="error" />}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
          <CoursesPagination
            pageSize={pageSize}
            pagination={pagination}
            setPagination={setPagination}
          />
          <Modal
            open={viewImage}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="view__imgList__box">
                <div
                  className="close__imgList__btn"
                  onClick={() => setViewImage(false)}
                >
                  <CloseIcon />
                </div>
                <div className="slide__btn__imgList__container">
                  <div className="slide__imgList__btn" onClick={previousImage}>
                    <ArrowBackIosNewIcon />
                  </div>
                  <div
                    className="view__imgList"
                    style={{
                      backgroundImage: `url(${imagesList[imageIndex].imageLink})`,
                      margin: "auto",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* {imagesList[imageIndex]._id} */}
                  </div>
                  <div className="slide__imgList__btn" onClick={nextImage}>
                    <ArrowForwardIosIcon />
                  </div>
                </div>
                <div className="slide__imgList__text">
                  Event : {imagesList[imageIndex].event}<br />
                  Alt Text : {imagesList[imageIndex].altText}<br /><br />
                  {imagesList[imageIndex].isDeleted === true ? (
                    <Button
                      onClick={() =>
                        activeDeleteGalleryMedia(
                          imagesList[imageIndex]._id,
                          "listGalleryMedia"
                        )
                      }
                      variant='contained'
                      color="success"
                      startIcon={<ReplayIcon />}
                    >
                      Active
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        activeDeleteGalleryMedia(
                          imagesList[imageIndex]._id,
                          "deleteGalleryMedia"
                        )
                      }
                      variant='contained'
                      color="error"
                      startIcon={
                        <DeleteIcon  />
                      }
                    >
                      Delete
                    </Button>
                  )}
                </div>
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

export default ImagesList;
