import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import UserService from "@/services/user-service";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/utils/get-initials";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { Member, Role } from "@/types/member";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProjectContext } from "@/providers/project-provider";
import { toast } from "@/components/ui/use-toast";
import MemberService from "@/services/member-service";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/auth-service";

const emailFormSchema = z.object({
  email: z
    .string({ required_error: "Enter an email address." })
    .email("Enter a valid email address."),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

export default function InviteMembersDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<
    Array<User & { role: Role }>
  >([]);
  const { projectData, setMemberCount, setUpdate } = useProjectContext();
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUserId = AuthService.getUserId();

  const form = useForm<EmailFormValues>({
    mode: "onTouched",
  });

  const handleEmailChange = async (email: string) => {
    try {
      emailFormSchema.parse({ email });
      const user = await UserService.getUserByEmail(email);

      setFoundUser(user);
      form.clearErrors("email");
    } catch (error) {
      setFoundUser(null);
      form.setError("email", {
        type: "manual",
        message: "No user found.",
      });
    }
  };

  const handleUserClick = () => {
    if (foundUser) {
      const isAlreadyInvited = invitedMembers.some(
        (user) => user.id === foundUser.id,
      );

      if (!isAlreadyInvited) {
        setInvitedMembers((prevMembers) => [
          ...prevMembers,
          { ...foundUser, role: Role.ADMIN },
        ]);
      } else {
        form.setError("email", {
          type: "manual",
          message: "User is already invited.",
        });
      }

      setFoundUser(null);
      form.setValue("email", "");
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const id = projectData?.id;
        if (id) {
          console.log("fetching members");
          const members = await MemberService.getMembersByProjectId(id);
          setMembers(members);
          setMemberCount(members.length);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    };

    if (isDialogOpen) {
      fetchMembers();
    }
  }, [isDialogOpen, projectData?.id, setMemberCount]);

  const handleRemoveInvitedMember = (userId: number) => {
    setInvitedMembers((prevMembers) =>
      prevMembers.filter((user) => user.id !== userId),
    );
  };

  async function onSubmit() {
    try {
      if (projectData) {
        const inviteUsersRequest = {
          members: invitedMembers.map((user) => ({
            email: user.email,
            role: user.role,
          })),
        };
        const response = await MemberService.inviteMembers(
          projectData?.id,
          inviteUsersRequest,
        );
        toast({
          title: `${
            inviteUsersRequest.members.length === 1 ? "User" : "Users"
          } added.`,
          description: `${
            inviteUsersRequest.members.length === 1
              ? `${response[0].user.name} has`
              : "Multiple users have"
          } been added to ${projectData?.name}.`,
        });
        setIsDialogOpen(false);
        form.reset();
        setInvitedMembers([]);
        setFoundUser(null);
        setUpdate((update) => !update);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            form.reset();
            setInvitedMembers([]);
            setFoundUser(null);
          }
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-xl text-foreground">
          <DialogHeader>
            <DialogTitle>Add users to {projectData?.name}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={(open) => setIsPopoverOpen(open)}
                      >
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                            <Input
                              autoComplete="off"
                              type="search"
                              className="pl-10 text-foreground"
                              placeholder="e.g. example@company.com"
                              {...field}
                              onFocus={() => setIsPopoverOpen(!!foundUser)}
                              onChangeCapture={(e) => {
                                const target = e.target as HTMLInputElement;
                                field.onChange(e);
                                handleEmailChange(target.value);
                              }}
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                          onOpenAutoFocus={(event: Event) =>
                            event.preventDefault()
                          }
                        >
                          <Command>
                            {foundUser ? (
                              <CommandGroup>
                                <CommandItem
                                  className="hover:cursor-pointer"
                                  onSelect={handleUserClick}
                                  disabled={
                                    invitedMembers.some(
                                      (user) => user.id === foundUser.id,
                                    ) ||
                                    members.some(
                                      (m) => m.user.id === foundUser.id,
                                    )
                                  }
                                >
                                  <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-9 w-9">
                                        <AvatarImage
                                          src={`data:image/png;base64,${foundUser.picture}`}
                                        />
                                        <AvatarFallback>
                                          {foundUser.name
                                            ? getInitials(foundUser.name)
                                            : "CN"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="flex items-center text-sm font-medium leading-none">
                                          <p className="max-w-[300px] truncate">
                                            {foundUser.name}
                                            {foundUser.id === currentUserId && (
                                              <Badge className="ml-2">
                                                You
                                              </Badge>
                                            )}
                                          </p>
                                        </p>
                                        <p className="max-w-[350px] truncate text-sm text-muted-foreground">
                                          {foundUser.email}
                                        </p>
                                      </div>
                                    </div>
                                    {members.some(
                                      (m) => m.user.id === foundUser.id,
                                    ) ? (
                                      <div className="flex items-center">
                                        <CheckIcon className="h-5 w-5 text-success" />
                                        <span className="ml-1 text-success">
                                          Already a member
                                        </span>
                                      </div>
                                    ) : invitedMembers.some(
                                        (user) => user.id === foundUser.id,
                                      ) ? (
                                      <div className="flex items-center">
                                        <CheckIcon className="h-5 w-5 text-success" />
                                        <span className="ml-1 text-success">
                                          Added
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <PlusIcon className="h-5 w-5 text-foreground" />
                                        <span className="ml-1 text-foreground">
                                          Add
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CommandItem>
                              </CommandGroup>
                            ) : (
                              <CommandGroup>
                                <CommandItem
                                  disabled
                                  className="cursor-default"
                                >
                                  {!field.value || field.value.trim() === "" ? (
                                    "Enter an email address."
                                  ) : form.formState.errors.email?.message ? (
                                    form.formState.errors.email?.message ===
                                    "No user found." ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar>
                                          <AvatarFallback>?</AvatarFallback>
                                        </Avatar>
                                        <span>
                                          {form.formState.errors.email?.message}
                                        </span>
                                      </div>
                                    ) : (
                                      form.formState.errors.email?.message
                                    )
                                  ) : (
                                    "No user found."
                                  )}
                                </CommandItem>
                              </CommandGroup>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Search for users to add by entering their email address.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="my-5 space-y-5">
                {invitedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`data:image/png;base64,${member.picture}`}
                        />
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-foreground">
                      <Select
                        defaultValue={Role.ADMIN}
                        onValueChange={(selectedRole) => {
                          const updatedMembers = invitedMembers.map((m) =>
                            m.id === member.id
                              ? { ...m, role: selectedRole as Role }
                              : m,
                          );
                          setInvitedMembers(updatedMembers);
                        }}
                      >
                        <SelectTrigger className="ml-auto w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={Role.ADMIN}
                            className="hover:cursor-pointer"
                          >
                            <p>Admin</p>
                          </SelectItem>
                          <SelectItem
                            value={Role.DEVELOPER}
                            className="hover:cursor-pointer"
                          >
                            <p>Developer</p>
                          </SelectItem>
                          <SelectItem
                            value={Role.VIEWER}
                            className="hover:cursor-pointer"
                          >
                            <p>Viewer</p>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleRemoveInvitedMember(member.id)}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" autoFocus>
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={invitedMembers.length === 0}>
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
