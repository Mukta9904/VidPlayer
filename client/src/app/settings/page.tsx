import React from 'react'
import Logout from '@/components/Logout/page'
import ReduxProvider from '@/components/ReduxProvider'
const page = () => {
  return (
    <ReduxProvider>
    <div>
      <Logout />
    </div>
    </ReduxProvider>
  )
}

export default page
