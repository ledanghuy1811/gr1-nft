import React from 'react'

import logoHeader from '../assets/image/logo-header.svg'

const Header = () => {
  return (
    <div id='header' className='fixed top-0 left-0 right-0 h-[120px] flex justify-between items-center bg-primary-color px-[198px] py-5'>
      <img src={logoHeader} alt="logo" className='w-[88px] h-20' />
      <h1 className='mb-0 font-semibold text-white'>NFT by Huy</h1>
    </div>
  )
}

export default Header