import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CaretDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import AuthService from "@/services/auth-service";
import ProjectService from "@/services/project-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Project } from "@/types/project";

export default function ProjectsMenu() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = AuthService.getUserId();
      if (userId) {
        try {
          const projects = await ProjectService.getProjectsByUserId(userId);
          setProjects(projects);
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

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-foreground">
          Projects
          <CaretDownIcon className={cn("ml-1 h-4 w-4")} />
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent align="start" className={cn("min-w-[16rem]")}>
          {projects.map((project) => (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                navigate("/projects/" + project.id + "/list");
              }}
              key={project.id}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 rounded-md">
                  <AvatarImage src={`data:image/png;base64,${project.icon}`} />
                  <AvatarFallback className="rounded-md text-xs font-normal">
                    {getInitials(project.name)}
                  </AvatarFallback>
                </Avatar>
                <p>
                  {project.name}
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    ({project.key})
                  </span>
                </p>
              </div>
            </DropdownMenuItem>
          ))}
          {projects.length != 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem
            onClick={() => {
              navigate("/projects");
            }}
            className="hover:cursor-pointer"
          >
            View all projects
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate("/create-project");
            }}
            className="hover:cursor-pointer"
          >
            Create project
            <DropdownMenuShortcut>
              <PlusIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
