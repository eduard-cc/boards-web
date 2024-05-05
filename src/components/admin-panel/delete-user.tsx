import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { getInitials } from "@/utils/get-initials";
import { useState } from "react";
import UserService from "@/services/user-service";
import { toast } from "@/components/ui/use-toast";

type DeleteUserProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

export function DeleteUser({ state, setState, user }: DeleteUserProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await UserService.deleteUser(user.id);
      toast({
        variant: "success",
        title: "User has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={state} onOpenChange={setState}>
      <AlertDialogContent className="max-w-[34rem] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            This user's data will be permanently lost.
            <div className="mt-2 flex items-center gap-2 text-foreground">
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarImage src={`data:image/png;base64,${user.picture}`} />
                <AvatarFallback className="rounded-md text-xs font-normal">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>{user.name}</div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            className="bg-destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete user"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
