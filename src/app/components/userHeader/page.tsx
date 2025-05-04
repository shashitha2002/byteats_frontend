import React from 'react'
import LoginButton from '../loginButton/page'
import RegisterButton from '../registerButton/page'

const UserHeader = () => {
  return (
    <div className="flex items-center w-full justify-between p-4 bg-[#8b0000] text-white">
        <h1 className='font-bold text-2xl'>BYTEats</h1>
        <div className='flex gap-4'>
            <LoginButton />
            <RegisterButton />
        </div>
    </div>
  )
}

export default UserHeader