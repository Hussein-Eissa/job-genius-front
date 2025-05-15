import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/reducers/UserReducerStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState, useEffect } from "react";

const FormSchema = z.object({
  otp: z.string().length(5, {
    message: "Your one-time password must be exactly 5 characters.",
  }),
});

export default function VerifyEmailForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { resetPasswordRequest, verifyEmail, forgetPassword } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Check if email exists in state
  useEffect(() => {
    const email = state?.email || resetPasswordRequest?.email;
    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [state, resetPasswordRequest, toast, navigate]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    const email = state?.email || resetPasswordRequest?.email;
    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await forgetPassword(email);
      startResendCountdown();
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const email = state?.email || resetPasswordRequest?.email;
    const isPasswordReset = state?.isPasswordReset || false;

    if (!email) {
      toast({
        title: "Error",
        description: "Email is missing. Please start the process again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isPasswordReset) {
        // Handle password reset verification
      useUserStore.setState({
        resetPasswordRequest: {
          email,
          resetCode: data.otp,
          newPassword: resetPasswordRequest?.newPassword || "",
        },
      });
    navigate("/reset-password", {
      state: { email, resetCode: data.otp },
    });
      } else {
        // Handle signup verification
        const isVerified = await verifyEmail({ email, otp: data.otp });
        if (isVerified) {
          toast({
            title: "Success",
            description: "Your email has been verified. You can now login.",
          });
          navigate("/login");
        }
      }
    } catch (err: any) {
      // Error is already handled in the store with specific messages
      console.error("Error processing verification:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="mx-auto space-y-3 flex flex-col justify-center">
              <FormLabel className="text-center">Enter verification code</FormLabel>
              <FormDescription className="text-center">
                We&apos;ve sent a code to your email. Please enter it below to verify your account.
              </FormDescription>
              <FormControl>
                <InputOTP maxLength={5} {...field}>
                  <InputOTPGroup className="w-full flex items-center justify-center gap-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
        <FormDescription className="text-center">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendDisabled || isLoading}
            className={`text-jobblue hover:underline ${(resendDisabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {resendDisabled ? `Resend in ${resendCountdown}s` : 'Resend'}
          </button>
        </FormDescription>
      </form>
    </Form>
  );
}
