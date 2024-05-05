import { Member } from "./member";

export type Comment = {
  id: number;
  createdBy: Member;
  createdOn: string;
  lastUpdatedOn?: string | null;
  body: string;
};
