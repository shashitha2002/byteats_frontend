'use client'
import React, { useEffect } from 'react'
import { Menu } from '@/interfaces/Menu'
import Image from 'next/image';
import { Loader } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface RestaurantMenuPageProps {
  id: string;
}
const RestaurantMenuPage = ({ id }: RestaurantMenuPageProps) => {
  
  const [menu, setMenu] = React.useState<Menu | null>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
          const response = await fetch(`http://localhost:5001/api/menu-items/restaurant/${id}`); 
        /* const response = await fetch(`http://byteats.local/api/menu-items/restaurant/${id}`); */
        const data = await response.json();
        setMenu(data);
        console.log("Menu Data:", data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }finally {
        setLoading(false);
      }
    };
    fetchMenu();
  },[id])

  const itemsByCategory = menu?.items?.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof menu.items>) || {};

  const handleAddToCart = async (item: Menu['items'][number]) => {
    const userId = useUserStore.getState().user?._id; //fetch userid from localstorage

    if (!userId) {
      console.log("user not logged in...");
      return;
    }

    try {
      await axios.post('http://localhost:5002/api/cart/add', {
        userId,
        itemId: item._id,
        quantity: 1,
        price: item.price,
        name: item.name,
        imageUrl: item.imageUrl
      });
      console.log(`${item.name} added to cart!`);
      router.push('/user/cart');

    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  return (

    <div className="space-y-12">
      {loading && <div className="flex justify-center items-center">
    <Loader className="h-6 w-6 animate-spin text-primary" />
  </div>}  
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <section key={category} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{category}</h2>
            <Carousel
              opts={{ align: "start" }}
              className="w-full max-w-6xl"
            >
              <CarouselContent>  
                {items.map((item) => (
                  <CarouselItem key={item._id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                      <Popover>
                        <PopoverTrigger>
                      <div className="relative h-[220px] w-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <p className="text-primary text-xl font-bold mt-2">Rs. {item.price}</p>
                      </CardContent>
                      </PopoverTrigger>
                      <PopoverContent className='bg-gray-100'>

                        {/* Add to cart button is here */}
                        <div><p className='font-light'>Do you want to add <span className='font-medium'>{item.name}</span> to the cart?</p></div>
                        <Button className='mt-2 bg-green-600' onClick={() => handleAddToCart(item)}>Add To Cart</Button>
                        
                        </PopoverContent>
                      </Popover>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        ))}
      </div>
  )
}

export default RestaurantMenuPage