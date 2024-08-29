import React, { useState } from "react";
import "./UploadedEmpTable.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { DataGrid } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const UploadedEmpTable = ({ openResModal, setOpenResModal, response }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  let columns = [];
  {
    windowDimensions.width >= 750
      ? (columns = [
          {
            field: "RowNo",
            headerName: "Row NO",
            minWidth: 20,
          },
          {
            field: "EmployeeID",
            headerName: "EmployeeID",
            minWidth: 100,
            headerAlign: "center",
            align: "center",
          },
          {
            field: "Name",
            headerName: "Name",
            minWidth: 190,
            headerAlign: "center",
            align: "center",
          },
          {
            field: "Status",
            headerName: "Status",
            minWidth: 560,
            headerAlign: "center",
            align: "center",
          },

          {
            field: "Success",
            headerName: "Success?",
            minWidth: 20,
            headerAlign: "center",
            renderCell: (users) =>
              users.row.Success === !true ? (
                <div className="users__icon__green">
                  <DoneIcon sx={{ color: "white" }} />
                </div>
              ) : (
                <div className="users__icon__red">
                  <CloseIcon sx={{ color: "white" }} />
                </div>
              ),
          },
        ])
      : (columns = [
          {
            field: "RowNo",
            headerName: "Row NO",
            minWidth: 20,
          },
          {
            field: "Status",
            headerName: "Status",
            minWidth: 700,
            headerAlign: "center",
            align: "center",
          },

          {
            field: "Success",
            headerName: "Success?",
            minWidth: 20,
            renderCell: (users) =>
              users.row.Success === true ? (
                <div className="users__icon__green">
                  <DoneIcon sx={{ color: "white" }} />
                </div>
              ) : (
                <div className="users__icon__red">
                  <CloseIcon sx={{ color: "white" }} />
                </div>
              ),
          },
        ]);
  }
 
  let rows = response?.map((cur, key) => {
    return {
      id: key,
      RowNo: key + 1,
      EmployeeID: cur.empid,
      Name: cur.empname,
      Status: cur.message,
      Success: cur.error,
    };
  });
  return (
    <div className="UploadedEmpTable">
      <Button
        sx={{ marginRight: "10px" }}
        variant="contained"
        onClick={() => setOpenResModal(true)}
      >
        View recent Upload
      </Button>
      <Modal
        open={openResModal}
        onClose={() => setOpenResModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="UploadedEmpTable__modal">
          <div className="UploadedEmpTable__heading">
            {" "}
            <h3> Recent Upload Details</h3>
          </div>
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
        </Box>
      </Modal>
    </div>
  );
};

export default UploadedEmpTable;
