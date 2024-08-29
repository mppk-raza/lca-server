import React from "react";
import "./CourseSections.css";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import LongText from "../../../LongText/LongText";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
const CourseSections = ({
  sections,
  setSectionIndex,
  setLessonIndex,
  setNextBtn,
  setQuizBtn,
  setOpen,
  setOpenResult,
  setPlaying,
  setQuizValue,
  setQuizResult,
  sectionIndex,
  lessonIndex,
  enrollCourseData,
  videoRef
}) => {
  const [OpenArr, setOpenArr] = React.useState([false]);
  return (
    <>
      {sections?.map((cur, ind) => {
        return (
          <div key={ind} className="course__section__box">
            <div className="course__section__box__heading__btn__cont">
              <div
                className={
                  ind === sectionIndex
                    ? "course__section__box__heading__active"
                    : "course__section__box__heading"
                }
              >
               <FeaturedPlayListIcon  sx={{marginRight:"5px"}} fontSize="small"/>
               Section {ind+1}
                {/* {cur?.sectionTitle} */}
              </div>
              {/* <div className="course__section__box__expand__btn">
                <ExpandMore
                  expand={OpenArr[ind]}
                  onClick={() => {
                    const temp = [...OpenArr];
                    temp[ind] = !OpenArr[ind];
                    setOpenArr(temp);
                  }}
                  aria-expanded={OpenArr[ind]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </div> */}
            </div>
            {/* <Collapse in={OpenArr[ind]} timeout="auto" unmountOnExit> */}
            <div>
              <div
                className={
                  ind === sectionIndex
                    ? "course__section__box__abstract__box__active"
                    : "course__section__box__abstract__box"
                }
              >
            <div className="course__section__name">{cur?.sectionTitle}</div>
                <div
                  className="course__section__box__abstract__heading"
                  
                >
               
                  Abstract:
                </div>{" "}
              <div className="course__section__box__abstract">
                <LongText content = {cur?.sectionAbstract} limit = {110}/>
             
              </div>  
              </div>

              {cur?.sectionLessons?.map((subCur, subInd) => {
                return (
                  <div
                    key={subInd}
                    onClick={() => {
                      if ( ind <= enrollCourseData.sectionIndex  ) {
                        videoRef.current.load();
                        setSectionIndex(ind);
                        setLessonIndex(subInd);
                        setNextBtn(false);
                        setQuizBtn(false);
                        setOpen(false);
                        setOpenResult(false);
                        setPlaying(false);
                        setQuizValue([]);
                        setQuizResult();
                      }
                    }}
                    className={
                      subInd === lessonIndex && ind === sectionIndex
                        ? "course__section__lesson__box__active"
                        : "course__section__lesson__box"
                    }
                  >
                    <div className="course__section__lesson__box__heading">
                     <PlayCircleOutlineIcon sx={{marginRight:"5px"}} fontSize="small"/> Lesson {ind + 1}.{subInd + 1}
                    </div>
                    <div className="course__section__lesson__name">{subCur?.lessonName}</div>
                  </div>
                );
              })}
            </div>
            {/* </Collapse> */}
          </div>
        );
      })}
    </>
  );
};

export default CourseSections;
