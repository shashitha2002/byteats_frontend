'use client'
import MenuItemUpdateForm from '@/app/components/menuItemUpdateForm/page'
import { useParams } from 'next/navigation';
import React from 'react'

const MenuItemUpdatePage = () => {

  const params = useParams();
  const id = params?.id as string;
  
  return (
    <MenuItemUpdateForm MenuItemId={id}/>
  )
}

export default MenuItemUpdatePage