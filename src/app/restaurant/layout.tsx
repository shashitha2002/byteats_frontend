import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LogOutButton from "../components/logoutButton/page";
import Footer from "@/app/footer/page";
import RestaurantSideBar from "../components/restaurant-sidebar/page";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RestaurantSideBar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 bg-[#fefe40] text-black w-full">
            <SidebarTrigger />
            <h1 className="font-bold text-2xl">BYTEats</h1>
            <div className="flex gap-4">
              <LogOutButton />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
