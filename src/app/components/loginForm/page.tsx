"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import {useRestaurantStore} from "@/store/restaurantStore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const LoginForm = () => {
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setToken, setUser } = useUserStore();
  const {setRestaurantToken, setRestaurant} = useRestaurantStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const loginData = {
        email: email,
        password: password,
      };


      if (role === "user"){
        const res = await axios.post(
          `http://localhost:5000/api/auth/login`,
          loginData
        );

        if (res.status === 201) {
          setUser(res.data.user);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          router.push("/user");
        }
      }
      else if(role === "restaurant"){
        const res = await axios.post(
          `http://localhost:5000/api/restaurant/login`,
          loginData
        );

        if (res.status === 201) {
          setRestaurant(res.data.restaurant);
          setRestaurantToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.restaurant));
          router.push("/restaurant");
        }
      }
      else if(role === "deliveryPerson"){
        const res = await axios.post(
          `http://localhost:5000/api/deliveryPerson/login`,
          loginData
        );

        if (res.status === 201) {
          setUser(res.data.deliveryPerson);
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.deliveryPerson));
          router.push("/deliveryPerson");
        }
      }

      
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-8 mt-12 border-2 border-gray-300 rounded-2xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login to Your Account
      </h2>
      <div className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full mt-2 bg-white text-black border-2 border-black border-solid hover:bg-white rounded-lg text-lg font-semibold">
            {role === "" ? "You want to log as?" : role}
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

        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full mt-2" variant="default" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
