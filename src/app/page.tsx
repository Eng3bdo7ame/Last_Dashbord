"use client";
import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Cookies from "js-cookie";
import ECommerce from "@/components/Dashboard/E-commerce";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return isLoggedIn ? <ECommerce /> : <Login />;
}
