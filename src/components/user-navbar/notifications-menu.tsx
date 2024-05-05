import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { NotificationType, type Notification } from "@/types/notification";
import { useEffect, useState } from "react";
import NotificationService from "@/services/notification-service";
import AuthService from "@/services/auth-service";
import { Client } from "@stomp/stompjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import NotificationDismissAll from "./notification-dismiss-all";
import NotificationCard from "./notification-card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export default function NotificationsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const userId = AuthService.getUserId();
  const [showUnreadOnly, setShowUnreadOnly] = useState(() => {
    const storedValue = localStorage.getItem("showUnreadOnly");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("showUnreadOnly", JSON.stringify(showUnreadOnly));
  }, [showUnreadOnly]);

  useEffect(() => {
    const setupStompClient = async () => {
      const userId = AuthService.getUserId();
      const stompClient = new Client({
        brokerURL: import.meta.env.VITE_WS_URL,
      });

      stompClient.onConnect = async () => {
        stompClient.subscribe(
          `/user/${userId}/queue/notifications`,
          (notification) => {
            const lastNotification: Notification = JSON.parse(
              notification.body,
            );
            onNotificationReceived(lastNotification);
          },
          { id: `sub-${userId}` },
        );
      };

      stompClient.onStompError = async (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };

      stompClient.activate();

      return () => {
        if (stompClient) {
          stompClient.deactivate();
        }
      };
    };

    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const notifications =
          await NotificationService.getNotificationsByUserId(userId);
        setNotifications(notifications);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    };

    fetchNotifications();
    setupStompClient();
  }, [userId]);

  useEffect(() => {
    setUnreadNotificationCount(
      notifications.filter((notification) => !notification.read).length,
    );
  }, [notifications]);

  const onNotificationReceived = (notification: Notification) => {
    setNotifications((oldNotifications) => [notification, ...oldNotifications]);
    toast({
      variant: "default",
      title: "New notification",
      description: toastBody(notification),
    });
  };

  const toastBody = (notification: Notification) => {
    return (
      <>
        {notification.type === NotificationType.ADDED_TO_PROJECT ? (
          <>
            <span>{notification.sender.user.name} added you to </span>
            <Link
              to={`/projects/${notification.project?.id}/list`}
              className="text-primary hover:underline dark:text-pink-600"
            >
              {notification.project?.name}
            </Link>
          </>
        ) : (
          <>
            <span>{notification.sender.user.name} assigned you to </span>
            <Link
              to={`/projects/${notification.project?.id}/list`}
              className="text-primary hover:underline dark:text-pink-600"
            >
              {notification.issue?.key}
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative rounded-full text-foreground")}
        >
          <BellIcon className="h-5 w-5" />
          {unreadNotificationCount > 0 && (
            <div className="absolute right-0 top-0 rounded-full bg-primary px-1 text-xs text-white">
              {unreadNotificationCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent align="end" className="w-[27rem]">
          <DropdownMenuLabel>
            <div className="flex justify-between gap-10 space-x-10">
              <p>Notifications</p>
              <div className="flex items-center space-x-2">
                <Label htmlFor="only-show-unread">Only show unread</Label>
                <Switch
                  id="only-show-unread"
                  onCheckedChange={(value) => setShowUnreadOnly(value)}
                  checked={showUnreadOnly}
                />
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="max-h-[22rem] overflow-y-auto">
            {notifications.length != 0 ? (
              notifications
                .filter((notification) => !showUnreadOnly || !notification.read)
                .map((notification, index) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "group border-l-[3px]",
                      `${
                        index < notifications.length - 1
                          ? "border-b border-border"
                          : ""
                      }`,
                      !notification.read
                        ? "border-l-primary bg-primary/5 focus:bg-primary/5"
                        : "border-l-transparent focus:bg-inherit",
                    )}
                  >
                    <NotificationCard
                      notification={notification}
                      userId={userId}
                      setNotifications={setNotifications}
                      setIsOpen={setIsOpen}
                    />
                  </DropdownMenuItem>
                ))
            ) : (
              <DropdownMenuItem className="focus:bg-inherit">
                <div className="m-auto flex">
                  <div className="my-2 flex w-full flex-col items-center">
                    <BellIcon className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2">No notifications right now.</p>
                  </div>
                </div>
              </DropdownMenuItem>
            )}
          </ScrollArea>
          {notifications.length > 1 && (
            <NotificationDismissAll
              userId={userId}
              setNotifications={setNotifications}
            />
          )}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
