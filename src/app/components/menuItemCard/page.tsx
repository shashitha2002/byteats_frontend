import React from 'react'
import { MenuItem } from '@/interfaces/MenuItem';
import Image from 'next/image';
import { Edit, Trash } from 'lucide-react';

interface MenuItemCardProps {
    menuItem : MenuItem;
}

const MenuItemCard = ({menuItem} : MenuItemCardProps) => {
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 mb-5">
    {/* Image - Left side */}
    <div className="w-32 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
      <Image
        src={menuItem.imageUrl}
        alt={menuItem.name}
        fill
        className="object-cover"
      />
    </div>
    
    {/* Content - Right side */}
    <div className="ml-4 flex-grow flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{menuItem.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{menuItem.description}</p>
        </div>
        <span className="font-medium text-green-600 text-lg">${menuItem.price.toFixed(2)}</span>
      </div>
      
      <div className="mt-auto flex justify-between items-center pt-2">
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
          {menuItem.category}
        </span>
        
        <div className="flex space-x-2">
          <button
            
            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
            aria-label="Edit item"
          >
            <Edit size={16} />
          </button>
          <button
            
            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            aria-label="Delete item"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MenuItemCard