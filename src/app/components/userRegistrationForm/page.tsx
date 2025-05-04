"use client";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";

const UserRegistrationForm = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const { setToken, setUser } = useUserStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Hello");
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const userData = {
        username: username,
        email: email,
        password: password,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      console.log(res.data);

      if (res.status === 201) {
        setSuccess("User Successfully Created");
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/user");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="bg-red-600 text-white mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-600 text-black mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>SUCCESS</AlertTitle>
          <AlertDescription className="text-black">
            User Successfully Created
          </AlertDescription>
        </Alert>
      )}
      <Input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="re-enter the Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button className="w-full mt-2" variant="default" onClick={handleSubmit}>
        Register
      </Button>
    </div>
  );
};

export default UserRegistrationForm;
