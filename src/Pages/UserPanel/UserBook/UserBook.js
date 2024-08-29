import React, { useState, useEffect } from 'react'
import './UserBook.css'
import BooksFilterBar from '../../../components/UserPanel/UserBook/BooksFilterBar/BooksFilterBar'
import BooksList from '../../../components/UserPanel/UserBook/BooksList/BooksList'
import CoursesPagination from '../../../components/CoursesPagination/CoursesPagination'
import axios from 'axios'

const UserBook = () => {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [booksData, setBooksData] = useState()

  const pageSize = 10
  let retrievedObject = localStorage.getItem('user')
  const user = JSON.parse(retrievedObject)

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize
  })

  useEffect(() => {
    setLoading(true)
    axios
      .get(process.env.REACT_APP_BACKEND_URL + '/api/books/getBooks')
      .then(res => {
        const books = res?.data?.data?.filter((obj) => {return obj.isDeleted === false});
        setBooksData(books)
        setPagination({ ...pagination, from: 0, count: books.length })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  useEffect(() => {
    const tempFilter = booksData?.filter(obj => {
      if (search === '') {
        return obj
      } else if (obj.title.toLowerCase().includes(search?.toLowerCase())) {
        return obj
      }
    })
    setPagination({ ...pagination, from: 0, count: tempFilter?.length })
  }, [search])

  useEffect(() => {
    const tempFilter = booksData?.filter(obj => {
      if (status === 'All') {
        return obj
      } else {
        return obj.bookedBy === user._id
      }
    })
    setPagination({ ...pagination, from: 0, count: tempFilter?.length })
  }, [status])

  useEffect(() => {
    const tempFilter = booksData?.filter(obj => {
      if (category === 'All') {
        return obj
      } else {
        return obj.available === category
      }
    })
    setPagination({ ...pagination, from: 0, count: tempFilter?.length })
  }, [category])

  return (
    <div className='UserBook'>
      <div className='UserBook__heading'>Books List</div>
      <BooksFilterBar
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />
      <BooksList
        booksData={booksData}
        search={search}
        status={status}
        category={category}
        pagination={pagination}
        loading={loading}
      />
      {!loading ? (
        <CoursesPagination
          pageSize={pageSize}
          pagination={pagination}
          setPagination={setPagination}
        />
      ) : null}
    </div>
  )
}

export default UserBook
