import Footer from "@/components/home-page/footer";
import LogoButton from "@/components/logo-button";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Boards | Privacy Policy";
  }, []);

  return (
    <>
      <LogoButton />
      <div className="absolute right-4 top-4 flex gap-4 text-base md:right-8 md:top-8 md:gap-8">
        <Button asChild variant="ghost">
          <Link className="text-foreground" to="/login">
            Log in
          </Link>
        </Button>
        <Button asChild>
          <Link className="text-foreground" to="/signup">
            Sign up
          </Link>
        </Button>
        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="max-w-[40rem] px-4 pt-20 text-foreground sm:pt-28">
          <h1 className="mb-6 text-4xl font-medium">Privacy Policy</h1>
          <p>
            Welcome to Boards, a project management web application designed to
            enhance collaboration and streamline project workflows. By accessing
            or using Boards, you agree to comply with and be bound by the
            following Privacy Policy. Please read this Privacy Policy carefully
            before using our application.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p>
            Boards collects information provided by users during the
            registration process, including but not limited to name, email,
            picture, company, and location.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p>
            a. The information collected is used to provide and improve the
            functionality of the application, personalize user experience, and
            communicate with users.
            <br />
            b. Boards does not use cookies for tracking user activities.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            3. Information Sharing
          </h2>
          <p>
            a. Boards may share user information with third-party service
            providers for the purpose of providing and enhancing the
            application's features.
            <br />
            b. User information will not be sold or disclosed to third parties
            for marketing or advertising purposes.
          </p>

          <h2 className="my-4 text-2xl font-semibold">4. Data Security</h2>
          <p>
            Boards takes measures to protect user information, but no method of
            transmission over the internet or electronic storage is entirely
            secure. Users are encouraged to use strong passwords.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            5. Changes to Privacy Policy
          </h2>
          <p>
            Boards may update or modify this Privacy Policy from time to time.
            Users will be notified of significant changes, and continued use of
            the application after such modifications constitutes acceptance of
            the revised Privacy Policy.
          </p>

          <h2 className="my-4 text-2xl font-semibold">Contact Information</h2>
          <p>
            For any questions or concerns regarding this Privacy Policy, please
            contact us at contact@boardsapp.com.
          </p>

          <p className="mt-8">
            By using Boards, you acknowledge that you have read, understood, and
            agree to this Privacy Policy.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
