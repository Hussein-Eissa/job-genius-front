import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Button } from "../ui/button";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    applicationsOn: true,
    jobsOn: true,
    recommendationsOn: false,
  });

  const [loading, setLoading] = useState(true);

  // Fetch from API on mount
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const res = await axios.get("https://jobgenius.bsite.net/api/Notification/Settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res?.data) {
          setNotifications(res.data);
        }
      } catch (error) {
        toast.error("Failed to load notification settings", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleCheckboxChange = (name: keyof typeof notifications, checked: boolean) => {
    if (typeof checked !== "boolean") return;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     const res = await axios.put(
  //       "https://jobgenius.bsite.net/api/Notification/Settings",
  //       notifications,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     if (res?.data?.success) {
  //       toast.success("Saved", {
  //         description: "Your notification preferences were updated.",
  //       });
  //     } else {
  //       throw new Error("Update failed");
  //     }
  //   } catch (error) {
  //     toast.error("Error", {
  //       description: "Failed to save settings. Please try again.",
  //     });
  //   }
  // };

  const handleSave = async () => {
    try {
      await axios.put(
        "https://jobgenius.bsite.net/api/Notification/Settings",
        notifications,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Saved", {
        description: "Your notification preferences were updated.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save settings. Please try again.",
      });
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Basic Information</h2>
        <p className="text-gray-600">
          This is notifications preferences that you can update anytime.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading settings...</p>
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Notifications</h3>
              <p className="text-gray-600">Customize your preferred notification settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                key: "applicationsOn",
                label: "Applications",
                description: "Notifications for jobs you have applied to",
              },
              {
                key: "jobsOn",
                label: "Jobs",
                description: "Notifications for job openings that suit your profile",
              },
              {
                key: "recommendationsOn",
                label: "Recommendations",
                description: "Personalized recommendations from recruiters",
              },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      name={key}
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(key as keyof typeof notifications, checked)
                      }
                    />
                    <Label htmlFor={key} className="font-medium">
                      {label}
                    </Label>
                  </div>
                  <p className="text-gray-600 text-sm ml-6 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-6" onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
