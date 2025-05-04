import React from "react";
import Restaurant from "@/interfaces/Restaurant";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantMenuPage from "@/app/user/menu/[id]/page";

interface Props {
  params: {
    id: string;
  };
}

const RestaurantDetailsPage = async ({ params }: Props) => {
  const { id } = params;
  const res = await fetch(`http://localhost:5000/api/restaurant/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const restaurant: Restaurant = await res.json();

  function getImageUrl(publicId: string): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const transformations = "c_limit,w_1920,f_auto,q_auto";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header Image */}
      <div className="relative w-full h-[400px]">
        <Image
          src={getImageUrl(restaurant.imageUrl)}
          alt={restaurant.name}
          fill
          className="object-cover brightness-75" // darker image
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
            {restaurant.name}
          </h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex-1 p-6 md:p-10">
        <Tabs defaultValue="About" className="w-full">
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="About" className="text-lg">
              About
            </TabsTrigger>
            <TabsTrigger value="Menu" className="text-lg">
              Menu
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="About">
            <div className="space-y-6">
              <h2 className="text-3xl italic font-semibold underline">
                About {restaurant.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xl font-semibold">Location:</p>
                  <p className="text-lg font-light">{restaurant.location}</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">Owner Name:</p>
                  <p className="text-lg font-light">{restaurant.owner_name}</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">Email:</p>
                  <p className="text-lg font-light">{restaurant.email}</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">Mobile:</p>
                  <p className="text-lg font-light">{restaurant.mobile}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="Menu">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <RestaurantMenuPage id={restaurant._id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;
