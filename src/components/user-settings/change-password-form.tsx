import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const passwordFormSchema = z.object({
  currentPassword: z
    .string({ required_error: "Enter your current password." })
    .min(8, {
      message: "Must be at least 8 characters.",
    })
    .max(255, { message: "Must not exceed 255 characters." }),
  newPassword: z
    .string({ required_error: "Enter your new password." })
    .min(8, {
      message: "Must be at least 8 characters.",
    })
    .max(255, { message: "Must not exceed 255 characters." }),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function PasswordForm() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onTouched",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  async function onSubmit(data: PasswordFormValues) {
    try {
      setIsUpdating(true);
      const userId = AuthService.getUserId();
      if (userId) {
        const passwordUpdateRequest = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        };

        await UserService.updateUserPassword(userId, passwordUpdateRequest);

        toast({
          title: "Password changed.",
          description: "Your password has been updated successfully.",
        });
        form.setValue("currentPassword", "");
        form.setValue("newPassword", "");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        form.setError("currentPassword", {
          type: "server",
          message: "Incorrect current password.",
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
      setIsUpdating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="text-foreground"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    {...field}
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={toggleShowCurrentPassword}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transform text-foreground"
                  >
                    {showCurrentPassword ? (
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
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="text-foreground"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...field}
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={toggleShowNewPassword}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transform text-foreground"
                  >
                    {showNewPassword ? (
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
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <span>Loading&nbsp;</span>
              <Loader2 size={20} className="animate-spin" />
            </>
          ) : (
            "Change password"
          )}
        </Button>
      </form>
    </Form>
  );
}
