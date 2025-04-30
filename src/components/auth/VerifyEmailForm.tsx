
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

const FormSchema = z.object({
  otp: z.string().min(6, {
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Email verified",
      description: "You have successfully verified your email.",
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="mx-auto space-y-3">
              <FormLabel className="text-center">Enter verification code</FormLabel>
              <FormDescription className="text-center">
                We&apos;ve sent a code to your email. Please enter it below to verify your account.
              </FormDescription>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-center">
                Didn&apos;t receive a code?{" "}
                <Link to="#" className="text-primary hover:underline">
                  Resend
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Verify Email
        </Button>
      </form>
    </Form>
  );
}
