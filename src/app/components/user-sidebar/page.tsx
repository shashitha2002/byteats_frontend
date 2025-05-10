"use client";
import { PackageOpen, HandCoins , Settings,House,ShoppingCart,ListOrdered } from "lucide-react";
import { useUserStore } from "@/store/userStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Restaurants",
    url: '/user/restaurants',
    icon: House,
  },
  {
    title: "Orders",
    url: "#",
    icon: PackageOpen,
  },
  {
    title: "TrackOrders",
    url: "/user/track-orders",
    icon: ListOrdered,
  },
  {
    title: "Cart",
    url: "/user/cart",
    icon: ShoppingCart,
  },
  {
    title: "Payments",
    url: "#",
    icon: HandCoins ,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const UserSideBar = () => {
  const { user } = useUserStore();

  return (
    <Sidebar className="min-h-screen bg-white shadow-lg">
  <SidebarContent className="p-4">
    <SidebarGroup>
      <SidebarGroupLabel>
        <div className="flex justify-center items-center py-6">
          <span className="text-3xl font-bold text-gray-800 tracking-wide">Tasks</span>
        </div>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-700"
                >
                  <item.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <SidebarFooter className="p-4 mt-auto">
    <div className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-md text-center">
      <h1 className="text-lg font-semibold">{user?.username || "Guest"}</h1>
    </div>
  </SidebarFooter>
</Sidebar>

  );
};

export default UserSideBar;
