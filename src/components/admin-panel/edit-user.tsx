import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserService from "@/services/user-service";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

type EditUserProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

export function EditUser({ state, setState, user }: EditUserProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    form.setValue("name", user.name);
    form.setValue("company", user.company ?? undefined);
    form.setValue("location", user.location ?? undefined);
  }, [form, user]);

  async function onSubmit(data: ProfileFormValues) {
    data.name = data.name.trim();
    setIsUpdating(true);
    try {
      await UserService.updateUserDetails(user.id, {
        name: data.name,
        company: data.company,
        location: data.location,
      });
      toast({
        variant: "success",
        title: "User has been updated.",
      });
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
    <Dialog
      open={state}
      onOpenChange={(open) => {
        setState(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent className={cn("!max-w-xl text-foreground")}>
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>
        </DialogHeader>
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
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update user"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
