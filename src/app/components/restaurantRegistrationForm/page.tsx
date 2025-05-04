import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import {useRestaurantStore} from "@/store/restaurantStore";
import axios from "axios";


interface CloudinaryResult {
  public_id: string;
}

const RestaurantRegistrationForm = () => {

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [ownerName, setOwnerName] = React.useState<string>("");
  const [mobile, setMobile] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);

  const [publicId, setPublicId] = React.useState<string>("");

  const router = useRouter();

  const {setRestaurantToken, setRestaurant} = useRestaurantStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name || !email || !password || !location || !ownerName || !mobile || !publicId) {
      setError("Please fill in all fields.");
      return;
    }

    const restaurantData = {
      name,
      email,
      password,
      location,
      owner_name : ownerName,
      mobile,
      role: "restaurant",
      imageUrl: publicId
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/restaurant/register",
        restaurantData
      );

      if (response.status === 201) {
        setSuccess(true);
        setRestaurant(response.data.restaurant);
        setRestaurantToken(response.data.token);
        setTimeout(() => {
          router.push("/restaurant");
        }, 2000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">
          Restaurant created successfully!
        </div>
      )}
            <Input type="text" placeholder="Restaurant Name" value={name}
            onChange={(e) => setName(e.target.value)}/>
            <Input type="text" placeholder="Restaurant Location" value={location}
            onChange={(e) => setLocation(e.target.value)}/>
            <Input type="text" placeholder="Restaurant Owner" value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}/>
            <Input type="email" placeholder="Restaurant Email" value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            <Input type="password" placeholder="Enter Password" value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <Input type="password" placeholder="re-enter the Password" value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}/>
            <Input type="number" placeholder="mobile number" value={mobile}
            onChange={(e) => setMobile(e.target.value)}/>
            <div>
          <label
            htmlFor="Image-Upload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <CldUploadWidget uploadPreset="kwikjudn" 
          onSuccess={(result) => {
            if(result.event !== "success") return;
            const info = result.info as CloudinaryResult;
            setPublicId(info.public_id); 
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}>
            {({ open }) => {
              return (
                <button
                  type="button"
                  className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={() => open()}
                >
                  Upload an Image
                </button>
              );
            }}
          </CldUploadWidget>
        </div> 
            <Button className="w-full mt-2" variant="default" onClick={handleSubmit} disabled={!publicId}>
            {publicId ? "Create Restaurant" : "Upload Image First"}
            </Button>         
          </div>
  )
}

export default RestaurantRegistrationForm