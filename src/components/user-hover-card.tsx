import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";
import { getInitials } from "@/utils/get-initials";
import { BuildingIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/auth-service";
import { Member } from "@/types/member";
import { Separator } from "@/components/ui/separator";
import { formatRole } from "@/utils/format-role";
import { formatDate } from "@/utils/format-date";

type UserHoverCardProps = {
  children: ReactNode;
  member: Member;
  alignment?: "center" | "end" | "start" | undefined;
};

export function UserHoverCard({
  children,
  member,
  alignment,
}: UserHoverCardProps) {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-full"
        align={alignment ? alignment : "center"}
      >
        <div className="flex flex-col">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`data:image/png;base64,${member.user.picture}`}
                />
                <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <Badge className="w-fit" variant="secondary">
                  {formatRole(member.role)}
                </Badge>
                {member.user.id === AuthService.getUserId() && (
                  <Badge className="ml-2">You</Badge>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex items-center whitespace-nowrap">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{member.user.name}</p>
                <p className="text-sm">{member.user.email}</p>
                {member.user.company && (
                  <p className="text-sm text-muted-foreground">
                    <BuildingIcon className="inline-block h-4 w-4" />
                    {" " + member.user.company}
                  </p>
                )}
                {member.user.location && (
                  <p className="text-sm text-muted-foreground">
                    <MapPinIcon className="inline-block h-4 w-4" />
                    {" " + member.user.location}
                  </p>
                )}
                <p className="pt-2 text-sm text-muted-foreground">
                  Joined {formatDate(member.joinedOn.toString()).formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
