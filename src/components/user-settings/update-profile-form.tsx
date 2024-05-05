import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useUser } from "@/providers/user-provider";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const profileFormSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(2, {
      message: "Must be at least 2 characters.",
    })
    .max(50, {
      message: "Must not exceed 50 characters.",
    })
    .refine((name) => /^[A-Za-z\s]+$/.test(name), {
      message: "Must only contain letters and spaces.",
    })
    .refine((name) => name.trim() !== "", {
      message: "Must not be blank.",
    }),
  company: z
    .string()
    .max(50, {
      message: "Must not exceed 50 characters.",
    })
    .optional(),
  location: z
    .string()
    .max(50, {
      message: "Must not exceed 50 characters.",
    })
    .optional(),
});

type UserData = {
  name: string;
  company?: string | null;
  location?: string | null;
};

export default function UpdateProfileForm({
  userData,
}: {
  userData: UserData | null;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateUserData } = useUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onTouched",
  });

  const updateFormWithUserData = useCallback(() => {
    if (userData) {
      form.setValue("name", userData.name);
      form.setValue("company", userData.company || "");
      form.setValue("location", userData.location || "");
    }
  }, [form, userData]);

  useEffect(() => {
    updateFormWithUserData();
  }, [userData, updateFormWithUserData]);

  async function onSubmit(data: ProfileFormValues) {
    data.name = data.name.trim();
    setIsUpdating(true);
    try {
      const userId = AuthService.getUserId();
      if (userId) {
        const userUpdateRequest: UserData = {
          name: data.name,
          company: data.company,
          location: data.location,
        };
        const updatedUser = await UserService.updateUserDetails(
          userId,
          userUpdateRequest,
        );
        if (userData) {
          userData.name = updatedUser.name;
          userData.company = updatedUser.company;
          userData.location = updatedUser.location;
        }
        updateUserData({ name: updatedUser.name });
        toast({
          title: "Profile updated.",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full name
                  <span className="text-destructive">*</span>
                </FormLabel>
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
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter the name of your company"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="City, Country"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update profile"}
          </Button>
        </form>
      </Form>
    </>
  );
}
