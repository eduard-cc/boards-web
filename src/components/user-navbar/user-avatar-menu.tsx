import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import { useUser } from "@/providers/user-provider";
import { getInitials } from "@/utils/get-initials";
import {
  DesktopIcon,
  ExitIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";

type UserData = {
  name: string;
  email: string;
  picture?: Blob | null;
};

type Theme = "dark" | "light" | "system";

export default function UserAvatarMenu() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const {
    imageUrl: contextImageUrl,
    name: contextName,
    email: contextEmail,
    updateUserData,
    clearUserData,
  } = useUser();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    clearUserData();
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData]);

  useEffect(() => {
    setImageUrl(contextImageUrl);
  }, [contextImageUrl]);

  useEffect(() => {
    if (contextName) {
      setUserData((prevUserData) => {
        if (prevUserData) {
          return { ...prevUserData, name: contextName };
        }
        return null;
      });
    }
  }, [contextName]);

  useEffect(() => {
    if (contextEmail) {
      setUserData((prevUserData) => {
        if (prevUserData) {
          return { ...prevUserData, email: contextEmail };
        }
        return null;
      });
    }
  }, [contextEmail]);

  const fetchUserData = async () => {
    const userId = AuthService.getUserId();
    if (userId) {
      try {
        const user = await UserService.getUserById(userId);
        setUserData(user);
        if (user.picture) {
          const imageUrl = `data:image/png;base64,${user.picture}`;
          setImageUrl(imageUrl);
          updateUserData({ imageUrl: imageUrl });
        }
        updateUserData({ name: user.name, email: user.email });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-9 w-9">
          <AvatarImage src={imageUrl ?? ""} />
          <AvatarFallback>
            {userData?.name ? getInitials(userData.name) : "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("min-w-[16rem]")}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={imageUrl ?? ""} />
            <AvatarFallback className="font-normal">
              {userData?.name ? getInitials(userData.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="max-w-[200px] truncate font-medium">
              {userData?.name}
            </p>
            <p className="max-w-[200px] truncate font-normal text-muted-foreground">
              {userData?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="hover:cursor-pointer"
        >
          Settings
          <DropdownMenuShortcut>
            <GearIcon className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              <DropdownMenuRadioItem
                value="light"
                className="hover:cursor-pointer"
              >
                Light
                <DropdownMenuShortcut>
                  <SunIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="dark"
                className="hover:cursor-pointer"
              >
                Dark
                <DropdownMenuShortcut>
                  <MoonIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="system"
                className="hover:cursor-pointer"
              >
                System
                <DropdownMenuShortcut>
                  <DesktopIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:cursor-pointer"
        >
          Log out
          <DropdownMenuShortcut>
            <ExitIcon className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
