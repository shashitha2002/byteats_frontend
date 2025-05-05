"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

interface ClientProps {
  id: string;
}

const MenuItemCreationPage = ({ id }: ClientProps) => {
  const router = useRouter();
  
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [category, setCategory] = React.useState<string>("");
  const [image, setImage] = React.useState<File | null>(null);
  const [fileKey, setFileKey] = React.useState<number>(0); // Add a key for file input

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !image) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("restaurantId", id);
    formData.append("image", image);

    try {
      const response = await axios.post('http://byteats.local/api/menu-items/', formData);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to create menu item");
      }

      alert("Menu item created successfully!");
      
      // Reset the form
      setName("");
      setDescription("");
      setPrice(0);
      setCategory("");
      setImage(null);
      setFileKey(prevKey => prevKey + 1); // Reset file input
      
      // Use router.push instead of redirect
      router.push(`/restaurant/menu`);
    } catch (error) {
      console.error(error);
      alert("Error creating menu item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Add Food Item To Your Menu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="food-name" className="mb-2 block text-gray-700">
              Food Name
            </Label>
            <Input
              id="food-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of the food"
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type your description here."
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2 block text-gray-700">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Price"
            />
          </div>

          <div>
            <Label className="mb-2 block text-gray-700">Food Category</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-between">
                  {category === "" ? "Select the food category" : category}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>Food Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={category}
                  onValueChange={setCategory}
                >
                  <DropdownMenuRadioItem value="Appetizers">
                    Appetizers
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Soups & Salads">
                    Soups & Salads
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Main Courses">
                    Main Courses
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Desserts">
                    Desserts
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Sides">
                    Sides
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Beverages">
                    Beverages
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <Label htmlFor="picture" className="mb-2 block text-gray-700">
              Picture
            </Label>
            <Input 
              key={fileKey}
              id="image" 
              type="file" 
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Add To Menu
            </Button>
            <Button 
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => router.push(`/restaurants/menu/${id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemCreationPage;