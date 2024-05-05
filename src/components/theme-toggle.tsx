import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

type Theme = "dark" | "light" | "system";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-foreground"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          <DropdownMenuRadioItem value="light" className="hover:cursor-pointer">
            Light
            <DropdownMenuShortcut>
              <SunIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="hover:cursor-pointer">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
