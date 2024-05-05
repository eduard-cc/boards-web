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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProjectService from "@/services/project-service";
import {
  CameraIcon,
  Pencil1Icon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { getInitials } from "@/utils/get-initials";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProjectContext } from "@/providers/project-provider";
import ProjectActions from "@/components/project/project-actions";

const createProjectFormSchema = z.object({
  name: z
    .string({ required_error: "Project name is required." })
    .min(2, {
      message: "Must be at least 2 characters.",
    })
    .max(100, {
      message: "Must not exceed 100 characters.",
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

export default function ProjectSettingsPage() {
  const alertDialogTriggerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { projectData, setProjectData } = useProjectContext();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Boards | ${projectData?.name}`;
  }, [projectData?.name]);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const id = projectData?.id;
        if (id) {
          const project = await ProjectService.getProjectById(id);
          form.setValue("name", project.name);
          form.setValue("key", project.key);
          setProjectData(project);
          if (project.icon) {
            const imageUrl = `data:image/png;base64,${project.icon}`;
            setImageUrl(imageUrl);
          }
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

    fetchProjectData();
  }, [form, projectData?.id, setProjectData]);

  async function onSubmit(data: CreateProjectFormValues) {
    try {
      const id = projectData?.id;
      if (id) {
        const response = await ProjectService.updateProjectDetails(id, {
          name: data.name,
          key: data.key,
        });
        setProjectData(response);
        toast({
          title: "Project updated",
          description: `${projectData?.name} has been updated.`,
        });
      }
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

        if (alertDialogTriggerRef.current) {
          (alertDialogTriggerRef.current as HTMLElement).click();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Wrong file type",
          description: "Please select a PNG or JPEG image file.",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      try {
        const id = projectData?.id;
        if (id) {
          const response = await ProjectService.updateProjectIcon(id, formData);
          if (response instanceof Blob) {
            const imageUrl = URL.createObjectURL(response);
            setImageUrl(imageUrl);
            setSelectedFile(null);
            toast({
              title: "Project icon updated",
              description: `${projectData?.name}'s icon has been updated.`,
            });
            setProjectData({ ...projectData, icon: response });
          } else {
            console.error("Unexpected response type");
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    }
  };

  const handleRemove = async () => {
    try {
      if (projectData?.id) {
        await ProjectService.deleteProjectIcon(projectData.id);
        setImageUrl(null);
        setSelectedFile(null);
        toast({
          title: "Project icon removed",
          description: `${projectData?.name}'s icon has been removed.`,
        });
        setProjectData({ ...projectData, icon: null });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative max-w-md flex-1 space-y-8"
        >
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="group relative w-fit">
                <Avatar className="h-24 w-24 rounded-md border border-input shadow-sm">
                  <AvatarImage src={imageUrl ?? ""} />
                  <AvatarFallback className="rounded-md">
                    {projectData && getInitials(projectData?.name)}
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
                    className="text-destructive hover:cursor-pointer hover:text-foreground focus:bg-destructive"
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
            <div className="absolute right-0 top-0">
              <ProjectActions />
            </div>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                ref={alertDialogTriggerRef}
                variant="outline"
                className="hidden"
              ></Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex justify-center">
                  Upload icon
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={cn("!mt-0 flex items-center justify-center py-8")}
                >
                  {selectedFile && (
                    <Avatar className="h-28 w-28 rounded-md">
                      <AvatarImage src={URL.createObjectURL(selectedFile)} />
                    </Avatar>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedFile(null)}>
                  Close
                </AlertDialogCancel>
                <AlertDialogAction autoFocus onClick={handleUpload}>
                  Upload
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Input
            id="icon"
            type="file"
            accept="image/**"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="submit">Update project</Button>
        </form>
      </div>
    </Form>
  );
}
