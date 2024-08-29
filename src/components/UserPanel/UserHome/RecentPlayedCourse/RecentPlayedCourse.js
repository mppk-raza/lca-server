import { Button } from '@mui/material'
import React from 'react'
import './RecentPlayedCourse.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate } from 'react-router-dom'

const RecentPlayedCourse = ({ array }) => {
  const navigate = useNavigate()

  let data = array[0]
  console.log(data)
  return (
    <div className='RecentPlayedCourse'>
      <div className='RecentPlayedCourse__img'>
        <img
          alt={data.courseData?.courseName}
          src={data.courseData?.courseThumbnail}
        />
      </div>
      <div className='RecentPlayedCourse__nameBtn__box'>
        <div className='RecentPlayedCourse__name__heading'>
          {data.courseData?.courseName}
        </div>
        <div className="RecentPlayedCourse__name__score"
                style={{ backgroundColor: (data.text && data.text !== "From Recent Courses Enrolled") ? "#00a0ad" : (data.percentage < 30 ? "#FF4444" : data.percentage > 70 ? "green" : "#ffd700") }}
              >
                <div className="ProgressSection__courses__percentage__icon"><FactCheckIcon /></div>
                <div style={{fontSize:"small"}} className="ProgressSection__courses__percentage__num">{(data.text && data.text !== "From Recent Courses Enrolled") ? "New Course" : (data.percentage) ? data.percentage+"%" : "0%" }</div>
              </div>

        <div className='RecentPlayedCourse__btn'>
          <Button
            variant='contained'
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              navigate('/course', {
                state: {
                  id: data.courseData._id,
                  backUrl: '/UserPanel',
                  courseData: data.courseData
                }
              })
            }}
          >
            View
          </Button>
        </div>
      </div>
      <div className='RecentPlayedCourse__progressBar'>
        <div
          style={{ width: `${data.progress}%` }}
          className='RecentPlayedCourse__progressBar__value'
        ></div>
      </div>
    </div>
  )
}

export default RecentPlayedCourse
