import React from 'react'
import './CoursesFilterBar.css'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const Search = styled('div')(({ theme }) => ({
  zIndex: 1,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'lightGrey',
  '&:hover': {
    backgroundColor: ' rgba(240, 238, 238, 0.816)'
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    //   marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  zIndex: '7 !important',
  color: 'inherit',
  '& .MuiInputBase-input': {
    zIndex: '7 !important',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '22ch',
      '&:focus': {
        width: '30ch'
      }
    }
  }
}))
const CoursesFilterBar = ({
  category,
  setCategory,
  status,
  setStatus,
  search,
  setSearch
}) => {
  const orangeTheme = createTheme({
    palette: {
      primary: {
        main: '#00a0ad'
      },
      secondary: {
        main: '#fff'
      }
    }
  })
  return (
    <div className='CoursesFilterBar'>
      <div className='CoursesFilterBar__left'>
        {' '}
        <Search sx={{ zIndex: '1' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            sx={{ zIndex: '1' }}
            placeholder='Search…'
            inputProps={{ 'aria-label': 'search' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Search>
      </div>
      <div className='CoursesFilterBar__right'>
        <div className='CoursesFilterBar__mid'>
          <div
            onClick={() => setStatus('All')}
            className={
              status === 'All'
                ? 'CoursesFilterBar__mid__item__active'
                : 'CoursesFilterBar__mid__item'
            }
          >
            All
          </div>
          <div
            onClick={() => setStatus('Available')}
            className={
              status === 'Available'
                ? 'CoursesFilterBar__mid__item__active'
                : 'CoursesFilterBar__mid__item'
            }
          >
            Available
          </div>
          <div
            onClick={() => setStatus('Enrolled')}
            className={
              status === 'Enrolled'
                ? 'CoursesFilterBar__mid__item__active'
                : 'CoursesFilterBar__mid__item'
            }
          >
            Enrolled
          </div>
        </div>

        <ThemeProvider theme={orangeTheme}>
          <FormControl size='small' fullWidth>
            <InputLabel id='demo-select-small' sx={{ color: 'white' }}>
              Category
            </InputLabel>
            <Select
              fullWidth
              labelId='demo-select-small'
              id='demo-select-small'
              value={category}
              label='Category'
              onChange={e => setCategory(e.target.value)}
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
                },
                color: 'white',
                // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                //   borderColor: '#00a0ad',
                // },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00a0ad'
                },
                '.MuiSvgIcon-root ': {
                  fill: 'white !important'
                }
              }}
            >
              <MenuItem value={'All'}>All</MenuItem>
              <MenuItem value={'TNA'}>TNA</MenuItem>
              <MenuItem value={'SOP'}>SOP</MenuItem>
              <MenuItem value={'Public Orientation'}>Public Orientation</MenuItem>
              <MenuItem value={'Others'}>Others</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default CoursesFilterBar
