import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import IssuedBooksTable from "../../../components/Admin/Users/IssuedBooksTable/IssuedBooksTable";
import "./IssuedBooks.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "27ch",
      "&:focus": {
        width: "35ch",
      },
    },
  },
}));

const IssuedBooks = () => {
  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState("");

  const getAllBooks = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/books/getIssuedBooks`, {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        let temp = res.data.data ? res.data.data : [];
        setBooks(temp);
      })
      .catch((err) => {
        console.log(err);
        setBooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className="Users">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "#41424C",
            borderRadius: "60px",
            margin: "10px auto",
            width: "95%",
            color: "white",
            padding: 0,
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              // flexWrap: "wrap",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            <Search sx={{ minWidth: "98%" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchBooks}
                onChange={(e) => setSearchBooks(e.target.value)}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ width: "95%", typography: "body1", margin: "30px auto" }}>
        <IssuedBooksTable books={books} searchBooks={searchBooks} />
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default IssuedBooks;
