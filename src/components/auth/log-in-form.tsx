import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import axios from "axios";
import { useState } from "react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const logInFormSchema = z.object({
  email: z
    .string({ required_error: "Enter your email address." })
    .email("Enter a valid email address."),
  password: z
    .string({ required_error: "Enter your password." })
    .min(8, {
      message: "Must be at least 8 characters.",
    })
    .max(255, { message: "Must not exceed 255 characters." }),
});

type LogInFormValues = z.infer<typeof logInFormSchema>;

export default function LogInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LogInFormValues>({
    resolver: zodResolver(logInFormSchema),
    mode: "onTouched",
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: LogInFormValues) {
    try {
      setIsLoading(true);
      await login(data.email, data.password);

      navigate("/projects");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          form.setError("password", {
            type: "server",
            message: "Invalid email or password",
          });
          form.setError("email", {
            type: "server",
            message: "Invalid email or password",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Email</FormLabel>
              <FormControl>
                <Input
                  className="text-foreground"
                  placeholder="name@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="text-foreground"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transform text-foreground"
                  >
                    {showPassword ? (
                      <EyeOpenIcon className="h-4 w-4" />
                    ) : (
                      <EyeNoneIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span>Loading&nbsp;</span>
              <Loader2 size={20} className="animate-spin" />
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </Form>
  );
}
