import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/reducers/UserReducerStore";
import { useProfileStore } from "@/reducers/ProfileReducerStore";
import { toast } from "@/components/ui/sonner";

const LoginSettings = () => {
  const [emailVerified, setEmailVerified] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    changePassword,
    ChangePasswordRequest,
    setChangePasswordRequest,
    validatePassword
  } = useUserStore();

  const { profile, fetchMeProfile } = useProfileStore();

  useEffect(() => {
    fetchMeProfile();
  }, [fetchMeProfile]);

  const PasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangePasswordRequest({
      ...ChangePasswordRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { oldPassword, newPassword } = ChangePasswordRequest;

    if (!oldPassword || !newPassword) {
      toast("Missing Fields", {
        description: "Please fill out both old and new passwords.",
      });
      return;
    }

    if (oldPassword === newPassword) {
      toast("Invalid Password", {
        description: "New password must be different from the old one.",
      });
      return;
    }

    const { isValid, message } = validatePassword(newPassword);
    if (!isValid) {
      toast("Weak Password", {
        description: message,
      });
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword });
      setChangePasswordRequest({ oldPassword: "", newPassword: "" });
    } catch (err) {
      // Toast already handled in the store
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Basic Information</h2>
        <p className="text-gray-600">This is login information that you can update anytime.</p>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">Update Email</h3>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">{profile?.email}</span>
            {emailVerified && (
              <div className="bg-green-50 p-1 rounded-full">
                <Check size={16} className="text-green-600" />
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-2">Your email address is verified.</p>
      </div>

      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">New Password</h3>
            <p className="text-gray-600 mb-4">Manage your password to make sure it is safe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Password Field */}
            <div className="relative">
              <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                Old Password
              </label>
              <Input
                name="oldPassword"
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your old password"
                onChange={PasswordChangeHandler}
                value={ChangePasswordRequest.oldPassword}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* New Password Field */}
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                name="newPassword"
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                onChange={PasswordChangeHandler}
                value={ChangePasswordRequest.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              className="bg-jobblue hover:bg-jobblue-dark"
              type="submit"
              disabled={
                !ChangePasswordRequest.oldPassword ||
                !ChangePasswordRequest.newPassword ||
                ChangePasswordRequest.oldPassword === ChangePasswordRequest.newPassword ||
                ChangePasswordRequest.newPassword.length < 8
              }
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSettings;
