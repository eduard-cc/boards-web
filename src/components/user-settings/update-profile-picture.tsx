import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/providers/user-provider";
import { getInitials } from "@/utils/get-initials";
import {
  CameraIcon,
  Pencil1Icon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type UpdateProfilePictureProps = {
  initialImageUrl: string | null;
  name: string;
};

export default function UpdateProfilePicture({
  initialImageUrl,
  name,
}: UpdateProfilePictureProps) {
  const alertDialogTriggerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { initials, updateUserData } = useUser();

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
        const userId = AuthService.getUserId();
        if (userId) {
          const response = await UserService.updateUserPicture(
            userId,
            formData,
          );
          if (response instanceof Blob) {
            const imageUrl = URL.createObjectURL(response);
            setImageUrl(imageUrl);

            updateUserData({ imageUrl: imageUrl });
            toast({
              title: "Picture updated.",
              description:
                "Your profile picture has been uploaded successfully.",
            });
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
      const userId = AuthService.getUserId();
      if (userId) {
        await UserService.deleteUserPicture(userId);
        setImageUrl(null);

        updateUserData({ imageUrl: null });
        setSelectedFile(null);

        toast({
          title: "Picture removed.",
          description: "Your profile picture has been removed.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  useEffect(() => {
    setImageUrl(initialImageUrl);
  }, [initialImageUrl]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="group relative w-fit">
          <Avatar className="h-20 w-20 border border-input shadow-sm">
            <AvatarImage src={imageUrl ?? ""} />
            <AvatarFallback>{initials || getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white bg-opacity-70 opacity-0 transition-opacity group-hover:opacity-100">
            <CameraIcon className="h-8 w-8" />
          </div>
        </DropdownMenuTrigger>
        {imageUrl !== null ? (
          <DropdownMenuContent>
            <label htmlFor="picture">
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
          <DropdownMenuContent className="w-40">
            <label htmlFor="picture">
              <DropdownMenuItem className="hover:cursor-pointer">
                Upload picture
                <DropdownMenuShortcut>
                  <UploadIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </label>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      <Input
        id="picture"
        type="file"
        name="image"
        accept="image/**"
        onChange={handleFileChange}
        className="hidden"
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
              Upload profile picture
            </AlertDialogTitle>
            <AlertDialogDescription
              className={cn("!mt-0 flex items-center justify-center py-8")}
            >
              {selectedFile && (
                <Avatar className="h-28 w-28">
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
    </>
  );
}
