import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { useDeliveryPersonStore } from "@/store/deliveryPersonStore";

const DeliveryPersonRegistration = () => {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = React.useState<string>("");
  const [mobile, setMobile] = React.useState<string>("");
  const [age, setAge] = React.useState<string>("");
  const [NIC, setNIC] = React.useState<string>("");
  const [vehicleNumber, setVehicleNumber] = React.useState<string>("");
  const [currentLocation, setCurrentLocation] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [licenseNumber, setLicenseNumber] = React.useState<string>("");

  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  const router = useRouter();
  const { setDeliveryPersonToken, setDeliveryPerson } = useDeliveryPersonStore();

  const handleRegister = async () => {

    const data = {
      name,
      email,
      password,
      confirmedPassword,
      mobile,
      age,
      NIC,
      vehicleNumber,
      currentLocation,
      address,
      licenseNumber,
    };

    const res = await axios.post("http://localhost:5000/api/deliveryPerson/register", data);

    if (res.status === 201) {
      setSuccess("Delivery Person Successfully Created");
      setDeliveryPerson(res.data.deliveryPerson);
      setDeliveryPersonToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.deliveryPerson));
      router.push("/deliveryPerson");
    } else {
      setError("Registration failed. Please try again.");
    }

  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">
          Delivery Person created successfully!
        </div>
      )}
      <Input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
      <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
      <Input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)}/>
      <Input type="number" placeholder="NIC" onChange={(e) => setNIC(e.target.value)}/>
      <Input type="text" placeholder="vehicle Number" onChange={(e) => setVehicleNumber(e.target.value)}/>
      <Input type="text" placeholder="current location" onChange={(e) => setCurrentLocation(e.target.value)}/>
      <Input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
      <Input type="text" placeholder="license Number" onChange={(e) => setLicenseNumber(e.target.value)}/>
      <Input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
      <Input type="password" placeholder="re-enter the Password" onChange={(e) => setConfirmedPassword(e.target.value)}/>
      <Input type="number" placeholder="mobile number" onChange={(e) => setMobile(e.target.value)}/>
      <Button className="w-full mt-2" variant="default" onClick={handleRegister}>
        Register
      </Button>
    </div>
  );
};

export default DeliveryPersonRegistration;
