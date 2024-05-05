import type { Issue } from "./issue";
import type { Member } from "./member";
import type { Project } from "./project";

export type Notification = {
  id: number;
  type: NotificationType;
  sender: Member;
  receiver: Member;
  issue?: Issue | null;
  project?: Project | null;
  timestamp: string;
  read: boolean;
};

export enum NotificationType {
  ADDED_TO_PROJECT = "ADDED_TO_PROJECT",
  ASSIGNED_TO_ISSUE = "ASSIGNED_TO_ISSUE",
}
