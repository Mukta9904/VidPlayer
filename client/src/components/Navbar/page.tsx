import React from 'react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme-toggle'

const Navbar = () => {
  return (
    <div className='w-full px-6 h-full flex items-center justify-between'>
      <div className='flex justify-center items-center gap-3'>
         <img src="assets/logo3.png" className='ml-4 w-14 rounded-full' alt="logo" />
       
      </div>
      <div >
         <input className=' w-96 h-12 rounded-full  px-6 border-[1px] box-border ' type="Search" placeholder='Search' name="searchBar" id="search" />
      </div>
      <div className='flex gap-6'>
         <div className='flex gap-3'>
            <Button variant="secondary">Sign Up</Button>
            <Button >Log In</Button>
         </div>
         <div>
            <ThemeToggle/>
         </div>
      </div>
    </div>
  )
}

export default Navbar
