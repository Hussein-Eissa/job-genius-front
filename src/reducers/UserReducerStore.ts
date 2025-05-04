import { create } from "zustand";
import axios from "axios";

interface User {
  fullName?: string ;
  email: string;
  token?: string;
  isAuthenticated?: boolean;
}

interface UserState {
  user: User;
  token: string;
  isAuthenticated: boolean;
  loginAsync: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  register: (userData: { fullName: string; email: string; password: string }) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: { fullName: "", email: "" },
  token: localStorage.getItem("token") || "",
  isAuthenticated: !!localStorage.getItem("token"),

  loginAsync: async (email, password) => {
    try {
      const res = await axios.post("https://jobgenius.bsite.net/api/auth/login", {
        email,
        password,
      });
  
      const { token, fullname, email: returnedEmail } = res.data;
  
      if (!token || !returnedEmail) {
        throw new Error("Invalid login response");
      }
  
      localStorage.setItem("token", token);
  
      set({
        user: {
          fullName: fullname || "",
          email: returnedEmail,
        },
        token,
        isAuthenticated: true,
      });
  
      console.log("Login successful");
    } catch (err: any) {
      console.error("Login failed:", err);
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  },
    logout: () => {
    localStorage.removeItem("token");
    set({
      user: { fullName: "", email: "" },
      token: "",
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    return !!localStorage.getItem("token");
  },

  register: async (userData) => {
    console.log("Registering user:", userData);
    try {
      const res = await axios.post("https://jobgenius.bsite.net/api/auth/register", {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      });
      if (res.data.success) {
        console.log("Registration success:", res.data.message);
        alert(res.data.message); 
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      console.log("Registration error:", error.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Registration failed");
    }
  }
  
}));
