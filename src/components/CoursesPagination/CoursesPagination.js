import React from "react";
import "./CoursesPagination.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const CoursesPagination = ({pageSize,pagination,setPagination }) => {

  const handleChange = (e, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({...pagination,from:from, to: to})
  };
  return (
    <div className="CoursesPagination">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(pagination.count / pageSize)}
          shape="rounded"
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
};

export default CoursesPagination;
