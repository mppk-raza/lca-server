import React, { useState } from "react";
import "./UsersTable.css";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const UsersTable = ({
  users,
  value,
  refresh,
  setRefresh,
  setLoading,
  searchUser,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    setOpen(false);
  };

  const handleClickOpenDialogEdit = () => {
    setOpenDialogEdit(true);
    setOpenEdit(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
  };

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [viewData, setViewData] = React.useState({
    id: "",
    Action: "",
    Email: "",
    Name: "",
    Occupation: "",
    Organization: "",
    Department: "",
    Status: "",
    dateCreated: "",
    EmployeeInfo: {},
    users: null,
  });

  const [editEmployeeData, setEditEmployeeData] = useState({
    token: localStorage.getItem("token"),
    id: "",
    empdesignation: "",
    empid: "",
    empgrade: "",
    empdivision: "",
    emplinemanagerid: "",
    emplinemanagername: "",
  });

  const editEmpHandleChange = (e) => {
    let { name, value } = e.target;
    setEditEmployeeData({ ...editEmployeeData, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }
  const handleDeleteApi = (id, api) => {
    //console.log(id, api);
    const body = {
      token: localStorage.getItem("token"),
      userID: id,
    };
    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/users/${api}`, body)
      .then((res) => {
        //console.log(res);
        if (res.data.error === false) {
          toast.success(res.data.message);
        } else {
          toast.warn(res.data.message);
        }
        setRefresh(!refresh);
        setLoading(false);
        setOpenDialog(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleEditApi = (editEmpData, api) => {

    console.log(editEmpData, api);

    const body = {
      token: localStorage.getItem("token"),
      userID: editEmpData.id,
      empdesignation: editEmpData.empdesignation,
      empid: editEmpData.empid,
      empgrade: editEmpData.empgrade,
      empdivision: editEmpData.empdivision,
      emplinemanagerid: editEmpData.emplinemanagerid,
      emplinemanagername: editEmpData.emplinemanagername,
    };

    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/users/${api}`, body)
      .then((res) => {
        //console.log(res);
        if (res.data.error === false) {
          toast.success(res.data.message);
        } else {
          toast.warn(res.data.message);
        }
        setRefresh(!refresh);
        setOpenDialogEdit(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
  };
  const handleApisCall = (id, api) => {
    const body = {
      token: localStorage.getItem("token"),
      userIDs: id,
    };
    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/api/users/${api}`, body)
      .then((res) => {
        //console.log(res);
        if (res.data.error === false) {
          toast.success(res.data.message);
        } else {
          toast.warn(res.data.message);
        }
        setRefresh(!refresh);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const viewUser = (userData) => {
    // console.log(userData);
    setOpen(true);
    setViewData({
      id: userData.id,
      Status: userData.Status,
      Email: userData.Email,
      Name: userData.Name,
      Occupation: userData.Occupation,
      Organization: userData.Organization,
      Department: userData.Department,
      Status: userData.Status,
      dateCreated: userData.dateCreated,
      EmployeeInfo: userData.EmployeeInfo,
      users: userData.users,
    });
  };

  const editUser = (userData) => {
    // console.log(userData);
    setOpenEdit(true);
    setViewData({
      id: userData.id,
      Status: userData.Status,
      Email: userData.Email,
      Name: userData.Name,
      Occupation: userData.Occupation,
      Organization: userData.Organization,
      Department: userData.Department,
      Status: userData.Status,
      dateCreated: userData.dateCreated,
      EmployeeInfo: userData.EmployeeInfo,
      users: userData.users,
    });

    if(userData.EmployeeInfo){
      setEditEmployeeData({
        id: userData.id,
        empid: userData.EmployeeInfo.empid,
        empdesignation: userData.Occupation,
        empgrade: userData.EmployeeInfo.empgrade,
        empdivision: userData.Department,
        emplinemanagerid: userData.EmployeeInfo.emplinemanagerid,
        emplinemanagername: userData.EmployeeInfo.emplinemanagername,
  
      });
    }
    else{
      setEditEmployeeData({
        id: userData.id,
        empdesignation: userData.Occupation,
        empid: "",
        empgrade: "",
        empdivision: userData.Department,
        emplinemanagerid: "",
        emplinemanagername: "",  
      });
    }    
  };

  let columns = [];
  windowDimensions.width >= 750
    ? (columns = [
      {
        field: "Name",
        headerName: "Name",
        minWidth: 140,
      },
      {
        field: "Email",
        headerName: "Email",
        flex: 1,
      },
      {
        field: "Organization",
        headerName: "Organization",
        flex: 1,
      },
      {
        field: "Occupation",
        headerName: "Occupation",
        flex: 1,
      },
      {
        field: "Department",
        headerName: "Department",
        flex: 1,
      },
      {
        field: "users",
        headerName: "Employee?",
        minWidth: 5,
        renderCell: (users) =>
          users.row.users === true ? (
            <div className="users__icon__green">
              <DoneIcon sx={{ color: "white" }} />
            </div>
          ) : (
            <div className="users__icon__red">
              <CloseIcon sx={{ color: "white" }} />
            </div>
          ),
      },
      // {
      //   field: "Incentives",
      //   headerName: "Incentives",
      // },
      // {
      //   field: "Description",
      //   headerName: "Description",
      // },
      {
        field: "Status",
        headerName: "Status",
        flex: 1,
      },
      {
        field: "Action",
        headerName: "Action",
        minWidth: 300,
        renderCell: (user) => (
          <>
            <Button
              onClick={() => viewUser(user.row)}
              variant="contained"
              size="small"
              sx={{ m: 1 }}
            >
              View
            </Button>
            <Button
              onClick={() => editUser(user.row)}
              variant="contained"
              size="small"
              color="warning"
              sx={{ m: 1 }}
            >
              Edit
            </Button>
            {user.row.Status === "Active" ? (
              <Button
                onClick={() => {
                  handleApisCall(user.id, "suspendusers");
                }}
                variant="contained"
                color="error"
                size="small"
                sx={{ m: 1 }}
              >
                Suspend
              </Button>
            ) : user.row.Status === "Pending Approval" ? (
              <Button
                onClick={() => {
                  handleDeleteApi(user.id, "approveuser");
                  console.log("WE HERE")
                }}
                variant="contained"
                color="error"
                size="small"
                sx={{ m: 1 }}
              >
                Approve
              </Button>
            ) : user.row.Status === "Suspended" ? (
              <Button
                onClick={() => {
                  handleApisCall(user.id, "reinstateusers");
                }}
                variant="contained"
                color="success"
                size="small"
                sx={{ m: 1 }}
              >
                Activate
              </Button>
            ) : null}
          </>
        ),
        sortable: false,
        filterable: false,
      },
    ])
    : (columns = [
      {
        field: "Name",
        headerName: "Name",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "Email",
        headerName: "Email",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "Type",
        headerName: "Type",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "Organization",
        headerName: "Organization",
        flex: 1,
        minWidth: 140,
      },

      {
        field: "Occupation",
        headerName: "Occupation",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "Department",
        headerName: "Department",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "users",
        headerName: "Employee?",
        flex: 1,
        minWidth: 90,
        renderCell: (users) =>
          users.row.users === true ? (
            <div className="users__icon__green">
              <DoneIcon sx={{ color: "white" }} />
            </div>
          ) : (
            <div className="users__icon__red">
              <CloseIcon sx={{ color: "white" }} />
            </div>
          ),
      },
      // {
      //   field: "Incentives",
      //   headerName: "Incentives",
      // },
      // {
      //   field: "Description",
      //   headerName: "Description",
      // },
      {
        field: "Status",
        headerName: "Status",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "Action",
        headerName: "Action",
        minWidth: 180,
        renderCell: (user) => (
          <>
            <Button
              onClick={() => viewUser(user.row)}
              variant="contained"
              size="small"
              sx={{ m: 1 }}
            >
              View
            </Button>
            {user.row.Status === "Active" ? (
              <Button
                onClick={() => {
                  handleApisCall(user.id, "suspendusers");
                }}
                variant="contained"
                color="error"
                size="small"
                sx={{ m: 1 }}
              >
                Suspend
              </Button>
            ) : user.row.Status === "Pending Approval" ? (
              <Button
                onClick={() => {
                  handleApisCall(user.id, "approveuser");
                }}
                variant="contained"
                color="error"
                size="small"
                sx={{ m: 1 }}
              >
                Approve
              </Button>
            ) : user.row.Status === "Suspended" ? (
              <Button
                onClick={() => {
                  handleApisCall(user.id, "reinstateusers");
                }}
                variant="contained"
                color="success"
                size="small"
                sx={{ m: 1 }}
              >
                Activate
              </Button>
            ) : null}
          </>
        ),
        sortable: false,
        filterable: false,
      },
    ]);

  let rows = [];
  value === "activeUsers"
    ? (rows = users
      ?.filter((obj) => {
        return obj.status === "Active";
      })
      .filter((obj) => {
        if (searchUser === "") {
          return obj;
        } else if (
          obj.name.toLowerCase().includes(searchUser?.toLowerCase())
        ) {
          return obj;
        }
      })
      .map((cur, key) => {
        const employeeInfo = cur.isEmployee.isTrue ? cur.employeeInfo[0] : {};

        return {
          id: cur._id,
          Location: cur.jobCity,
          Name: cur.name,
          Email: cur.email,
          Organization: cur.organization,
          Occupation: cur.occupation,
          Department: cur.department,
          users: cur.isEmployee.isTrue,
          Status: cur.status,
          Action: cur._id,
          EmployeeInfo: employeeInfo,
          dateCreated: cur.dateCreated,
        };
      }))
    : value === "unverifiedUser"
      ? (rows = users
        ?.filter((obj) => {
          return obj.status === "Pending Email Verification";
        })
        .filter((obj) => {
          if (searchUser === "") {
            return obj;
          } else if (
            obj.name.toLowerCase().includes(searchUser?.toLowerCase())
          ) {
            return obj;
          }
        })
        .map((cur, key) => {
          const employeeInfo = cur.isEmployee.isTrue ? cur.employeeInfo[0] : {};

          return {
            id: cur._id,
            Location: cur.jobCity,
            Name: cur.name,
            Email: cur.email,
            Organization: cur.organization,
            Occupation: cur.occupation,
            Department: cur.department,
            users: cur.isEmployee.isTrue,
            Status: cur.status,
            Action: cur._id,
            EmployeeInfo: employeeInfo,
            dateCreated: cur.dateCreated,
          };
        }))
      : value === "pendingUsers"
        ? (rows = users
          ?.filter((obj) => {
            return obj.status === "Pending Approval";
          })
          .filter((obj) => {
            if (searchUser === "") {
              return obj;
            } else if (
              obj.name.toLowerCase().includes(searchUser?.toLowerCase())
            ) {
              return obj;
            }
          })
          .map((cur, key) => {
            const employeeInfo = cur.isEmployee.isTrue ? cur.employeeInfo[0] : {};

            return {
              id: cur._id,
              Location: cur.jobCity,
              Name: cur.name,
              Email: cur.email,
              Organization: cur.organization,
              Occupation: cur.occupation,
              Department: cur.department,
              users: cur.isEmployee.isTrue,
              Status: cur.status,
              Action: cur._id,
              EmployeeInfo: employeeInfo,
              dateCreated: cur.dateCreated,
            };
          }))
        : // : value === "approvalUsers"
        // ? (rows = users
        //     ?.filter((obj) => {
        //       return obj.status === "Approval Email";
        //     })
        //     .filter((obj) => {
        //       if (searchUser === "") {
        //         return obj;
        //       } else if (
        //         obj.name.toLowerCase().includes(searchUser?.toLowerCase())
        //       ) {
        //         return obj;
        //       }
        //     })
        //     .map((cur, key) => {
        //       return {
        //         id: cur._id,
        //         Location: cur.jobCity,
        //         Name: cur.name,
        //         Email: cur.email,
        //         Organization: cur.organization,
        //         Occupation: cur.occupation,
        //         users: cur.isEmployee.isTrue,
        //         Status: cur.status,
        //         Action: cur._id,
        //       };
        //     }))
        value === "suspendedUsers"
          ? (rows = users
            ?.filter((obj) => {
              return obj.status === "Suspended";
            })
            .filter((obj) => {
              if (searchUser === "") {
                return obj;
              } else if (
                obj.name.toLowerCase().includes(searchUser?.toLowerCase())
              ) {
                return obj;
              }
            })
            .map((cur, key) => {
              const employeeInfo = cur.isEmployee.isTrue ? cur.employeeInfo[0] : {};

              return {
                id: cur._id,
                Location: cur.jobCity,
                Name: cur.name,
                Email: cur.email,
                Organization: cur.organization,
                Occupation: cur.occupation,
                Department: cur.department,
                users: cur.isEmployee.isTrue,
                Status: cur.status,
                Action: cur._id,
                EmployeeInfo: employeeInfo,
                dateCreated: cur.dateCreated,
              };
            }))
          : (rows = users
            ?.filter((obj) => {
              if (searchUser === "") {
                return obj;
              } else if (
                obj.name.toLowerCase().includes(searchUser?.toLowerCase())
              ) {
                return obj;
              }
            })
            .map((cur, key) => {
              const employeeInfo = cur.isEmployee.isTrue ? cur.employeeInfo[0] : {};

              return {
                id: cur._id,
                Location: cur.jobCity,
                Name: cur.name,
                Email: cur.email,
                Organization: cur.organization,
                Occupation: cur.occupation,
                Department: cur.department,
                users: cur.isEmployee.isTrue,
                Status: cur.status,
                Action: cur._id,
                EmployeeInfo: employeeInfo,
                dateCreated: cur.dateCreated,
              };
            }));

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
      <div className="UsersTable">
        <h3>Users</h3>
        {users ? (
          <>
            <div style={{ marginTop: "10px", height: "70vh", width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={rowsPerPage}
                onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
                rowsPerPageOptions={[10, 25, 50]}
                pagination
                disableSelectionOnClick
              />
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="viewUser__modal">
                <div className="viewUser__modal__heading">User Details</div>
                <div className="user__details__out">
                  <div className="user__details__box">
                    <div className="user__detail">
                      <div className="user__detail__title">Name </div>
                      <div className="user__detail__text">{viewData.Name}</div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Email</div>
                      <div className="user__detail__text">{viewData.Email}</div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Organization </div>
                      <div className="user__detail__text">
                        {viewData.Organization}
                      </div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Occupation</div>
                      <div className="user__detail__text">
                        {viewData.Occupation}
                      </div>
                    </div>                  
                    <div className="user__detail">
                      <div className="user__detail__title">Department </div>
                      <div className="user__detail__text">
                        {viewData.Department}
                      </div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Status </div>
                      <div className="user__detail__text">{viewData.Status}</div>
                    </div>
                    <div className="user__detail">
                      <div className="user__detail__title">Date Created </div>
                      <div className="user__detail__text">
                        {viewData.dateCreated}
                      </div>
                    </div>
                  </div>

                  {viewData.EmployeeInfo ? (
                    <div className="user__details__box">
                      <div className="user__detail">
                        <div className="user__detail__title">Employee ID </div>
                        <div className="user__detail__text">{viewData.EmployeeInfo.empid}</div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Employee Grade </div>
                        <div className="user__detail__text">{viewData.EmployeeInfo.empgrade}</div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Manager ID </div>
                        <div className="user__detail__text">{viewData.EmployeeInfo.emplinemanagerid}</div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Manager Name </div>
                        <div className="user__detail__text">
                          {viewData.EmployeeInfo.emplinemanagername}
                        </div>
                      </div>
                    </div>
                  ) : null}

                </div>
                <div className="viewUser__actions__btn">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClickOpenDialog}
                  >
                    Delete User
                  </Button>
                  {viewData.Status === "Active" ? (
                    <Button
                      onClick={() => {
                        handleApisCall(viewData.id, "suspendusers");
                      }}
                      variant="contained"
                      color="error"
                    >
                      Suspend
                    </Button>
                  ) : viewData.Status === "Pending Approval" ? (
                    <Button
                      onClick={() => {
                        handleApisCall(viewData.id, "approveuser");
                      }}
                      variant="contained"
                      color="error"
                    >
                      Approve
                    </Button>
                  ) : viewData.Status === "Suspended" ? (
                    <Button
                      onClick={() => {
                        handleApisCall(viewData.id, "reinstateusers");
                      }}
                      variant="contained"
                      color="success"
                    >
                      Activate
                    </Button>
                  ) : null}
                </div>
              </Box>
            </Modal>
            <Dialog
              open={openDialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle color="error">{"User Delete Permanently?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                If you delete this user then it will be deleted permanently.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  onClick={() => handleDeleteApi(viewData.id, "deleteUser")}
                  color="error"
                >
                  Delete User
                </Button>
              </DialogActions>
            </Dialog>
            <Modal
              open={openEdit}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="viewUser__modal">
                <form onSubmit={handleClickOpenDialogEdit}>
                  <div className="viewUser__modal__heading">User Details</div>
                  <div className="user__details__out">
                    <div className="user__details__box">
                      <div className="user__detail">
                        <div className="user__detail__title">Name </div>
                        <div className="user__detail__text">{viewData.Name}</div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Email</div>
                        <div className="user__detail__text">{viewData.Email}</div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Organization </div>
                        <div className="user__detail__text">
                          {viewData.Organization}
                        </div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Occupation</div>
                        <div className="user__detail__text">
                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="empdesignation"
                            value={editEmployeeData.empdesignation}
                            onChange={editEmpHandleChange}
                            required
                            inputProps={{
                              minLength: 3,
                            }}
                          />
                        </div>
                      </div>                  
                      <div className="user__detail">
                        <div className="user__detail__title">Department </div>
                        <div className="user__detail__text">
                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="outlined"
                            name="empdivision"
                            value={editEmployeeData.empdivision}
                            onChange={editEmpHandleChange}
                            required
                            inputProps={{
                              minLength: 3,
                            }}
                          />
                        </div>
                      </div>
                      <div className="user__detail">
                        <div className="user__detail__title">Status </div>
                        <div className="user__detail__text">{viewData.Status}</div>
                      </div>
                    </div>

                    {viewData.EmployeeInfo ? (
                        <div className="user__details__box">
                          <div className="user__detail">
                            <div className="user__detail__title">Employee ID </div>
                            <div className="user__detail__text">
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                name="empid"
                                value={editEmployeeData.empid}
                                onChange={editEmpHandleChange}
                                required
                              />                          
                            </div>
                        </div>
                        <div className="user__detail">
                          <div className="user__detail__title">Employee Grade </div>
                          <div className="user__detail__text">
                            <TextField
                              fullWidth
                              id="outlined-basic"
                              variant="outlined"
                              name="empgrade"
                              value={editEmployeeData.empgrade}
                              onChange={editEmpHandleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="user__detail">
                          <div className="user__detail__title">Manager ID </div>
                          <div className="user__detail__text">
                            <TextField
                              fullWidth
                              id="outlined-basic"
                              variant="outlined"
                              name="emplinemanagerid"
                              value={editEmployeeData.emplinemanagerid}
                              onChange={editEmpHandleChange}
                              required
                            />                          
                          </div>
                        </div>
                        <div className="user__detail">
                          <div className="user__detail__title">Manager Name </div>
                          <div className="user__detail__text">
                            <TextField
                              fullWidth
                              id="outlined-basic"
                              variant="outlined"
                              name="emplinemanagername"
                              value={editEmployeeData.emplinemanagername}
                              onChange={editEmpHandleChange}
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
                        </div>
                      </div>
                    ) : null}

                  </div>
                  <div className="viewUser__actions__btn">
                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Box>
            </Modal>
            <Dialog
              open={openDialogEdit}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialogEdit}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle color="warning">{"Edit User Permanently?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                If you edit this user then it will be edited permanently.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialogEdit}>Cancel</Button>
                <Button
                  onClick={() => handleEditApi(editEmployeeData, "editUser_Admin")}
                  color="warning"
                >
                  Edit User
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <div>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTable;
