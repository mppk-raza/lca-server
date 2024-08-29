import React from 'react'
import './BooksFilterBar.css'
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
const BooksFilterBar = ({
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
    <div className='BooksFilterBar'>
      <div className='BooksFilterBar__left'>
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
      <div className='BooksFilterBar__right'>
        <div className='BooksFilterBar__mid'>
          <div
            onClick={() => setStatus('All')}
            className={
              status === 'All'
                ? 'BooksFilterBar__mid__item__active'
                : 'BooksFilterBar__mid__item'
            }
          >
            All
          </div>
          <div
            onClick={() => setStatus('Enrolled')}
            className={
              status === 'Enrolled'
                ? 'BooksFilterBar__mid__item__active'
                : 'BooksFilterBar__mid__item'
            }
          >
            Issued{' '}
          </div>
        </div>
        <ThemeProvider theme={orangeTheme}>
          <FormControl size='small' fullWidth>
            <InputLabel id='demo-select-small' sx={{ color: 'white' }}>
              Availability
            </InputLabel>
            <Select
              fullWidth
              labelId='demo-select-small'
              id='demo-select-small'
              value={category}
              label='Availability'
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
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value={true}>Available</MenuItem>
              <MenuItem value={false}>Not Available</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default BooksFilterBar
