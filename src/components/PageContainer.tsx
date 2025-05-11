import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar';

type PageContainerProps = {
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
    <Navbar />
      <main className='px-5'>
        {children}
      </main>
    </>
  )
}

export default PageContainer