import React, { useState } from 'react'
import './StatsBanner.css'
import { TbWorld } from 'react-icons/tb'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { BsPeople } from 'react-icons/bs'
import { BsCardList } from 'react-icons/bs'
import ScrollTrigger from 'react-scroll-trigger'
import CountUp from 'react-countup'
import axios from 'axios'

const StatsBanner = () => {
  const [counteron, setCounterOn] = useState(true)
  const [statsData, setStatsData] = useState(null)

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
        console.log(err)
      })
  }, [])

  return (
    <div className='stats__banner'>
      <div className='stats__banner__cards__box'>
        <div className='stats__banner__card'>
          <div className='stats__banner__card__icon'>
            <TbWorld />
          </div>
          <ScrollTrigger
            onEnter={() => setCounterOn(true)}
            onExit={() => setCounterOn(false)}
          >
            <div className='stats__banner__card__stats'>
              {counteron && (
                <CountUp
                  start={0}
                  end={statsData?.locationsCovered}
                  duration={1}
                  delay={0}
                />
              )}
              +
            </div>
          </ScrollTrigger>
          <div className='stats__banner__card__title'>Locations Covered</div>
        </div>
        <div className='stats__banner__card'>
          <div className='stats__banner__card__icon'>
            <AiOutlineFieldTime />
          </div>
          <ScrollTrigger
            onEnter={() => setCounterOn(true)}
            onExit={() => setCounterOn(false)}
          >
            <div className='stats__banner__card__stats'>
              {counteron && (
                <CountUp
                  start={0}
                  end={statsData?.totalTrainingHours}
                  duration={1}
                  delay={0}
                />
              )}
              +
            </div>
          </ScrollTrigger>
          <div className='stats__banner__card__title'>Total Training Hours</div>
        </div>
        <div className='stats__banner__card'>
          <div className='stats__banner__card__icon'>
            <BsPeople />
          </div>
          <ScrollTrigger
            onEnter={() => setCounterOn(true)}
            onExit={() => setCounterOn(false)}
          >
            <div className='stats__banner__card__stats'>
              {counteron && (
                <CountUp
                  start={0}
                  end={statsData?.participantsCovered}
                  duration={1}
                  delay={0}
                />
              )}
              +
            </div>
          </ScrollTrigger>
          <div className='stats__banner__card__title'>Participants covered</div>
        </div>
        <div className='stats__banner__card'>
          <div className='stats__banner__card__icon'>
            <BsCardList />
          </div>
          <ScrollTrigger
            onEnter={() => setCounterOn(true)}
            onExit={() => setCounterOn(false)}
          >
            <div className='stats__banner__card__stats'>
              {counteron && (
                <CountUp
                  start={0}
                  end={statsData?.numberOfTrainings}
                  duration={1}
                  delay={0}
                />
              )}
              +
            </div>
          </ScrollTrigger>
          <div className='stats__banner__card__title'>Number of Trainings</div>
        </div>
      </div>
    </div>
  )
}

export default StatsBanner
