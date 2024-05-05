import { useState } from "react";
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
import axios from "axios";
import { useAuth } from "@/providers/auth-provider";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const signUpFormSchema = z.object({
  name: z
    .string({ required_error: "Enter your full name." })
    .min(2, { message: "Must be at least 2 characters." })
    .max(255, { message: "Must not exceed 50 characters." })
    .refine((name) => /^[A-Za-z\s]+$/.test(name), {
      message: "Must only contain letters and spaces.",
    })
    .refine((name) => name.trim() !== "", {
      message: "Must not be blank.",
    }),
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

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: SignUpFormValues) {
    data.name = data.name.trim();
    try {
      setIsLoading(true);
      await signup(data.name, data.email, data.password);
      navigate("/projects");
      toast({
        title: "Welcome to Boards!",
        description: (
          <>
            <span>You can start by </span>
            <Link
              to="/create-project"
              className="text-primary underline-offset-4 hover:underline dark:text-pink-500"
            >
              creating a project
            </Link>
            .
          </>
        ),
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setError("email", {
          type: "server",
          message: "This email is already in use.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Full name</FormLabel>
              <FormControl>
                <Input
                  className="text-foreground"
                  placeholder="Enter your full name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
}
