'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from 'next/navigation';

interface MenuItemDeleteButtonProps {
    menuItemId: string;
}

const MenuItemDeleteButton = ({menuItemId} : MenuItemDeleteButtonProps) => {

    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://byteats.local/api/menu-items/${menuItemId}`);
            if (response.status === 200) {
                alert("Menu item deleted successfully!");
                router.refresh();
            } else {
                alert("Failed to delete menu item.");
            }
        } catch (error) {
            console.error("Error deleting menu item:", error);
        }
    }

  return (
    <Button className="text-white bg-red-700 hover:bg-red-900" onClick={handleDelete}>Delete</Button>
  );
};

export default MenuItemDeleteButton;
