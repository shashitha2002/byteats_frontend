'use client'
import React, { useEffect } from 'react'
import { useRestaurantStore } from "@/store/restaurantStore";
import axios from 'axios';
import { Loader } from 'lucide-react';
import { Menu } from '@/interfaces/Menu';
import MenuItemCard from '@/app/components/menuItemCard/page';

const RestaurantMenuPage = () => {

    const { restaurant } = useRestaurantStore();
    const [menu, setMenu] = React.useState<Menu | null>(null);

    useEffect(() => {
        try {
            if(!restaurant?._id) return;

            const fetchMenu = async () => {
                try {
                    const res = await axios.get(`http://byteats.local/api/menu-items/restaurant/${restaurant._id}`);
                    setMenu(res.data);
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            }
            fetchMenu();

        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }, [restaurant])

    if (!menu) {
        return <Loader className="h-6 w-6 animate-spin text-primary" />;
      }

  return (
    <div>
        {menu && menu.items && menu.items.length > 0 && menu.items.map((menuItem, index) => (
            <MenuItemCard key={index} menuItem={menuItem} />
        ))}
    </div>
  )
}

export default RestaurantMenuPage