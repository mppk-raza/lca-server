import React from "react";
import "./BooksList.css";
import { useNavigate } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';


const BooksList = ({ booksData, search,status,category, pagination, loading }) => {
  const navigate = useNavigate();
  let skeleton = [1, 2, 3, 4,5];
  let retrievedObject = localStorage.getItem("user");
  const user = JSON.parse(retrievedObject);

  return (
    <div className="BooksList">
      {!loading ? (
        booksData
          ?.filter((obj) => {
            if (search === "") {
              return obj;
            } else if (
              obj.title.toLowerCase().includes(search?.toLowerCase())
            ) {
              return obj;
            }
          }).filter((obj)=> {
              if(category==="All"){
                return obj
              }else{
                return obj.available === category
              }
            })
            .filter((obj)=> {
              if(status==="All"){
                return obj
              }else{
                return obj.bookedBy === user._id
              }
            })
          .slice(pagination.from, pagination.to)
          .map((cur, ind) => {
            return (
              <div
                key={ind}
                className="BooksList__card"
                onClick={() =>
                  navigate("/UserPanel/UserViewBook", {
                    state: {
                      data: cur,
                      // id: cur.courseId ?cur.courseId :cur._id,
                      // backUrl: path,
                      // courseData:cur,
                      // availability: availableCourses?.find((id)=> id._id===cur._id||id._id===cur.courseId)?  true : false
                    },
                  })
                }
              >
                <div className="BooksList__card__img">
                  {" "}
                  <img src={cur.imageLink} width="100%" height="100%" />
                </div>
                <div className="BooksList__card__name"> {cur.title}</div>
                <div className="BooksList__card__author"> {cur.author}</div>
              </div>
            );
          })
      ) : (
        <>
        {
          skeleton.map((cur,ind)=>{
            return(
              <div className="BooksList__skeletons" >
              
              <Skeleton variant="rounded" width="100%" height={220} sx={{ marginBottom: "5px", borderRadius:"0 12px 12px 0" }} />
              <Skeleton variant="rounded" width="100%" height={20} sx={{ marginBottom: "5px" }} />
              <Skeleton variant="rounded" width="100%" height={20} sx={{ marginBottom: "5px" }} />
             
              </div>
            )
          })
        }
        </>
      )}
    </div>
  );
};

export default BooksList;
