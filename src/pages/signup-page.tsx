import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/auth/sign-up-form";
import LogoButton from "@/components/logo-button";
import ThemeToggle from "@/components/theme-toggle";
import { Link } from "react-router-dom";

export default function SignupPage() {
  useEffect(() => {
    document.title = "Boards | Sign up";
  }, []);

  return (
    <>
      <LogoButton />
      <div className="absolute right-4 top-4 flex gap-8 text-base md:right-8 md:top-8">
        <Button asChild variant="ghost">
          <Link className="text-foreground" to="/login">
            Log in
          </Link>
        </Button>
        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Sign up
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create an account
            </p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking sign up, you agree to the <br />
            <span>
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
            </span>
          </p>
          <p className="px-8 text-center text-sm text-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
