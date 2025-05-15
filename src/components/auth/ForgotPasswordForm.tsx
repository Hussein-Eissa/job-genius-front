import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/reducers/UserReducerStore";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgetPassword } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await forgetPassword(email);
      useUserStore.setState({
        resetPasswordRequest: { email, resetCode: '', newPassword: '' },
      });
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
      });
      
      navigate('/verify-email', { 
        state: { 
          email,
          isPasswordReset: true 
        } 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
        Forgot your password?
      </h2>
      <h3 className="text-3xl font-bold text-gray-800 text-center mb-2">
        Let's help you
      </h3>
      <p className="text-3xl font-bold text-jobblue text-center mb-8">
        get back on track!
      </p>

      <form onSubmit={handleSubmit}>
        <p className="mb-6 text-center">Enter your email to receive a password reset code</p>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">Enter your email address</label>
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

        <Button
          type="submit"
          className="w-full bg-jobblue hover:bg-jobblue-dark text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Code"}
        </Button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-jobblue hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
