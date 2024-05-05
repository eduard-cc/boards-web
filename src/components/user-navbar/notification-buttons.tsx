import {
  Cross2Icon,
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Notification } from "@/types/notification";
import NotificationService from "@/services/notification-service";
import { toast } from "@/components/ui/use-toast";

type NotificationButtonsProps = {
  notification: Notification;
  userId: number | null;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export default function NotificationButtons({
  notification,
  userId,
  setNotifications,
}: NotificationButtonsProps) {
  const [isHovered, setIsHovered] = useState(false);

  async function handleDeleteNotification(notificationId: number) {
    try {
      if (userId) {
        await NotificationService.deleteNotification(userId, notificationId);
        setNotifications((oldNotifications) =>
          oldNotifications.filter(
            (notification) => notification.id !== notificationId,
          ),
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  async function handleToggleRead(notification: Notification) {
    if (userId) {
      try {
        await NotificationService.toggleRead(userId, notification.id);
        setNotifications((oldNotifications) =>
          oldNotifications.map((oldNotification) =>
            oldNotification.id === notification?.id
              ? { ...oldNotification, read: !oldNotification.read }
              : oldNotification,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="grid gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteNotification(notification.id);
              }}
              className="invisible h-6 w-6 group-hover:visible"
            >
              <Cross2Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dismiss</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                handleToggleRead(notification);
              }}
              className="invisible h-6 w-6 group-hover:visible"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered ? (
                !notification.read ? (
                  <EnvelopeOpenIcon className="h-4 w-4" />
                ) : (
                  <EnvelopeClosedIcon className="h-4 w-4" />
                )
              ) : !notification.read ? (
                <EnvelopeClosedIcon className="h-4 w-4" />
              ) : (
                <EnvelopeOpenIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{notification.read ? "Mark as unread" : "Mark as read"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
