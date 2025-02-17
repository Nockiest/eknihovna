import React from 'react'
import CatalogContextProvider from '../CatalogContextProvider'
import BookDetailPage from './BookDetailPage'

const page = () => {
  return (
    <CatalogContextProvider>
      <BookDetailPage/>
    </CatalogContextProvider>
  )
}

export default page