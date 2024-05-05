import { Button } from "@/components/ui/button";
import NotificationService from "@/services/notification-service";
import { toast } from "@/components/ui/use-toast";
import { Notification } from "@/types/notification";

type NotificationDismissAllProps = {
  userId: number | null;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export default function NotificationDismissAll({
  userId,
  setNotifications,
}: NotificationDismissAllProps) {
  async function handleDismissAll() {
    try {
      if (userId) {
        await NotificationService.deleteAllNotifications(userId);
        setNotifications([]);
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
    <Button
      variant="secondary"
      size="sm"
      className="mt-1 w-full"
      onClick={() => handleDismissAll()}
    >
      Dismiss all
    </Button>
  );
}
