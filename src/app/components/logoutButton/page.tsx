'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";
import {useUserStore} from "../../../store/userStore"
import React from 'react'

const LogOutButton = () => {
    const router = useRouter();
    const {logout} = useUserStore();

    const handleLogOut = () => {
        logout();
        router.push("/auth/login");
    }

  return (
    <Button
      className="bg-amber-50 text-black hover:bg-amber-100"
      onClick={handleLogOut}
    >
      log out
    </Button>
  )
}

export default LogOutButton