'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const RegisterButton = () => {

    const router = useRouter()

  return (
    <Button className='bg-white text-black border border-neutral-400 hover:bg-gray-100' onClick={() => router.push('/auth/register')}>Sign up</Button>
  )
}

export default RegisterButton