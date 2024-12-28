"use client";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import axios from "axios";
import { userContext } from "@/context/context";

const Navbar = () => {
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/current-user`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (res.data.statusCode === 200) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    let token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <div className="w-full px-6 h-full flex items-center justify-between">
      <div className="flex justify-center items-center gap-3">
        <img
          src="assets/logo3.png"
          className="ml-4 w-14 rounded-full"
          alt="logo"
        />
      </div>
      <div>
        <input
          className=" w-96 h-12 rounded-full  px-6 border-[1px] box-border "
          type="Search"
          placeholder="Search"
          name="searchBar"
          id="search"
        />
      </div>
      <div className="flex gap-6">
        {user ? 
          <img
            className="ml-4 w-14 rounded-full"
            src={user.avatar}
            alt="user"
          />
         : 
          <div className="flex gap-3">
            <Link href="/signup">
              <Button variant="secondary">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        }
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;