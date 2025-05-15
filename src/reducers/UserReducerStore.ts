import { create } from "zustand";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

interface User {
  fullName?: string;
  email: string;
  token?: string;
  isAuthenticated?: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  otp: string;
}

interface UserState {
  ChangePasswordRequest: ChangePasswordRequest;
  user: User;
  token: string;
  isAuthenticated: boolean;
  success: boolean | null; 
  resetPasswordRequest: ResetPasswordRequest | null;
  error?: string; 
  loginAsync: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  register: (userData: { fullName: string; email: string; password: string }) => Promise<void>;
  verifyEmail: (data: EmailVerificationRequest) => Promise<boolean>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  setChangePasswordRequest: (data: ChangePasswordRequest) => void;
  validatePassword: (password: string) => { isValid: boolean; message: string };
}

// Helper to extract error message from API
function getApiErrorMessage(error: any, fallback: string) {
  if (error?.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (typeof error.response.data.message === 'string') {
      return error.response.data.message;
    }
  }
  return fallback;
}

export const useUserStore = create<UserState>((set) => ({
  ChangePasswordRequest: { oldPassword: "", newPassword: "" },
  resetPasswordRequest: { email: "", resetCode: "", newPassword: "" },
  user: { fullName: "", email: "" },
  token: localStorage.getItem("token") || "",
  isAuthenticated: !!localStorage.getItem("token"),
  success: null,
  error: undefined,
  setChangePasswordRequest: (data) => set({ ChangePasswordRequest: data }),
  
  validatePassword: (password: string) => {
    if (!PASSWORD_REGEX.test(password)) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
      };
    }
    return { isValid: true, message: "" };
  },

  loginAsync: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

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
        error: undefined,
      });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (err: any) {
      let errorMessage = getApiErrorMessage(err, "Login failed. Please check your credentials.");
      
      set({
        isAuthenticated: false,
        error: errorMessage,
      });
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: { fullName: "", email: "" },
      token: "",
      isAuthenticated: false,
      error: undefined,
    });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  },

  checkAuth: () => {
    return !!localStorage.getItem("token");
  },

  register: async (userData) => {
    try {
      // Validate required fields
      if (!userData.fullName || !userData.email || !userData.password) {
        throw new Error("All fields are required");
      }

      // First check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password strength
      const passwordValidation = useUserStore.getState().validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      // Directly call the register endpoint
      const res = await axios.post("https://jobgenius.bsite.net/api/auth/register", {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      });
      
      if (res.data.success) {
        toast({
          title: "Registration Successful",
          description: "Please check your email for verification code.",
        });
      } else {
        throw new Error(res.data.message || "Registration failed");
      }
    } catch (error: any) {
      let errorMessage = getApiErrorMessage(error, "Registration failed. Please try again.");
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  verifyEmail: async (data: EmailVerificationRequest) => {
    try {
      if (!data.email || !data.otp) {
        throw new Error("Email and verification code are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate OTP format
      if (!/^\d{5}$/.test(data.otp)) {
        throw new Error("Verification code must be exactly 5 digits");
      }

      const res = await axios.post("https://jobgenius.bsite.net/api/auth/verify", {
        email: data.email,
        verificationCode: data.otp,
      });

      if (res.data.success) {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
        return true;
      } else {
        throw new Error(res.data.message || "Email verification failed");
      }
    } catch (error: any) {
      let errorMessage = getApiErrorMessage(error, "Email verification failed. Please try again.");
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  forgetPassword: async (email) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const res = await axios.post(`https://jobgenius.bsite.net/api/auth/forgot-password`, null, {
        params: { email }
      });

      if (res.data.success) {
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the reset code.",
        });
      } else {
        throw new Error(res.data.message || "Failed to send reset code");
      }
    } catch (error: any) {
      let errorMessage = getApiErrorMessage(error, "Failed to send reset code. Please try again.");
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    try {
      if (!data.email || !data.resetCode || !data.newPassword) {
        throw new Error("All fields are required");
      }

      // Validate password strength
      const passwordValidation = useUserStore.getState().validatePassword(data.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      const response = await axios.post(
        'https://jobgenius.bsite.net/api/auth/reset-password',
        {
          email: data.email,
          resetCode: data.resetCode,
          newPassword: data.newPassword
        }
      );

      if (response.data.success) {
        set({ success: true, error: undefined });
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully.",
        });
      } else {
        throw new Error(response.data.message || 'Reset password failed');
      }
    } catch (err: any) {
      let errorMessage = getApiErrorMessage(err, 'Failed to reset password. Please try again.');
      
      set({ success: false, error: errorMessage });
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },

  changePassword: async (data: ChangePasswordRequest) => {
    try {
      if (!data.oldPassword || !data.newPassword) {
        throw new Error("Both old and new passwords are required");
      }

      // Validate new password strength
      const passwordValidation = useUserStore.getState().validatePassword(data.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("You must be logged in to change your password");
      }

      const response = await axios.post(
        'https://jobgenius.bsite.net/api/auth/change-password',
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    
      if (response.data.success) {
        set({ success: true, error: undefined });
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
      } else {
        throw new Error(response.data.message || 'Change password failed');
      }
    } catch (err: any) {
      let errorMessage = getApiErrorMessage(err, 'Failed to change password. Please try again.');
      
      set({ success: false, error: errorMessage });
      toast({
        title: "Change Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  },
}));