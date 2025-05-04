import React from 'react'
import LoginButton from '../components/loginButton/page'
import RegisterButton from '../components/registerButton/page'
 

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-[#8b0000] text-white">
        <h1 className='font-bold text-2xl'>BYTEats</h1>
        <div className='flex gap-4'>
            <LoginButton />
            <RegisterButton />
        </div>
    </header>
  )
}

export default Header