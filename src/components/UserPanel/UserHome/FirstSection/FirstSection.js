import React from 'react'
import './FirstSection.css'
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material'

const FirstSection = ({ heading, number, icon }) => {
  return (
    <div className='FirstSection'>
    <div className='FirstSection__left'>

      <div className='FirstSection__left__heading'>{heading}</div>
      <div className='FirstSection__left__number'>
        {number}
      </div>
    </div>
    <div className='FirstSection__right'>

      <div>
        <Avatar
          sx={{
            backgroundColor: 'success.main',
            height: 55,
            width: 55
          }}
        >
          {icon}
        </Avatar>
      </div>
    </div>
    </div>
  )
}

export default FirstSection
