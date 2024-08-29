import React from 'react'
import './UserHome.css'
import FirstSection from '../../../components/UserPanel/UserHome/FirstSection/FirstSection'
import ProgressSection from '../../../components/UserPanel/UserHome/ProgressSection/ProgressSection'
import QuizSection from '../../../components/UserPanel/UserHome/QuizSection/QuizSection'
import RecentPlayedCourse from '../../../components/UserPanel/UserHome/RecentPlayedCourse/RecentPlayedCourse'
import RecentActivity from '../../../components/UserPanel/UserHome/RecentActivity/RecentActivity'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import RuleIcon from '@mui/icons-material/Rule'
import BadgeIcon from '@mui/icons-material/Badge'
import { toast } from 'react-toastify'
import Skeleton from '@mui/material/Skeleton'
import axios from 'axios'
import Underlings from '../../../components/UserPanel/UserHome/Underlings/Underlings'

const UserHome = () => {
  const [data, setData] = React.useState(null)
  const [courses, setCourses] = React.useState(null)
  const [underlingsStats, setUnderlingsStats] = React.useState(null)

  React.useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/api/dashboard/getCounts', {
        token: localStorage.getItem('token')
      })
      .then(res => {
        setData(res.data.data)
      })
      .catch(err => {
        console.log(err)
        toast.error(
          'An unexpected error occurred loading the statistics. Please check your internet connection try again'
        )
      })
  }, [])

  React.useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/api/dashboard/getMyCourses', {
        token: localStorage.getItem('token')
      })
      .then(res => {
        setCourses(res.data.data)
      })
      .catch(err => {
        console.log(err)
        toast.error(
          'An unexpected error occurred loading the statistics. Please check your internet connection try again'
        )
      })
  }, [])

  React.useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/api/dashboard/getUnderlingStats', {
        token: localStorage.getItem('token')
      })
      .then(res => {
        setUnderlingsStats(res.data.data)
      })
      .catch(err => {
        console.log(err)
        toast.error(
          'An unexpected error occurred fetching underlings statistics. Please check your internet connection try again'
        )
      })
  }, [])

  return (
    <div className='UserHome'>
      <div className='UserHome__item__box'>
        {
          data ? (
            <>
              <div className='UserHome__items'>
                <FirstSection
                  heading='Courses Completed'
                  number={data.coursesCount ? data.coursesCount : 'N/A'}
                  icon={<LibraryBooksIcon />}
                />
              </div>
              <div className='UserHome__items'>
                <FirstSection
                  heading='Quiz Average Score'
                  number={data.overallScore ? data.overallScore + '%' : 'N/A'}
                  icon={<RuleIcon />}
                />
              </div>
              <div className='UserHome__items'>
                <FirstSection
                  heading='Trainings Attended'
                  number={
                    data.trainingsAttended ? data.trainingsAttended : 'N/A'
                  }
                  icon={<SchoolRoundedIcon />}
                />
              </div>
              <div className='UserHome__items'>
                <FirstSection
                  heading='Line Manager'
                  number={data.reportsTo ? data.reportsTo : 'N/A'}
                  icon={<BadgeIcon />}
                />
              </div>
            </>
          ) : (
            <div className='UserHome__skeleton__container'>
              <div className='UserHome__skeleton'>
                <Skeleton variant='rounded' width={650} height={215} />
              </div>
              <div className='UserHome__skeleton'>
                <Skeleton variant='rounded' width={650} height={215} />
              </div>
              <div className='UserHome__skeleton'>
                <Skeleton variant='rounded' width={650} height={215} />
              </div>
              <div className='UserHome__skeleton'>
                <Skeleton variant='rounded' width={650} height={215} />
              </div>
            </div>
          ) //PRELOADER HERE
        }
      </div>
      <div className='UserHome__left__right__container'>
        {
          courses ? (
            <>
              <div className='UserHome__left'>
                <ProgressSection array={courses.slice(1, courses.length)} />
                {/* <QuizSection /> */}
              </div>
              <div className='UserHome__right'>
                <RecentPlayedCourse array={courses.slice(0, 1)} />
                {/* <RecentActivity /> */}
              </div>
            </>
          ) : (
            <div className='UserHome__skeleton__Left__right__container'>
              <div className='UserHome__left'>
                <Skeleton variant='rounded' width={650} height={408} />
              </div>
              <div className='UserHome__right'>
                <Skeleton variant='rounded' width={650} height={408} />
              </div>
            </div>
          )
        }
      </div>
      {(underlingsStats) ? <Underlings underlingsStats={underlingsStats} />
        : <div className='UserHome__skeleton__Left__right__container' style={{ marginBottom: "80px" }}>
          <div className='UserHome__left'>
            <Skeleton variant='rounded' width={650} height={400} />
          </div>
          <div className='UserHome__right'>
            <Skeleton variant='rounded' width={650} height={400} />
          </div>
        </div>
      }
    </div>
  )
}

export default UserHome
