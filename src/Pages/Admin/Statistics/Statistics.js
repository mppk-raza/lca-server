import React, { useEffect, useState } from 'react'
import './Statistics.css'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import { Button } from '@mui/material'

const Statistics = () => {
  const [statsData, setStatsData] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const statsHandleChange = e => {
    let { name, value } = e.target
    setStatsData({ ...statsData, [name]: value })
  }

  React.useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + '/api/variable/getVariableStatistics').then(res => {
      if (res.data.error === false) {
        setStatistics({
          "locationsCovered": res.data.locationsCovered,
          "totalParticipants": res.data.totalParticipants,
          "totalTrainingHours": res.data.totalTrainingHours,
          "numberOfTrainings": res.data.numberOfTrainings,
        })
      } else {
        toast.warn(res.data.message)
      }
    }).catch(err => {
      toast.error('An unexpected error occurred while fetching numbers from database. Please try again later')
      console.log(err)
    })
  }, [])

  const handleSubmit = (title, value, e) => {
    e.preventDefault()
    console.log(value)
    if (value < 0) {
      toast.warn('Please select any positive number')
    } else {
      setLoadingBtn(true)
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + '/api/variable/changeVariable',
          {
            token: localStorage.getItem('token'),
            name: title,
            value: parseInt(value)
          }
        )

        .then(res => {
          console.log(res)
          if (res.data.error === false) {
            toast.success(res.data.message)
            setRefresh(!refresh)
            setLoadingBtn(false)
          } else {
            toast.warn(res.data.message)
          }
        })
        .catch(err => {
          toast.error(
            'An unexpected error occurred while fetching numbers from database. Please try again later'
          )
          console.log(err)
        })
    }
  }

  React.useEffect(() => {
    axios
      .post(
        '' +
        process.env.REACT_APP_BACKEND_URL +
        '/api/variable/getManyVariables',
        {
          names: [
            'locationsCovered',
            'totalTrainingHours',
            'participantsCovered',
            'numberOfTrainings'
          ]
        }
      )
      .then(res => {
        setStatsData({
          locationsCovered: parseInt(
            res.data.data.filter(obj => obj.name === 'locationsCovered')[0]
              .value
          ),
          totalTrainingHours: parseInt(
            res.data.data.filter(obj => obj.name === 'totalTrainingHours')[0]
              .value
          ),
          participantsCovered: parseInt(
            res.data.data.filter(obj => obj.name === 'participantsCovered')[0]
              .value
          ),
          numberOfTrainings: parseInt(
            res.data.data.filter(obj => obj.name === 'numberOfTrainings')[0]
              .value
          )
        })
      })
      .catch(err => {
        toast.error(
          'An unexpected error occurred while fetching numbers from database. Please try again later'
        )
        console.log(err)
      })
  }, [refresh])

  if (!statsData)
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  else
    return (
      <div className='Statistics'>
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
        <h3>Statistics</h3>
        <div className='Statistics__form__box'>
          <form
            onSubmit={e =>
              handleSubmit('locationsCovered', statsData.locationsCovered, e)
            }
            className='Statistics__form__textfield__container'
          >
            <div className='Statistics__form__textfield'>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Locations Covered '
                variant='outlined'
                type='number'
                required
                name='locationsCovered'
                onChange={statsHandleChange}
                value={statsData.locationsCovered}
              />
            </div>
            <div className='Statistics__form__btn'>
              <Button
                sx={{
                  bgcolor: '#00a0ad',
                  color: '#41424C',
                  borderColor: '#41424C',
                  '&:hover': {
                    backgroundColor: '#41424C',
                    color: '#00a0ad'
                  }
                }}
                loading={loadingBtn}
                variant='contained'
                type='submit'
              >
                UPDATE
              </Button>
            </div>
            <div className="Statistics__form__grey__text">
              {(statistics && statistics.locationsCovered) ? "Original Number from Database : " + statistics.locationsCovered : "Fetching Number..."}
            </div>
          </form>
          <form
            onSubmit={e =>
              handleSubmit(
                'totalTrainingHours',
                statsData.totalTrainingHours,
                e
              )
            }
            className='Statistics__form__textfield__container'
          >
            {' '}
            <div className='Statistics__form__textfield'>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Total Training Hours '
                variant='outlined'
                type='number'
                name='totalTrainingHours'
                onChange={statsHandleChange}
                value={statsData.totalTrainingHours}
              />
            </div>
            <div className='Statistics__form__btn'>
              <Button
                sx={{
                  bgcolor: '#00a0ad',
                  color: '#41424C',
                  borderColor: '#41424C',
                  '&:hover': {
                    backgroundColor: '#41424C',
                    color: '#00a0ad'
                  }
                }}
                loading={loadingBtn}
                variant='contained'
                type='submit'
              >
                UPDATE
              </Button>
            </div>
            <div className="Statistics__form__grey__text">
              {(statistics && statistics.totalTrainingHours) ? "Original Number from Database : " + statistics.totalTrainingHours : "Fetching Number..."}
            </div>
          </form>
          <form
            onSubmit={e =>
              handleSubmit(
                'participantsCovered',
                statsData.participantsCovered,
                e
              )
            }
            className='Statistics__form__textfield__container'
          >
            <div className='Statistics__form__textfield'>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Participants Covered '
                variant='outlined'
                type='number'
                name='participantsCovered'
                onChange={statsHandleChange}
                value={statsData.participantsCovered}
              />
            </div>
            <div className='Statistics__form__btn'>
              <Button
                sx={{
                  bgcolor: '#00a0ad',
                  color: '#41424C',
                  borderColor: '#41424C',
                  '&:hover': {
                    backgroundColor: '#41424C',
                    color: '#00a0ad'
                  }
                }}
                loading={loadingBtn}
                variant='contained'
                type='submit'
              >
                UPDATE
              </Button>
            </div>
            <div className="Statistics__form__grey__text">
              {(statistics && statistics.totalParticipants) ? "Original Number from Database : " + statistics.totalParticipants : "Fetching Number..."}
            </div>
          </form>
          <form
            onSubmit={e =>
              handleSubmit('numberOfTrainings', statsData.numberOfTrainings, e)
            }
            className='Statistics__form__textfield__container'
          >
            <div className='Statistics__form__textfield'>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Number Of Trainings '
                variant='outlined'
                type='number'
                name='numberOfTrainings'
                onChange={statsHandleChange}
                value={statsData.numberOfTrainings}
              />
            </div>
            <div className='Statistics__form__btn'>
              <Button
                sx={{
                  bgcolor: '#00a0ad',
                  color: '#41424C',
                  borderColor: '#41424C',
                  '&:hover': {
                    backgroundColor: '#41424C',
                    color: '#00a0ad'
                  }
                }}
                loading={loadingBtn}
                variant='contained'
                type='submit'
              >
                UPDATE
              </Button>
            </div>
            <div className="Statistics__form__grey__text">
              {(statistics && statistics.numberOfTrainings) ? "Original Number from Database : " + statistics.numberOfTrainings : "Fetching Number..."}
            </div>
          </form>
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={loadingBtn}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
    )
}

export default Statistics
