import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/reducers/UserReducerStore";
import { useToast } from "@/hooks/use-toast";


const SignupForm = () => {
  const { register } = useUserStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const nameRegex = /^[A-Za-z\s]+$/;

  const BASE_URL = "https://jobgenius.bsite.net/api/auth";

  const handleGoogle = () => {
    window.location.href = `${BASE_URL}/signup-google`;
  };

  const handleMicrosoft = () => {
    window.location.href = `${BASE_URL}/signup-Microsoft`;
  };

  const handleFacebook = () => {
    window.location.href = `${BASE_URL}/signup-facebook`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate full name
    if (!nameRegex.test(fullName.trim())) {
      toast({
        title: "Invalid Name",
        description: "Full name must contain only letters and spaces.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({ fullName, email, password });
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification code.",
      });
      navigate("/verify-email", { 
        state: { 
          email,
          isPasswordReset: false 
        } 
      });
    } catch (error: any) {
      console.log("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || error || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Level Up Your Career
      </h2>
      <p className="text-3xl font-bold text-jobblue mb-8 text-center">
        Sign Up Today!
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 mb-2">Full name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jobblue focus:border-transparent"
            value={fullName}
            onChange={(e) => {
              // Only allow letters and spaces
              const value = e.target.value;
              if (value === '' || nameRegex.test(value)) {
                setFullName(value);
              }
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jobblue focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jobblue focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-jobblue hover:bg-jobblue-dark text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Continue"}
        </Button>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 w-full mr-2"></div>
            <span className="text-sm text-gray-500">or signup with</span>
            <div className="border-t border-gray-300 w-full ml-2"></div>
          </div>

          <div className="mt-4 flex justify-center space-x-4">
            <button type="button" className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center w-20 h-12" onClick={handleGoogle}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button type="button" className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center w-20 h-12" onClick={handleMicrosoft}>
              <img src="/lovable-uploads/Images/logos_microsoft-icon.svg" alt="Microsoft" className="h-6 w-6" />
            </button>
            <button type="button" className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center w-20 h-12" onClick={handleFacebook}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-jobblue hover:underline">Login</Link>
        </p>

        <p className="mt-6 text-center text-gray-500 text-sm">
          By clicking "Continue", you acknowledge that you have read and accept the <Link to="/terms" className="text-jobblue hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-jobblue hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
