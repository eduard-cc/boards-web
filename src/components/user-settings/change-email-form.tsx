import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/providers/user-provider";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type EmailFormValues = z.infer<typeof emailFormSchema>;

const emailFormSchema = z.object({
  email: z
    .string({ required_error: "Enter a new email address." })
    .email("Enter a valid email address."),
});

export default function EmailForm({
  onEmailChange,
}: {
  onEmailChange: (email: string) => void;
}) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: "onTouched",
  });

  const { updateUserData } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: EmailFormValues) {
    try {
      setIsUpdating(true);
      const userId = AuthService.getUserId();

      if (userId) {
        const newEmail = data.email;
        const accessToken = await UserService.updateUserEmail(userId, newEmail);

        // Update user context with the new email
        updateUserData({ email: newEmail });
        onEmailChange(newEmail);
        form.setValue("email", "");

        // Update JWT from response
        localStorage.removeItem("jwt");
        localStorage.setItem("jwt", JSON.stringify(accessToken));

        toast({
          title: "Email changed.",
          description: "Your email has been updated successfully.",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        if (
          error.response?.data.startsWith(
            "409 CONFLICT \"User's email is already",
          )
        ) {
          form.setError("email", {
            type: "server",
            message:
              "Your email is already set to " + form.getValues("email") + ".",
          });
        } else {
          form.setError("email", {
            type: "server",
            message: "This email is already in use.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New email address</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter your new email address"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is used to log in to your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <span>Loading&nbsp;</span>
                <Loader2 size={20} className="animate-spin" />
              </>
            ) : (
              "Change email"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
