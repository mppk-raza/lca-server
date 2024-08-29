import React, { useState } from "react";
import "./AddEmployees.css";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import TextField from "@mui/material/TextField";
import UploadFile from "../UploadFile/UploadFile";
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
const AddEmployees = ({ refresh, setRefresh,setLoading }) => {
  const [addEmployeeData, setAddEmployeeData] = useState({
    token: localStorage.getItem("token"),
    empid: "",
    empname: "",
    empdesignation: "",
    empgrade: "",
    empdivisions: "",
    emplinemanagerid: "",
    emplinemanagername: "",
    empemail: "",
  });
  const [open, setOpen] = React.useState(false);
  const [addEmployeeLoadingBtn, setAddEmployeeLoadingBtn] =
    React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const addEmpHandleChange = (e) => {
    let { name, value } = e.target;
    setAddEmployeeData({ ...addEmployeeData, [name]: value });
  };
  const addEmpHandleSubmit = (e) => {
    e.preventDefault();
    if (
      !addEmployeeData.empdesignation ||
      !addEmployeeData.empdivision ||
      !addEmployeeData.empemail ||
      !addEmployeeData.empgrade ||
      !addEmployeeData.empid ||
      !addEmployeeData.emplinemanagerid ||
      !addEmployeeData.emplinemanagername ||
      !addEmployeeData.empname
    ) {
      toast.warn("Please fill the data");
    } else if (!validator.isEmail(addEmployeeData.empemail)) {
      toast.warn("Please enter valid email");
    } else {
      //console.log(addEmployeeData);
      setAddEmployeeLoadingBtn(true);
      axios
        .post(
          // "http://localhost:7000" + `/api/users/addUser_Admin`,
          process.env.REACT_APP_BACKEND_URL + `/api/users/addUser_Admin`,
          addEmployeeData
        )
        .then((res) => {
          //console.log(res);
          if (res.data.error !== true) {
            toast.success(res.data.message);
            setAddEmployeeLoadingBtn(false);
            setRefresh(!refresh);
            setOpen(false);
            setAddEmployeeData({
              token: localStorage.getItem("token"),
              empid: "",
              empname: "",
              empdesignation: "",
              empgrade: "",
              empdivision: "",
              emplinemanagerid: "",
              emplinemanagername: "",
              empemail: "",
            });
          } else {
            toast.warn(res.data.message);
            setAddEmployeeLoadingBtn(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setAddEmployeeLoadingBtn(false);
        });
    }
  };
  return (
    <div>
      <div className="AddEmployees__btn__box">
        <div className="AddEmployees__btn">
          <Button variant="contained" onClick={handleOpen}>
            Add Employees
          </Button>
        </div>
        <div className="AddEmployees__btn">
        <UploadFile refresh={refresh} setRefresh={setRefresh} setLoading={setLoading}/>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="AddEmployees__modal">
          <div className="AddEmployees__form">
            <h4>Add Employee form</h4>
            <form onSubmit={addEmpHandleSubmit}>
              <div className="AddEmployees__textfield__box">
                <div className="AddEmployees__textfield__container">
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee Name"
                      name="empname"
                      value={addEmployeeData.empname}
                      onChange={addEmpHandleChange}
                      required
                      inputProps={{
                        minLength: 3,
                      }}
                      onKeyPress={(event) => {
                        if (/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee ID"
                      name="empid"
                      value={addEmployeeData.empid}
                      onChange={addEmpHandleChange}
                      required
                    />
                  </div>
                </div>
                <div className="AddEmployees__textfield__container">
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee Email"
                      name="empemail"
                      value={addEmployeeData.empemail}
                      onChange={addEmpHandleChange}
                      required
                      inputProps={{
                        minLength: 8,
                      }}
                    />
                  </div>
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee Grade"
                      name="empgrade"
                      value={addEmployeeData.empgrade}
                      onChange={addEmpHandleChange}
                      required
                    />
                  </div>
                </div>
                <div className="AddEmployees__textfield__container">
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee Designation"
                      name="empdesignation"
                      value={addEmployeeData.empdesignation}
                      onChange={addEmpHandleChange}
                      required
                      inputProps={{
                        minLength: 3,
                      }}
                    />
                  </div>
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Employee Division"
                      name="empdivision"
                      value={addEmployeeData.empdivision}
                      onChange={addEmpHandleChange}
                      required
                      inputProps={{
                        minLength: 3,
                      }}
                    />
                  </div>
                </div>
                <div className="AddEmployees__textfield__container">
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Manager Name"
                      name="emplinemanagername"
                      value={addEmployeeData.emplinemanagername}
                      onChange={addEmpHandleChange}
                      required
                      inputProps={{
                        minLength: 3,
                      }}
                      onKeyPress={(event) => {
                        if (/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="AddEmployees__textfield">
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      variant="outlined"
                      label="Manager ID"
                      name="emplinemanagerid"
                      value={addEmployeeData.emplinemanagerid}
                      onChange={addEmpHandleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="edit__testimonial__form__btn">
                <LoadingButton
                  type="submit"
                  loading={addEmployeeLoadingBtn}
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

export default AddEmployees;
