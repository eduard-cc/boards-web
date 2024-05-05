import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import UserService from "@/services/user-service";
import AuthService from "@/services/auth-service";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clearUserData } = useUser();

  const handleDeleteAccount = async () => {
    try {
      const userId = AuthService.getUserId();
      if (userId) {
        setIsDeleting(true);
        await UserService.deleteUser(userId);
        logout();
        navigate("/");
        clearUserData();
        toast({
          title: "Account deleted.",
          description: "Your account has been permanently deleted.",
        });
      }
    } catch (error) {
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
    <>
      <p className="text-sm font-medium leading-none text-foreground">
        Delete your account
      </p>
      <p className="!mt-3 text-sm leading-none text-muted-foreground">
        All your data will be permanently lost, including your profile, projects
        you own, issues, and messages.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[34rem] text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center justify-center">
              All your data will be permanently lost, including your profile,
              projects you own, issues, and messages. This action is
              irreversible.
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
              {isDeleting ? "Deleting..." : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
