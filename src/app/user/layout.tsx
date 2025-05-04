import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserSideBar from "../components/user-sidebar/page";
import LogOutButton from "../components/logoutButton/page";
import Footer from "@/app/footer/page";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UserSideBar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 bg-[#8b0000] text-white w-full">
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
