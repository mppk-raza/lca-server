import React, { useState, useEffect } from 'react'
import './NominateUnderlings.css'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles (name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}
const NominateUnderlings = ({ data, underlingsList, refresh, setRefresh }) => {
  const orangeTheme = createTheme({
    palette: {
      primary: {
        main: '#00a0ad'
      },
      secondary: {
        main: '#41424C'
      }
    }
  })

  const [open, setOpen] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [training, setTraining] = useState(data.data?._id)
  const theme = useTheme()
  const [underlings, setUnderlings] = useState([])
  const handleChange = event => {
    const {
      target: { value }
    } = event
    setUnderlings(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  let nom = underlings.map(cur => {
    let temp = JSON.parse(cur)
    return {
      name: temp.name,
      user_id: temp._id,
      email: temp.email,
      isEmployee: temp.isEmployee
    }
  })
  console.log(nom)

  const handleSubmit = () => {
    if (!training || !underlings || underlings.length < 1) {
      toast.warn('Please select both')
    } else {
      setLoadingBtn(true)
      let body = {
        token: localStorage.getItem('token'),
        nominations: underlings.map(cur => {
          let temp = JSON.parse(cur)
          return {
            name: temp.name,
            user_id: temp._id,
            email: temp.email,
            isEmployee: temp.isEmployee
          }
        }),
        trainingID: training
      }
      console.log(body)
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + '/api/trainings/nominateByManager',
      body
        )
        .then(res => {
          console.log(res)
          if (res.data.error !== true) {
            toast.success(
              res.data.message +
                ' Added Users ' +
                res.data.addCount +
                ' Repeated Users ' +
                res.data.repeatCount
            )
            setLoadingBtn(false)
            setRefresh(!refresh)
            handleClose()
          } else {
            toast.warn(res.data.message)
            setLoadingBtn(false)
          }
        })
        .catch(err => {
          console.log(err)
          setLoadingBtn(false)
        })
    }
  }

  return (
    <>
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
      <div onClick={handleOpen} className='OneTraining__right__btn'>
        Nominate Underlings
      </div>
      <ThemeProvider theme={orangeTheme}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box className='NominateUnderlings__modal' sx={style}>
            <div className='NominateUnderlings__modal__heading'>
              Nominate Underlings
            </div>
            <div className='NominateUnderlings__modal__select__container'>
              <div className='NominateUnderlings__modal__trainings'>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    Trainings
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    // defaultValue={data.data?.name}
                    value={training}
                    label='Trainings'
                    onChange={e => setTraining(e.target.value)}
                  >
                    {data.trainings?.map((cur, ind) => {
                      return (
                        <MenuItem key={ind} value={cur._id}>
                          {cur.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className='NominateUnderlings__modal__underlings'>
                <FormControl fullWidth>
                  <InputLabel id='demo-multiple-chip-label'>
                    Underlings
                  </InputLabel>
                  <Select
                    labelId='demo-multiple-chip-label'
                    id='demo-multiple-chip'
                    multiple
                    value={underlings}
                    onChange={handleChange}
                    input={
                      <OutlinedInput
                        id='select-multiple-chip'
                        label='Underlings'
                      />
                    }
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value, ind) => {
                          let temp = JSON.parse(value)
                          return <Chip key={ind} label={temp.name} />
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {underlingsList?.map((name, ind) => (
                      <MenuItem
                        key={ind}
                        value={JSON.stringify(name)}
                        style={getStyles(name.name, underlings, theme)}
                      >
                        {name.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div>
              <LoadingButton
                fullWidth
                variant='outlined'
                loading={loadingBtn}
                onClick={handleSubmit}
              >
                Nominate
              </LoadingButton>
            </div>
          </Box>
        </Modal>
      </ThemeProvider>
    </>
  )
}

export default NominateUnderlings
