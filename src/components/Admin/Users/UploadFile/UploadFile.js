import React, { useState } from "react";
import "./UploadFile.css";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCSVReader } from "react-papaparse";
import UploadedEmpTable from "../UploadedEmpTable/UploadedEmpTable";
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
const UploadFile = ({ refresh, setRefresh, setLoading }) => {
  const { CSVReader } = useCSVReader();
  const [response, setResponse] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openResModal, setOpenResModal] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [MessageText, setMessageText] = React.useState(null);
  const [Data, setData] = React.useState(null);
  const [LoadingBtn, setLoadingBtn] = React.useState(null);

  async function handleSubmit() {
    if (Data && Data.length > 0) {
      setLoading(true);
      setLoadingBtn(true);
      const chunkSize = 50;
      let NEW = 0;
      let UPDATED = 0;
      let data = null;
      for (let i = 0; i < Data.length; i += chunkSize) {
        const chunk = Data.slice(i, i + chunkSize);
        //console.log("chunk")
        //console.log(chunk)
        //console.log("i")
        //console.log(i)
        //console.log("body")
        //console.log({ empArray: chunk, token: localStorage.getItem("token") })
        ////console.log("NEW Before")
        ////console.log(NEW)
        data = await axios.post(process.env.REACT_APP_BACKEND_URL + `/api/employees/bulkRewriteEmployeesv3`, { empArray: chunk, token: localStorage.getItem("token") })
          .then((res) => {
            //console.log(res);
            return res.data
          })
          .catch((err) => {
            //csonsole.log(err);
            return 0;
          });
        // //console.log(data);
        NEW = NEW + data.new;
        UPDATED = UPDATED + data.update;
        ////console.log("NEW After")
        ////console.log(NEW)
        setMessageText(
          "Employees Added : " + NEW + '\n' +
          "Employees Updated : " + UPDATED + '\n'
        );
      }
      setLoading(false);
      setLoadingBtn(false);
      toast.success("File upload successfully! " + NEW + " new employees added. " + UPDATED + " employees updated.")
      setMessageText(
        "Employees Added : " + NEW + '\n' +
        "Employees Updated : " + UPDATED + '\n'
      )

      // if (error) {
      //   toast.error("The file upload was unsuccessful. Please re-upload file and try again.")
      // } else {
      //   setOpen(false);
      // }

    }
  }
  // async function getData() {
  //   const firstRequest = await FiberNew();
  //   // data1 = firstRequest.data[0];
  //   // if (!data1){
  //   //     const secondRequest = await axios.get(`${<URL2>}`);
  //   //     data1 = secondRequest.data;
  //   // }
  //   // return data1;
  // }

  function manipulateData(data) {
    let arrayOfObjects = [];
    ////console.log(data)
    for (var i = 1; i < data.length - 1; i++) {
      let myObj = {
        empid: data[i][0] ? data[i][0] : "Not Available",
        empname: data[i][1] ? data[i][1] : "Not Available",
        empdesignation: data[i][2] ? data[i][2] : "Not Available",
        empgrade: data[i][3] ? data[i][3] : "Not Available",
        empdivision: data[i][4] ? data[i][4] : "Not Available",
        emplinemanagerid: data[i][5] ? data[i][5] : "Not Available",
        emplinemanagername: data[i][6] ? data[i][6] : "Not Available",
        empemail: data[i][7] ? data[i][7] : "NotAvailable@NA.com",
      };
      arrayOfObjects.push(myObj);
    }
    return arrayOfObjects;
  }
  return (
    <div>
      <div className="UploadFile__btn__box">
        {response.length > 0 ?

          <UploadedEmpTable
            openResModal={openResModal} setOpenResModal={setOpenResModal}
            response={response}
          />
          : null
        }
        <Button variant="contained" onClick={handleOpen}>
          Upload File
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="UploadFile__modal">
          <CSVReader
            accept={".csv"}
            onUploadRejected={(results) => {
              if (results[0].errors[0].message) {
                toast.warn(results[0].errors[0].message);
              } else {
                toast.warn("An unexpected error occurred. Please try again");
              }
            }}
            onUploadAccepted={(results) => {
              // setData(null);
              // setMessageText(null);
              setData(manipulateData(results.data));
              setMessageText("File uploaded and processed. Ready to submit!");
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
            }) => (
              <>
                <div className="UploadFill__file">
                  {" "}
                  {acceptedFile && acceptedFile.name ? (
                    acceptedFile && acceptedFile.name
                  ) : (
                    <span style={{ color: "gray" }}>No file uploaded</span>
                  )}{" "}
                </div>
                <ProgressBar className="UploadFill__progressBar" />
                <div className="UploadFill__btn__box">
                  {acceptedFile ? (
                    <Button
                      variant="contained"
                      color="error"
                      {...getRemoveFileProps()}
                      className="UploadFill__btn"
                    >
                      Remove File
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      {...getRootProps()}
                      className="UploadFill__btn"
                    >
                      Browse file
                    </Button>
                  )}
                </div>
                {acceptedFile && Data && Data.length > 0 ? (
                  <div className="FileContentSection">
                    <div className="FileContentSection__Message">
                      {MessageText ? MessageText : "Loading..."}
                    </div>
                    <div className="FileContentSection__Info__One">
                      {" "}
                      Number of Employees fetched from file :{" "}
                      {Data && Data.length ? Data.length : "Processing.."}
                    </div>
                    {LoadingBtn ? (
                      <LoadingButton
                        className="UploadFill__btn"
                        variant="contained"
                        loading
                      >
                        Submit
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        className="UploadFill__btn"
                        color="success"
                        variant="contained"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Submit
                      </LoadingButton>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </CSVReader>
        </Box>
      </Modal>

    </div>
  );
};

export default UploadFile;
