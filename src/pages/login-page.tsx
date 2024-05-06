import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import LogInForm from "@/components/auth/log-in-form";
import LogoButton from "@/components/logo-button";
import ThemeToggle from "@/components/theme-toggle";
import { Link } from "react-router-dom";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Boards | Log in";
  }, []);

  return (
    <>
      <LogoButton />
      <div className="absolute right-4 top-4 flex gap-8 text-base md:right-8 md:top-8">
        <Button asChild variant="ghost">
          <Link className="text-foreground" to="/signup">
            Sign up
          </Link>
        </Button>
        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-4 flex h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Log in
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Enter your details to get started
            </p>
          </div>
          <LogInForm />
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
          <p className="px-8 text-center text-sm text-foreground">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
