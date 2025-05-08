'use client'
import React, { useEffect } from 'react'
import {useRestaurantStore} from "../../store/restaurantStore"
import Restaurant from '@/interfaces/Restaurant';
import Image from 'next/image';

const RestaurantHomePage = () => {
  const [restaurantDetails, setRestaurantDetails] = React.useState<Restaurant | null>(null);
  const {restaurant} = useRestaurantStore(); 

  function getImageUrl(publicId: string): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const transformations = "c_limit,w_1920,f_auto,q_auto";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  }

  useEffect(() => {
    if (!restaurant?._id) return;
    
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/restaurant/${restaurant._id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: Restaurant = await res.json();
        setRestaurantDetails(data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };
    
    fetchRestaurant();
  }, [restaurant]);

  if (!restaurantDetails) {
    return <div className="flex items-center justify-center h-screen">Loading restaurant details...</div>;
  }

  return (
    <>
      <div className="relative w-full h-[400px]">
        <Image
          src={getImageUrl(restaurantDetails.imageUrl)}
          alt={restaurantDetails.name}
          fill
          className="object-cover brightness-75" // darker image
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
            {restaurantDetails.name}
          </h1>
        </div>
      </div>
      <div className="space-y-6 m-10">
        <h2 className="text-3xl italic font-semibold underline">
          About {restaurantDetails.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xl font-semibold">Location:</p>
            <p className="text-lg font-light">{restaurantDetails.location}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Owner Name:</p>
            <p className="text-lg font-light">{restaurantDetails.owner_name}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Email:</p>
            <p className="text-lg font-light">{restaurantDetails.email}</p>
          </div>
          <div>
            <p className="text-xl font-semibold">Mobile:</p>
            <p className="text-lg font-light">{restaurantDetails.mobile}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default RestaurantHomePage