import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/reducers/UserReducerStore";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsync } = useUserStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  

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
    
    try {
      await loginAsync(email, password);
      const isAuthenticated = useUserStore.getState().isAuthenticated;
  
      if (isAuthenticated) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Welcome Back,
      </h2>
      <h3 className="text-3xl font-bold text-gray-800 mb-3 text-center">
        Let's Find Your Next
      </h3>
      <p className="text-3xl font-bold text-jobblue mb-8 text-center">
        Big Opportunity!
      </p>

      <form onSubmit={handleSubmit}>
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

        <div className="mb-4">
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

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-jobblue focus:ring-jobblue border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-jobblue hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-jobblue hover:bg-jobblue-dark text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 w-full mr-2"></div>
            <span className="text-sm text-gray-500">or login with</span>
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
          Don't have an account? <Link to="/signup" className="text-jobblue hover:underline">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
