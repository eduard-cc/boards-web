import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user-settings/settings-layout";
import EmailForm from "@/components/user-settings/change-email-form";
import { useEffect, useState } from "react";
import UserService from "@/services/user-service";
import AuthService from "@/services/auth-service";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/providers/user-provider";

export default function EmailPage() {
  useEffect(() => {
    document.title = "Boards | Email";
  }, []);

  const [userData, setUserData] = useState({
    email: "",
  });
  const { email: userEmail } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const fetchUserEmail = async () => {
    setIsLoading(true);
    const userId = AuthService.getUserId();
    if (userId) {
      try {
        const user = await UserService.getUserById(userId);
        setUserData({ email: user.email });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailChange = (email: string) => {
    setUserData({ email });
  };

  useEffect(() => {
    if (!userData.email) {
      fetchUserEmail();
    }
  }, [userData.email]);

  useEffect(() => {
    if (!userData.email && userEmail) {
      // Set the user email from the context if it's not found in the local state
      setUserData({ email: userEmail });
    }
  }, [userData.email, userEmail]);

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Email</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : userData.email
                ? `Change your current email address: ${userData.email}`
                : "Email not found"}
          </p>
        </div>
        <Separator />
        <EmailForm onEmailChange={handleEmailChange} />
      </div>
    </SettingsLayout>
  );
}
