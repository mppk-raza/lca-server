import React, { useEffect } from 'react'
import './HighLights.css'
import highLightImage from '../../../assets/temp.png'
import background from '../../../assets/waveblue.png'
import videoBackground from '../../../assets/02.png'
import { useNavigate } from 'react-router-dom'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import { ThemeProvider, createTheme } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import axios from 'axios'

const orangeTheme = createTheme({
  palette: { primary: { main: '#00a0ad' }, secondary: { main: '#41424C' } }
})

const HighLights = () => {
  const [volume, setVolume] = React.useState(false)
  const [highLightVideo, setHighLightVideo] = React.useState()
  const navigate = useNavigate()
  const getHomeVideo = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + '/api/homeBanner/getHomeVideo')
      .then(res => {
        console.log(res)
        setHighLightVideo(res.data.data.bannerLink)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    getHomeVideo()
  }, [])

  return (
    <div
      className='HighLights'
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 25%"
      }}
    >
      <div className='HighLights__content__img__container'>
        <div className='HighLights__content__box'>
          <div className='HighLights__content__heading'>
            Unlock the Power of Learning
          </div>
          <div className='HighLights__content__text'>
            With a learning management system, we can create a single source of
            online courses and training materials. which becomes a unique source
            of knowledge in every corner of the nation, so that you can keep and
            increase the in-house expertise of your company, manage courses and
            learners, and even improve your own efficiency with increasing
            levels of on-going trainings culture.
          </div>
          <div
            className='more__btn color'
            onClick={() => {
              navigate('/aboutUs')
              window.scrollTo(0, 0)
            }}
          >
            Read More
          </div>
        </div>
        <div className='HighLights__img__box'>
          <img className='HighLights__img' src={highLightImage} />
        </div>
      </div>
      <div className='HighLights__video__box'>
        <div className='HighLights__video__heading'>HOW IT WORKS</div>
        <div className='HighLights__video__sub__heading'>
          See Learning Center in Action
        </div>
        <div
          className='HighLights__video__container'
          style={{
            backgroundImage: `url(${videoBackground})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className='HighLights__video'>
            {highLightVideo ? (
              <video
                style={{ borderRadius: '5px' }}
                src={highLightVideo}
                autoPlay={true}
                controls={false}
                loop={true}
                height='auto'
                width='100%'
                muted={!volume}
              />
            ) : (
              <Skeleton
                sx={{ bgcolor: '#41424c' }}
                animation='wave'
                variant='rectangular'
                width='90vw'
                height='65vh'
              />
            )}
            <div
              className='HighLights__video__volume'
              onClick={() => {
                setVolume(!volume)
              }}
            >
              <ThemeProvider theme={orangeTheme}>
                {volume ? (
                  <VolumeUpRoundedIcon color='primary' />
                ) : (
                  <VolumeOffRoundedIcon color='secondary' />
                )}
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HighLights
