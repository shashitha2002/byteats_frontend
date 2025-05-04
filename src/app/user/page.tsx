'use client'
import React from 'react'
import {useUserStore} from "@/store/userStore";
import UserRestaurantPage from './restaurants/page';

const UserHomePage = () => {

  const {user} = useUserStore();

  return (
    <div>
      <h1>Hello Welcome {user?.username}</h1>

      <div>
        <UserRestaurantPage/>
      </div>
    </div>
  )
}

export default UserHomePage