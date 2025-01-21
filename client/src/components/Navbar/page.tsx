"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { setUser } from "@/app/slices/userSlice";
import axios from "axios";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/current-user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.statusCode === 200) {
            dispatch(setUser(res.data.data)); // Update Redux store with user data
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  return (


    <div className="w-full h-20 backdrop-blur-md  border-b-[2px] border-gray-700 px-6 flex items-center justify-between">
      <div className="flex justify-center items-center gap-3">
        <img
          src="/assets/logo3.png"
          className="ml-4 w-14 rounded-full"
          alt="logo"
        />
      </div>
      <div>
        <input
          className=" w-96 h-12 rounded-full px-6 border-[1px] box-border"
          type="search"
          placeholder="Search"
          name="searchBar"
          id="search"
        />
      </div>
      <div className="flex gap-6">
        {user ? (
          <img
            className="ml-4 w-14 rounded-full"
            src={user.avatar}
            alt="user"
          />
        ) : (
          <div className="flex gap-3">
            <Link href="/signup">
              <Button variant="secondary">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        )}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
