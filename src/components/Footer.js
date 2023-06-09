import React from 'react'

import logo from '../assets/image/logo-footer.svg'

const Footer = () => {
  return (
    <div className='pt-10 pb-4 px-20 flex flex-col justify-center items-center'> 
      <img src={logo} alt="logo" className='w-[108px] h-[100px] mb-6' />
      <div className='text-sm text-primary-color mb-0'>
        Made with <p className='inline-block text-red-500 text-[15px]'>&#10084;</p> by Le Dinh Huy</div>
    </div>
  )
}

export default Footer