import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "/logo.svg";

export default function Footer() {
  return (
    <div className="flex flex-col items-center py-5 md:py-10">
      <Button asChild variant="ghost" className="mb-2 w-fit">
        <Link
          to="/"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img src={Logo} alt="Boards Logo" className="h-5 w-5" />
          <span className="ml-2 text-lg font-medium text-foreground">
            Boards
          </span>
        </Link>
      </Button>
      <div className="flex justify-center gap-2 px-8 text-center text-sm text-muted-foreground">
        <Link
          to="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        <span>|</span>{" "}
        <Link
          to="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
