import { Notification, NotificationType } from "@/types/notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import NotificationButtons from "./notification-buttons";
import { DateTime } from "luxon";
import NotificationService from "@/services/notification-service";
import { toast } from "@/components/ui/use-toast";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";

const issueTypeToSvg = {
  task: taskSvg,
  bug: bugSvg,
  epic: epicSvg,
};

type NotificationCardProps = {
  notification: Notification;
  userId: number | null;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotificationCard({
  notification,
  userId,
  setNotifications,
  setIsOpen,
}: NotificationCardProps) {
  async function handleMarkAsRead() {
    if (!notification.read && userId) {
      try {
        await NotificationService.toggleRead(userId, notification.id);
        setNotifications((prevNotifications) =>
          prevNotifications.map((prevNotification) =>
            prevNotification.id === notification.id
              ? { ...prevNotification, read: true }
              : prevNotification,
          ),
        );
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    }
  }
  return (
    <div className="flex w-full items-center justify-between gap-4">
      {notification.type === NotificationType.ADDED_TO_PROJECT && (
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`data:image/png;base64,${notification.sender.user.picture}`}
            />
            <AvatarFallback className="text-xs font-normal">
              {getInitials(notification.sender.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center whitespace-pre">
              <span className="truncate font-medium">
                {notification.sender.user.name}
              </span>
              <span> added you to </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/projects/${notification.project?.id}/list`}
                      className="group inline-flex items-center"
                      onClick={() => {
                        setIsOpen(false);
                        handleMarkAsRead();
                      }}
                    >
                      <Avatar className="h-5 w-5 rounded-md">
                        <AvatarImage
                          src={`data:image/png;base64,${notification.project?.icon}`}
                        />
                        <AvatarFallback className="rounded-md text-xs font-normal">
                          {notification.project &&
                            getInitials(notification.project?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
                        {notification.project?.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-muted-foreground">
              {DateTime.fromISO(notification.timestamp).toRelative()}
            </div>
          </div>
        </div>
      )}
      {notification.type === NotificationType.ASSIGNED_TO_ISSUE && (
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`data:image/png;base64,${notification.sender.user.picture}`}
            />
            <AvatarFallback className="text-xs font-normal">
              {getInitials(notification.sender.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center whitespace-pre">
              <span className="truncate font-medium">
                {notification.sender.user.name}
              </span>
              <span> assigned you to </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/projects/${notification.project?.id}/list`}
                      className="group inline-flex items-center"
                      onClick={() => {
                        setIsOpen(false);
                        handleMarkAsRead();
                      }}
                    >
                      <div className="inline-block">
                        <Avatar className="h-4 w-4 rounded-[0.2rem]">
                          <AvatarImage
                            src={
                              issueTypeToSvg[
                                notification.issue?.type.toLowerCase() as keyof typeof issueTypeToSvg
                              ]
                            }
                          />
                        </Avatar>
                      </div>
                      <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
                        {notification.issue?.key}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View issue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-muted-foreground">
              {DateTime.fromISO(notification.timestamp).toRelative()}
            </p>
          </div>
        </div>
      )}
      <NotificationButtons
        notification={notification}
        userId={userId}
        setNotifications={setNotifications}
      />
    </div>
  );
}
