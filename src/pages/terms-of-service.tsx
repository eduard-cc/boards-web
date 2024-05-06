import Footer from "@/components/home-page/footer";
import LogoButton from "@/components/logo-button";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Boards | Terms of Service";
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
          <h1 className="mb-6 text-4xl font-medium">Terms of Service</h1>
          <p>
            Welcome to Boards, a project management web application designed to
            enhance collaboration and streamline project workflows. By accessing
            or using Boards, you agree to comply with and be bound by the
            following terms and conditions. Please read these Terms of Service
            carefully before using our application.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p>
            By signing up, logging in, or using the Boards application in any
            manner, you agree to these Terms of Service and all other operating
            rules, policies, and procedures that may be published from time to
            time on the platform.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            2. User Accounts and Information
          </h2>
          <p>
            a. You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
            <br />
            b. You agree to provide accurate, current, and complete information
            during the registration process and to update such information to
            keep it accurate, current, and complete.
          </p>

          <h2 className="my-4 text-2xl font-semibold">3. Project Management</h2>
          <p>
            a. Users can create projects, manage memberships, and assign roles
            to members within a project.
            <br />
            b. Project owners and admins have the authority to add or remove
            members from a project and manage their roles.
            <br />
            c. Each member is responsible for adhering to the project's
            guidelines and permissions set by the project owner or admin.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            4. Issues and Collaboration
          </h2>
          <p>
            a. Users can create, edit, and delete issues within a project.
            <br />
            b. Issues can be assigned to project members, and comments can be
            added for effective collaboration.
            <br />
            c. Users can view issues in list/table view or kanban-like view for
            better project tracking.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            5. Profile and Account Management
          </h2>
          <p>
            a. Users can personalize their profiles by adding a picture,
            updating their name, company, location, and email.
            <br />
            b. Account deletion and removal of project members are allowed,
            subject to user's role and permissions.
          </p>

          <h2 className="my-4 text-2xl font-semibold">6. Notifications</h2>
          <p>
            a. Users will receive notifications for project invitations and
            issue assignments.
            <br />
            b. Notifications will be sent when added to a project or assigned to
            an issue by another user.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            7. Data Privacy and Security
          </h2>
          <p>
            a. Boards respects user privacy. Please review our Privacy Policy
            for details on how we collect, use, and protect your information.
            <br />
            b. Users are responsible for the security of their accounts and are
            encouraged to use strong passwords and enable two-factor
            authentication.
          </p>

          <h2 className="my-4 text-2xl font-semibold">
            8. Prohibited Activities
          </h2>
          <p>
            Users agree not to engage in any activity that may disrupt the
            functioning of the application, compromise the security of the
            platform, or violate any applicable laws or regulations.
          </p>

          <h2 className="my-4 text-2xl font-semibold">9. Termination</h2>
          <p>
            Boards reserves the right to terminate or suspend your account and
            access to the application for any reason, without notice.
          </p>

          <h2 className="my-4 text-2xl font-semibold">10. Changes to Terms</h2>
          <p>
            Boards may update or modify these Terms of Service from time to
            time. Users will be notified of significant changes, and continued
            use of the application after such modifications constitutes
            acceptance of the revised terms.
          </p>

          <h2 className="my-4 text-2xl font-semibold">Contact Information</h2>
          <p>
            For any questions or concerns regarding these Terms of Service,
            please contact us at contact@boardsapp.com.
          </p>

          <p className="mt-8">
            By using Boards, you acknowledge that you have read, understood, and
            agree to these Terms of Service.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
