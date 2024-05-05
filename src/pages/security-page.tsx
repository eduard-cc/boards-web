import { Separator } from "@/components/ui/separator";
import SettingsLayout from "@/components/user-settings/settings-layout";
import PasswordForm from "@/components/user-settings/change-password-form";
import DeleteAccount from "@/components/user-settings/delete-account";
import { useEffect } from "react";

export default function SecurityPage() {
  useEffect(() => {
    document.title = "Boards | Security";
  }, []);

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Security</h3>
          <p className="text-sm text-muted-foreground">
            Change your current password or delete your account.
          </p>
        </div>
        <Separator />
        <PasswordForm />
        <DeleteAccount />
      </div>
    </SettingsLayout>
  );
}
