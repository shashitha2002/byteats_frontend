import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const DeliveryPersonRegistration = () => {
  return (
    <div className="space-y-4">
            <Input type="text" placeholder="Name" />
            <Input type="email" placeholder="Email" />
            <Input type="number" placeholder="Age" />
            <Input type="number" placeholder="NIC" />
            <Input type="text" placeholder="vehicle Number" />
            <Input type="text" placeholder="current location" />
            <Input type="text" placeholder="Address" />
            <Input type="text" placeholder="license Number" />
            <Input type="password" placeholder="Enter Password" />
            <Input type="password" placeholder="re-enter the Password" />
            <Input type="number" placeholder="mobile number" />   
            <Button className="w-full mt-2" variant="default">
              Register
            </Button>         
          </div>
  )
}

export default DeliveryPersonRegistration