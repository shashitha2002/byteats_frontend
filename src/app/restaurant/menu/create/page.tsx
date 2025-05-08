'use client'
import React from 'react'
import MenuItemCreationPage from '@/app/components/menuItemCreateForm/page'
import { useRestaurantStore } from '@/store/restaurantStore'

const MenuItemCreatePage = () => {

  const { restaurant} = useRestaurantStore();

  return (
    <MenuItemCreationPage id={restaurant?._id || ''}/>
  )
}

export default MenuItemCreatePage