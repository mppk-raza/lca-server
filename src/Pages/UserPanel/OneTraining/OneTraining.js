import React, { useState, useEffect } from 'react'
import './OneTraining.css'
import { useLocation } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { ToastContainer, toast } from 'react-toastify'
import Error from '../../Error/Error'
import OneTrainingTable from '../../../components/UserPanel/Trainings/OneTrainingTable/OneTrainingTable'
import NominateUnderlings from '../../../components/UserPanel/Trainings/NominateUnderlings/NominateUnderlings'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import image from '../../../assets/scenery.jfif'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PDFToPrint } from '../../Course/PDFToPrint'
import ReactToPrint from 'react-to-print';


const orangeTheme = createTheme({
  palette: { primary: { main: '#00a0ad', }, secondary: { main: '#41424C', }, },
});


const OneTraining = () => {
  const PDFRef = React.useRef();
  const { state } = useLocation()
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)
  const [managerOpen, setManagerOpen] = useState(true)
  const [underlings, setUnderlings] = useState(null)
  const [trainingData, setTrainingData] = useState()
  const [underlingsList, setUnderlingsList] = useState([])
  let retrievedObject = localStorage.getItem('user')
  const user = JSON.parse(retrievedObject)

  React.useEffect(() => {
    if (managerOpen) {
    } else {
      setUnderlings(null)
    }
  }, [managerOpen])


  const getSingleTrainings = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + '/api/trainings/getSingleTrainings',
        {
          trainingID: state.id
        }
      )
      .then(res => {
        console.log(res)
        setTrainingData(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getTrainingCertificate = () => {
    axios.post(
      process.env.REACT_APP_BACKEND_URL + '/api/trainings/getTrainingCertificate',
      { trainingID: state.id, userID: user._id }
    ).then(res => {
      if (res.data.error) {
        toast.error(res.data.message)
      } else {
        setHasCertificate(res.data.certificate)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const getUnderlings = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/api/users/getUnderlings', {
        token: localStorage.getItem('token')
      })
      .then(res => {
        console.log(res)
        setUnderlingsList(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const addBooking = () => {
    setLoading(true)
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + '/api/trainings/selfNomination',
        {
          trainingID: trainingData?._id,
          token: localStorage.getItem('token')
        }
      )
      .then(res => {
        console.log(res)
        if (res.data.error === false) {
          toast.success(res.data.message)
          setRefresh(!refresh)
        } else {
          toast.warn(res.data.message)
        }
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        toast.error('An unexpected error occurred. Please try again later')
      })
  }

  useEffect(() => {
    getSingleTrainings()
    getUnderlings()
    getTrainingCertificate()
  }, [refresh])

  return (
    <div className='OneTraining'>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {trainingData && underlingsList ? (
        <>
          <ThemeProvider theme={orangeTheme}>
            <div className='OneTraining__back__Btn'>
              {' '}
              <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                component={Link}
                to={(state.backUrl) ? state.backUrl : '/UserPanel/Trainings'}
              >
                Back
              </Button>
              {/* {(true) */}
              {(hasCertificate === true)
                ? <>
                  <ReactToPrint
                    trigger={() =>
                      <Button variant='contained'>
                        Download Certificate
                      </Button>
                    }
                    content={() => PDFRef.current}
                  />
                  <div style={{ display: "none" }}>
                    <PDFToPrint
                      name={(user.name) ? user.name : "Missing"}
                      course={(trainingData && trainingData.name) ? trainingData.name : "Missing"}
                      date={(trainingData && trainingData.endDate) ? trainingData.endDate : null}
                      ref={PDFRef}
                    />
                  </div>
                </>
                : <Button
                  variant='contained'
                  onClick={() => {
                    toast.info(hasCertificate)
                  }}
                >
                  Download Certificate
                </Button>
              }
            </div>
          </ThemeProvider>
          <div className='OneTraining__details__box'>
            <div className='OneTraining__left__img'>
              <img src={image} alt={trainingData?.name} />
            </div>
            <div className='OneTraining__right'>
              <div className='OneTraining__right__heading'>
                {trainingData?.name}
              </div>
              <div className='OneTraining__right__status__box'>
                {trainingData?.description}
              </div>
              <div className='OneTraining__right__divider'></div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>
                  Start :{' '}
                </div>
                <div className='OneTraining__right__author__text'>
                  {new Date(trainingData?.startDate).toLocaleDateString(
                    undefined,
                    {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      time: 'short'
                    }
                  ) +
                    ' at ' +
                    new Date(trainingData?.startDate)
                      .toTimeString()
                      .slice(0, 8)}
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>End : </div>
                <div className='OneTraining__right__author__text'>
                  {new Date(trainingData?.endDate).toLocaleDateString(
                    undefined,
                    {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      time: 'short'
                    }
                  ) +
                    ' at ' +
                    new Date(trainingData?.endDate).toTimeString().slice(0, 8)}
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>
                  Location :{' '}
                </div>
                <div className='OneTraining__right__author__text'>
                  {trainingData?.location}
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>
                  Open to :{' '}
                </div>
                <div className='OneTraining__right__author__text'>
                  {trainingData?.openTo.toUpperCase()} members
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>
                  Capacity :{' '}
                </div>
                <div className='OneTraining__right__author__text'>
                  {trainingData?.capacity}
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>
                  Slots left :{' '}
                </div>
                <div className='OneTraining__right__author__text'>
                  {trainingData?.slotsLeft}
                </div>
              </div>
              <div className='OneTraining__right__author'>
                <div className='OneTraining__right__author__dot'></div>
                <div className='OneTraining__right__author__title'>Mode : </div>
                <div className='OneTraining__right__author__text'>
                  {trainingData?.eventType.toUpperCase()}
                </div>
              </div>
              <div className='OneTraining__right__divider'></div>
              <div className='OneTraining__right__btn__container'>
                {!trainingData?.participants.find(
                  cur => cur.userID === user._id
                ) ? (
                  <div className='OneTraining__right__btn' onClick={addBooking}>
                    Self Nominate
                  </div>
                ) : null}
                {underlingsList?.length >= 1 ? (
                  <NominateUnderlings
                    data={state}
                    underlingsList={underlingsList}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                ) : null}
              </div>
              <OneTrainingTable participants={trainingData?.participants} />
            </div>
          </div>
          <Backdrop
            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </>
      ) : (
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      )}
    </div>
  )
}

export default OneTraining
