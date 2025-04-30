
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
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

      {isSubmitted ? (
        <div className="text-center">
          <p className="text-xl font-semibold mb-3">Your password has been successfully reset.</p>
          <p className="mb-6">click confirm to set a new password</p>
          <Link to="/reset-password">
            <Button className="bg-jobblue hover:bg-jobblue-dark text-white px-10">
              Confirm
            </Button>
          </Link>
        </div>
      ) : (
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
          >
            Send Code
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
