import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./IssuedBooksTable.css";

const IssuedBooksTable = ({ books, searchBooks }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let columns = [
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "Occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "Organization",
      headerName: "Organization",
      flex: 1,
    },

    {
      field: "Title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "Author",
      headerName: "Author",
      flex: 1,
    },
    {
      field: "Image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => <img src={params.value} alt={params.value} className="issuedBooks__img"/>,
    },
    {
      field: "BookingDate",
      headerName: "Booking Date",
      flex: 1,
    },
  ];

  let rows = books
    ?.filter((obj) => {
      if (searchBooks === "") {
        return obj;
      } else if (
        obj.name.toLowerCase()?.includes(searchBooks?.toLowerCase()) ||
        obj.empid?.includes(searchBooks)
      ) {
        return obj;
      }
    })
    ?.map((cur, key) => {
      return {
        id: cur._id,
        Name: cur.bookedBy.name,
        Occupation: cur.bookedBy.occupation,
        Organization: cur.bookedBy.organization,
        Title: cur.title,
        Author: cur.author,
        Image: cur.imageLink,
        BookingDate: cur.bookingDate,
      };
    });

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
        <h3>Issued Books</h3>
        {books ? (
          <div style={{ marginTop: "10px", height: "70vh", width: "100%" }}>
            <DataGrid
              getRowId={(row) => row?.id}
              rows={rows}
              columns={columns}
              pageSize={rowsPerPage}
              onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              disableSelectionOnClick
            />
          </div>
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

export default IssuedBooksTable;
