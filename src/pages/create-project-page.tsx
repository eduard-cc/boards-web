import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProjectService from "@/services/project-service";
import InviteMembersForm from "@/components/project/invite-initial-members-form";
import {
  CameraIcon,
  Pencil1Icon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { getInitials } from "@/utils/get-initials";
import axios from "axios";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { Role } from "@/types/member";
import { Link, useNavigate } from "react-router-dom";
import { generateProjectKey } from "@/utils/generate-project-key.ts";

const createProjectFormSchema = z.object({
  name: z
    .string({ required_error: "Project name is required." })
    .min(2, {
      message: "Must be at least 2 characters.",
    })
    .max(50, {
      message: "Must not exceed 50 characters.",
    })
    .refine((name) => name.trim() !== "", {
      message: "Must not be blank.",
    }),
  key: z
    .string({ required_error: "Project key is required." })
    .min(2, { message: "Must be at least 2 characters." })
    .max(5, {
      message: "Must not exceed 5 characters.",
    })
    .refine((name) => name.trim() !== "", {
      message: "Must not be blank.",
    })
    .refine((key) => /^[A-Z]/.test(key), {
      message: "Must start with an uppercase letter.",
    })
    .refine((key) => !/[^A-Z0-9]/.test(key), {
      message: "Must only contain uppercase alphanumeric characters.",
    }),
});

type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

export default function CreateProjectPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [members, setMembers] = useState<Array<User & { role: Role }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Boards | Create project";
  }, []);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    mode: "onTouched",
  });
  const nameValue = form.watch("name");

  const handleInvitedMembersChange = (
    updatedMembers: Array<User & { role: Role }>,
  ) => {
    setMembers(updatedMembers);
  };

  async function onSubmit() {
    try {
      const formData = new FormData();

      const requestPart = {
        name: form.getValues("name"),
        key: form.getValues("key"),
        members: members.map((member) => ({
          email: member.email,
          role: member.role,
        })),
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(requestPart)], { type: "application/json" }),
      );

      if (selectedFile) {
        formData.append("icon", selectedFile);
      }

      const response = await ProjectService.createProject(formData);
      navigate(`/projects/${response.id}/list`);

      toast({
        title: "Project created.",
        description: (
          <div className="flex flex-wrap items-center whitespace-pre">
            <Link
              to={`/projects/${response.id}/list`}
              className="group inline-flex items-center"
            >
              <div className="inline-block">
                <Avatar className="h-6 w-6 rounded-md">
                  <AvatarImage src={`data:image/png;base64,${response.icon}`} />
                  <AvatarFallback className="rounded-md text-xs font-normal">
                    {getInitials(response.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
                {response.name}
              </span>
            </Link>
            <span> has been created.</span>
          </div>
        ),
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data.startsWith('409 CONFLICT "Project called')) {
          form.setError("name", {
            type: "server",
            message: "A project of yours is already using this name.",
          });
        } else if (
          error.response?.data.startsWith('409 CONFLICT "Project with KEY')
        ) {
          form.setError("key", {
            type: "server",
            message: "A project of yours is already using this key.",
          });
        } else {
          throwGenericError();
        }
      } else {
        throwGenericError();
      }
    }
  }

  const throwGenericError = () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request. Please try again.",
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg"
      ) {
        setSelectedFile(selectedFile);
        const imageUrl = URL.createObjectURL(selectedFile);
        setImageUrl(imageUrl);
      } else {
        toast({
          variant: "destructive",
          title: "Wrong file type",
          description: "Please select a PNG or JPEG image file.",
        });
      }
    }
  };

  const handleRemove = async () => {
    setImageUrl(null);
    setSelectedFile(null);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col items-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl space-y-8 py-7"
        >
          <div className="flex items-center justify-between gap-36">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-foreground">
                Create project
              </h1>
              <p className="!mt-4 text-muted-foreground">
                Edit these details anytime in project settings.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="group relative w-fit">
                <Avatar className="h-20 w-20 rounded-md border border-input shadow-sm">
                  <AvatarImage src={imageUrl ?? ""} />
                  <AvatarFallback className="rounded-md">
                    {nameValue ? (
                      getInitials(nameValue)
                    ) : (
                      <CameraIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                  <CameraIcon className="h-8 w-8" />
                </div>
              </DropdownMenuTrigger>
              {imageUrl !== null ? (
                <DropdownMenuContent>
                  <label htmlFor="icon">
                    <DropdownMenuItem className="hover:cursor-pointer">
                      Change
                      <DropdownMenuShortcut>
                        <Pencil1Icon className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </label>
                  <DropdownMenuItem
                    className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                    onClick={handleRemove}
                  >
                    Remove
                    <DropdownMenuShortcut className={cn("opacity-100")}>
                      <TrashIcon className="h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="w-32">
                  <label htmlFor="icon">
                    <DropdownMenuItem className="hover:cursor-pointer">
                      Upload icon
                      <DropdownMenuShortcut>
                        <UploadIcon className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </label>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter a project goal or team name..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const generatedKey = generateProjectKey(e.target.value);
                      form.setValue("key", generatedKey);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Key<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter a project key"
                    {...field}
                    onInput={(e) => {
                      e.currentTarget.value =
                        e.currentTarget.value.toUpperCase();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Used as a prefix and unique identifier for issues in this
                  project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input
            id="icon"
            type="file"
            accept="image/**"
            onChange={handleFileChange}
            className="hidden"
          />
          <InviteMembersForm
            onInvitedMembersChange={handleInvitedMembersChange}
          />
          <Button type="submit">Create project</Button>
        </form>
      </div>
    </Form>
  );
}
