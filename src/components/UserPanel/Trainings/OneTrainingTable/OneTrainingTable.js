import React from "react";
import "./OneTrainingTable.css";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const OneTrainingTable = ({ participants }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
        field: "employee",
        headerName: "Employee?",
        width: 110,
        renderCell: (employee) =>
        employee.row.employee === true ? (
            <div className="OneTrainingTable__icon__green">
              <DoneIcon sx={{ color: "white" }} />
            </div>
          ) : (
            <div className="OneTrainingTable__icon__red">
              <CloseIcon sx={{ color: "white" }} />
            </div>
          ),
      },
  ];

  const rows = participants.map((cur, ind) => {
    return {
      id: ind,
      name: cur.name,
      email: cur.email,
      employee:cur.isEmployee?.isTrue
    };
  });
  return (
    <div className="OneTrainingTable">
    {participants.length>0?
      <Box sx={{ height: 400, width: "100%" }}>
      <h3>Participants</h3>
        <DataGrid
         sx={{ overflowX: 'scroll' }}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    :null}
    </div>
  );
};

export default OneTrainingTable;
