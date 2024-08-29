import React from 'react'
import './AboutUs.css'
import StatsBanner from '../../components/Home/StatsBanner/StatsBanner'
import background from '../../assets/waveblue.png'
import image from '../../assets/highLightImage.jpg'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const AboutUs = () => {
  return (
    <>
      <Header />

      <div className='AboutUs'>
        <div
          className='AboutUs__banner__sec'
        >
          <div className='AboutUs__banner__content'>
            <div className='AboutUs__banner__content__heading'>
              Improving Lives
            </div>
            <div className='AboutUs__banner__content__text'>
              Through Learning
            </div>
          </div>
        </div>
        <div className='About__learning__container'>
          <div className='About_Us_parent'>
            <div className='About_Us_one'>
              <div
                className='About__learning'
                style={
                  window.innerWidth > 950
                    ? {
                      marginLeft: '5%',
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                    : {
                      marginLeft: '0',
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                }
              >
                <div className='About__learning__heading'>
                  About M&P Learning <br /> Circles
                </div>
                <div className='About__learning__text'>
                  M&P Learning Circles is an interactive, and participatory platform for not just M&P Employees but for anyone who has a knack for learning. The philosophy behind this is to provide training and development opportunities. It is an initiative to make learning easy, accessible and interactive for everyone, digitally, through a learning management system (LMS) and our Subject Matter Experts (SMEs).
                </div>
              </div>
            </div>
            <div
              className='About_Us_two'
              style={
                window.innerWidth > 950
                  ? {
                    minHeight: '400px',
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }
                  : {
                    minHeight: '300px',
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }
              }
            ></div>
          </div>
          <div className='About_Us_parent'>
            <div
              className='About_Us_one'
              style={
                window.innerWidth > 950
                  ? {
                    maxWidth: '60%',
                    minWidth: '60%',
                    minHeight: '400px',
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }
                  : {
                    minHeight: '300px',
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }
              }
            ></div>
            <div
              className='About_Us_two'
              style={
                window.innerWidth > 950
                  ? {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }
                  : {
                    marginTop: '50px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }
              }
            >
              <div
                className='About__learning'
                style={{
                  overflow: 'visible',
                  marginRight: '0%',
                  paddingTop: '10px',
                  paddingBottom: '10px'
                }}
              >
                <div className='About__learning__heading'>
                  About M&P Learning Circles Academy
                </div>
                <div className='About__learning__text'>
                  M&P Learning Circles Academy is a platform to make learning accessible and reachable to all M&P Employees across Pakistan through a digital learning management system.
                  We believe in nurturing our employees by offering the opportunity of acquiring new competencies which can enhance their productivity/ skill set.
                  The programs are designed in such a way where the user gets more learning done in less time. This is because these programs are crisp, modernized and practical, catering to people’s learning needs.
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatsBanner />
        <div style={{ minHeight: '40px' }}></div>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs
