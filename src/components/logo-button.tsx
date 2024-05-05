import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "/logo.svg";

export default function LogoButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="absolute left-4 top-4 flex items-center md:left-8 md:top-8"
    >
      <Link to="/">
        <img src={Logo} alt="Boards Logo" className="h-6 w-6" />
        <span className="ml-2 text-2xl font-medium text-foreground">
          Boards
        </span>
      </Link>
    </Button>
  );
}
