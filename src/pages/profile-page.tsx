import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user-settings/settings-layout";
import UpdateProfileForm from "@/components/user-settings/update-profile-form";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth-service";
import UserService from "@/services/user-service";
import UpdateProfilePicture from "@/components/user-settings/update-profile-picture";
import { toast } from "@/components/ui/use-toast";

type UserData = {
  name: string;
  company?: string | null;
  location?: string | null;
  picture?: Blob | null;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Boards | Profile";
  }, []);

  const fetchUserData = async () => {
    const userId = AuthService.getUserId();
    if (userId) {
      try {
        const user = await UserService.getUserById(userId);
        const userDataWithoutPicture = { ...user };
        delete userDataWithoutPicture.picture;
        setUserData(user);
        if (user.picture) {
          const imageUrl = `data:image/png;base64,${user.picture}`;
          setImageUrl(imageUrl);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData]);

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <UpdateProfilePicture
            initialImageUrl={imageUrl}
            name={userData?.name || ""}
          />
          <div>
            <h3 className="text-lg font-medium text-foreground">Profile</h3>
            <p className="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p>
          </div>
        </div>
        <Separator />
        <UpdateProfileForm userData={userData} />
      </div>
    </SettingsLayout>
  );
}
