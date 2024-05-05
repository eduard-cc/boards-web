import logo from "/logo.svg";
import { Button } from "@/components/ui/button";
import UserAvatarMenu from "@/components/user-navbar/user-avatar-menu";
import ProjectsMenu from "@/components/user-navbar/projects-menu";
import { Link } from "react-router-dom";
import CreateIssueForm from "@/components/issue/create-issue-form";
import AuthService from "@/services/auth-service";
import NotificationsMenu from "./notifications-menu";

export default function UserNavbar() {
  const isAdmin: boolean = AuthService.getRole() == "ADMIN";
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-secondary bg-background px-7 py-2 shadow-sm">
      <ul className="flex items-center justify-between gap-5">
        <li className="-mx-4 flex items-center">
          <Button asChild variant="ghost">
            <Link to="/projects">
              <img src={logo} alt="Boards Logo" className="h-5 w-auto" />
              <span className="ml-2 text-xl font-medium text-foreground">
                Boards
              </span>
            </Link>
          </Button>
        </li>
        <li>
          <ProjectsMenu />
        </li>
        <li>
          <CreateIssueForm
            trigger={<Button className="whitespace-nowrap">Create</Button>}
          />
        </li>
        {isAdmin && (
          <Button asChild variant="ghost" className="text-foreground">
            <Link to="/users">Admin</Link>
          </Button>
        )}
      </ul>

      <ul className="flex items-center gap-5">
        <li className="flex">
          <NotificationsMenu />
        </li>
        <li className="flex">
          <UserAvatarMenu />
        </li>
      </ul>
    </nav>
  );
}
