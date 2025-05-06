
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  otp: z.string().min(5, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerifyEmailForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const navigate = useNavigate();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Email verified",
      description: "You have successfully verified your email.",
    });
    navigate("/reset-password");
    console.log(data);
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
        <Button type="submit" className="w-full">
          Verify Email
        </Button>
        <FormDescription className="text-center">
          Didn&apos;t receive a code?{" "}
          <Link to="#" className="text-jobblue hover:underline">
            Resend
          </Link>
        </FormDescription>
      </form>
    </Form>
  );
}
