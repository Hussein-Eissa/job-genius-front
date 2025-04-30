
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyEmailForm = () => {
  const [otp, setOtp] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle verification logic here
    console.log("Verification code submitted:", otp);
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

      <form onSubmit={handleSubmit} className="text-center">
        <p className="mb-6">Enter the 5-digit code sent to your email</p>
        
        <div className="flex justify-center mb-8">
          <InputOTP 
            maxLength={5}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot 
                    key={index} 
                    {...slot} 
                    className="w-14 h-14 text-xl border-2 border-gray-300" 
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-jobblue hover:bg-jobblue-dark text-white py-6"
        >
          Verify Code
        </Button>
        
        <p className="mt-6 text-gray-600">
          Haven't got the email yet? <Link to="#" className="text-jobblue hover:underline">Resend email</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
