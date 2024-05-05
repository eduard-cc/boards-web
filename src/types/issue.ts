import type { Member } from "./member";

export type Issue = {
  id: number;
  key: string;
  title: string;
  description?: string | null;
  assignee?: Member | null;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  createdOn: string;
  dueOn?: string | null;
  createdBy: Member;
  updatedOn?: string | null;
};

export enum IssueType {
  TASK = "TASK",
  EPIC = "EPIC",
  BUG = "BUG",
}

export enum IssueStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELED = "CANCELED",
}

export enum IssuePriority {
  HIGHEST = "HIGHEST",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  LOWEST = "LOWEST",
}
