"use client";
import React, { useEffect } from "react";
import Restaurant from "../../../interfaces/Restaurant";
import axios from "axios";
import UserRestaurantCard from "../../components/userRestaurantCard/page";
import { Skeleton } from "@/components/ui/skeleton"


const UserRestaurantPage = () => {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/restaurant/");
        setRestaurants(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

return (
  <>
    {loading ? (
      <Skeleton />
    ) : (
      <UserRestaurantCard restaurants={restaurants} />
    )}
  </>
);
};

export default UserRestaurantPage;
