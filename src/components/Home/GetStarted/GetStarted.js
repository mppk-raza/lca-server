import React from 'react'
import "./GetStarted.css"
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();
  return (
    <div className='GetStarted'>
      <div className='GetStarted__heading'>
        Unlock the power of learning today
      </div>
      <div className='GetStarted__btn'>
        <div className="btn color" onClick={() => {navigate("/"); window.scrollTo(0,0)}}>
          Get Started
        </div>
      </div>
    </div>
  )
}

export default GetStarted