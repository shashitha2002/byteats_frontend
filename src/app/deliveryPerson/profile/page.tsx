"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeliveryPersonStore } from "@/store/deliveryPersonStore";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliveryPersonProfile {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  NIC: string;
  vehicleNumber: string;
  currentLocation?: {
    type: string;
    coordinates: number[];
  };
  address: string;
  licenseNumber: string;
  isAvailable: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const { deliveryPerson } = useDeliveryPersonStore();
  const [profile, setProfile] = useState<DeliveryPersonProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DeliveryPersonProfile>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!deliveryPerson?._id) {
      router.push("/deliveryPerson/profile");
      return;
    }

    fetchProfile();
  }, [deliveryPerson, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/deliveryPerson/${deliveryPerson?._id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } else {
        setError(`Failed to fetch profile: ${response.status} ${response.statusText}`);

      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deliveryPerson/${deliveryPerson?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        // Update the state to see the changes immediately
        setFormData(updatedProfile);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deliveryPerson/${deliveryPerson?._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Clear local storage or state
        localStorage.removeItem("deliveryPerson");
        // Redirect to login page
        router.push("/deliveryPerson/login");
      } else {
        setError("Failed to delete account");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {profile && (
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <div className={`px-2 py-1 rounded-full ${
                profile.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              } text-sm`}>
                {profile.isAvailable ? 'Available' : 'Not Available'}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input 
                      id="mobile"
                      name="mobile"
                      value={formData.mobile || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="NIC">NIC</Label>
                    <Input 
                      id="NIC"
                      name="NIC"
                      value={formData.NIC || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input 
                      id="vehicleNumber"
                      name="vehicleNumber"
                      value={formData.vehicleNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input 
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium">{profile.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{profile.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NIC</p>
                    <p className="font-medium">{profile.NIC}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Number</p>
                    <p className="font-medium">{profile.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{profile.licenseNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {isEditing ? (
              <div className="flex space-x-2 w-full">
                <Button 
                  className="flex-1"
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Update Profile
              </Button>
            )}
            
            {!isEditing && (
              <>
                {showDeleteConfirm ? (
                  <div className="border border-red-300 rounded-md p-4 mt-4">
                    <p className="text-red-600 mb-2">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Yes, Delete My Account
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="destructive"
                    className="w-full mt-2"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete My Account
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
