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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import AuthService from "@/services/auth-service";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { Role } from "@/types/member";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const emailFormSchema = z.object({
  email: z
    .string({ required_error: "Enter an email address." })
    .email("Enter a valid email address."),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

interface InviteMembersFormProps {
  onInvitedMembersChange: (members: Array<User & { role: Role }>) => void;
}

export default function InviteMembersForm({
  onInvitedMembersChange,
}: InviteMembersFormProps) {
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<
    Array<User & { role: Role }>
  >([]);
  const [creator, setCreator] = useState<User | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    onInvitedMembersChange(invitedMembers);
  }, [invitedMembers, onInvitedMembersChange]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      const userId = AuthService.getUserId();
      if (userId) {
        try {
          const user = await UserService.getUserById(userId);
          setCreator(user);
          setInvitedMembers([{ ...user, role: Role.OWNER }]);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was an error fetching user data. Please try again.",
          });
        }
      }
    };

    fetchCreatorData();
  }, []);

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

  const handleRemoveInvitedMember = (userId: number) => {
    setInvitedMembers((prevMembers) =>
      prevMembers.filter((user) => user.id !== userId),
    );
  };

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Add users</FormLabel>
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
                  onOpenAutoFocus={(event: Event) => event.preventDefault()}
                >
                  <Command>
                    {foundUser ? (
                      <CommandGroup>
                        <CommandItem
                          className="hover:cursor-pointer"
                          onSelect={handleUserClick}
                          disabled={invitedMembers.some(
                            (user) => user.id === foundUser.id,
                          )}
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
                                  </p>

                                  {foundUser.id === creator?.id && (
                                    <Badge className="ml-2">You</Badge>
                                  )}
                                </p>
                                <p className="max-w-[350px] truncate text-sm text-muted-foreground">
                                  {foundUser.email}
                                </p>
                              </div>
                            </div>
                            {invitedMembers.some(
                              (user) => user.id === foundUser.id,
                            ) ? (
                              <div className="flex items-center">
                                <CheckIcon className="h-5 w-5 text-success" />
                                <span className="ml-1 text-success">Added</span>
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
                        <CommandItem disabled>
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
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-5">
        {invitedMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`data:image/png;base64,${member.picture}`} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="flex items-center text-sm font-medium leading-none text-foreground">
                  <p className="max-w-[190px] truncate">{member.name}</p>
                  {member.id === creator?.id && (
                    <Badge className="ml-2">You</Badge>
                  )}
                </p>
                <p className="max-w-[250px] truncate text-sm text-muted-foreground">
                  {member.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-foreground">
              <Select
                defaultValue={
                  member.id === creator?.id ? Role.OWNER : Role.ADMIN
                }
                disabled={member.id === creator?.id}
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
                  {member.id === creator?.id && (
                    <SelectItem value={Role.OWNER}>
                      <p>Owner</p>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {member.id !== creator?.id && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleRemoveInvitedMember(member.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove user</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
