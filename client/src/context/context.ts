"use client"
import { createContext, Dispatch, SetStateAction, useContext } from "react";

// Define the shape of the user object
interface User {
  fullName: string;
  avatar: string;
  coverImage?: string ;
  username: string;
  _id: string;
  watchHistory?: string[];
  email: string;
}

// Define the shape of the context value
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create the context with a default value (can be null or an empty object)
export const userContext = createContext<UserContextType>({
  user: null,
  setUser: ()=> {},
});

