"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();

  return (
    <Button
      className="bg-neutral-900 hover:bg-neutral-800 text-white"
      onClick={() => router.push("/auth/login")}
    >
      login
    </Button>
  );
};

export default LoginButton;
