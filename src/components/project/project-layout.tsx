import { Link, useLocation, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import ProjectService from "@/services/project-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import React from "react";
import { useProjectContext } from "@/providers/project-provider";
import MemberService from "@/services/member-service";
import AuthService from "@/services/auth-service";
import { Role } from "@/types/member";
import { GearIcon } from "@radix-ui/react-icons";
import { KanbanSquareIcon, TablePropertiesIcon, UsersIcon } from "lucide-react";
import NotFoundPage from "@/pages/not-found-page";

type ProjectLayoutProps = {
  children: React.ReactNode;
};

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { pathname } = useLocation();
  const {
    projectData,
    setProjectData,
    currentMember,
    setCurrentMember,
    issueCount,
    memberCount,
  } = useProjectContext();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const currentUserId = AuthService.getUserId();
  const [hasError, setHasError] = useState(false);

  const navItems = [
    {
      title: "List",
      href: `/projects/${id}/list`,
      icon: TablePropertiesIcon,
    },
    {
      title: "Board",
      href: `/projects/${id}/board`,
      icon: KanbanSquareIcon,
    },
    {
      title: "Members",
      href: `/projects/${id}/members`,
      icon: UsersIcon,
    },
    {
      title: "Settings",
      href: `/projects/${id}/settings`,
      icon: GearIcon,
    },
  ];

  useEffect(() => {
    const fetchProjectData = async () => {
      if (id) {
        try {
          const project = await ProjectService.getProjectById(id);
          setProjectData(project);
          const imageUrl = `data:image/png;base64,${projectData?.icon}`;
          setImageUrl(imageUrl);
          document.title = `Boards | ${project.name}`;
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
          setHasError(true);
        }
      }
    };

    const fetchCurrentMember = async () => {
      if (id && currentUserId) {
        try {
          const currentMember = await MemberService.getCurrentMember(
            currentUserId,
            id,
          );
          setCurrentMember(currentMember);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
        }
      }
    };
    fetchProjectData();
    fetchCurrentMember();
  }, [currentUserId, id, projectData?.icon, setCurrentMember, setProjectData]);

  useEffect(() => {
    if (projectData?.icon == null) {
      setImageUrl(null);
    }
    if (projectData && projectData.icon instanceof Blob) {
      const imageUrl = URL.createObjectURL(projectData.icon);
      setImageUrl(imageUrl);
    }
  }, [projectData]);

  if (hasError) {
    return <NotFoundPage />;
  }

  return (
    <div className="space-y-6 p-7 md:block">
      <div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarImage src={imageUrl ?? ""} />
            <AvatarFallback className="rounded-md text-xs font-normal">
              {projectData && getInitials(projectData?.name)}
            </AvatarFallback>
          </Avatar>
          {projectData && (
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              <p>{projectData.name}</p>
            </h1>
          )}
        </div>
        <nav className="my-4 flex gap-4 text-foreground">
          {navItems.map((item) =>
            item.title !== "Settings" ||
            currentMember?.role === Role.ADMIN ||
            currentMember?.role === Role.OWNER ? (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "underline-offset-2",
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:cursor-default hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
                {pathname === item.href &&
                (item.title === "List" || item.title === "Board") ? (
                  <span className="text-muted-foreground">
                    &nbsp;({issueCount})
                  </span>
                ) : null}
                {pathname === item.href && item.title === "Members" ? (
                  <span className="text-muted-foreground">
                    &nbsp;({memberCount})
                  </span>
                ) : null}
              </Link>
            ) : null,
          )}
        </nav>
        <Separator />
      </div>
      <>{children}</>
    </div>
  );
}
