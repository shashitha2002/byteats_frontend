"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserRegistrationForm from "../userRegistrationForm/page";
import RestaurantRegistrationForm from "../restaurantRegistrationForm/page";
import DeliveryPersonRegistrationForm from "../deliveryPersonRegistration/page";

const RegisterForm = () => {
  const [role, setRole] = useState<string>("user");

  return (
    <div className="max-w-sm mx-auto p-8 mt-12 border-2 border-gray-300 rounded-2xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create a New User Account
      </h2>
      <div className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full mt-2 bg-white text-black border-2 border-black border-solid hover:bg-white rounded-lg text-lg font-semibold">
            {role}
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Select One</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRole("user")}>
              user
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("restaurant")}>
              restaurant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("deliveryPerson")}>
              delivery Person
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {role === "user" ? (
          <UserRegistrationForm />
        ) : role === "restaurant" ? (
          <RestaurantRegistrationForm />
        ) : (
          <DeliveryPersonRegistrationForm />
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
