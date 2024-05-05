import type { User } from "./user";

export type Member = {
  id: number;
  user: User;
  role: Role;
  joinedOn: Date;
};

export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  DEVELOPER = "DEVELOPER",
  VIEWER = "VIEWER",
}
