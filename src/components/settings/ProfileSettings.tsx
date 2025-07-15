
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfileStore } from "@/reducers/ProfileReducerStore";
import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";

const ProfileSettings = () => {
  // const [profileImage, setProfileImage] = useState<string>("https://randomuser.me/api/portraits/men/44.jpg");
  
  const { profile, fetchMeProfile } = useProfileStore();

  useEffect(() => {
    fetchMeProfile();
  }, [fetchMeProfile]);

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    profile?.image
      ? `https://jobgenius.bsite.net/api${profile.image}`
      : "https://randomuser.me/api/portraits/men/44.jpg"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
    handleFile(fileInputRef.current?.files?.[0]);
  };

  const Toast_message = (Kind, message: string, descripe: string) => {
    setTimeout(() => {
      if (Kind === "success") {
        toast.success(message, {
          description: descripe,
        });
      } else if (Kind === "error") {
        toast.error(message, {
          description: descripe,
        });
      }
    }, 1500);
  };

  const handleSaveProfile = async () => {
    const fullName = (document.getElementById("fullName") as HTMLInputElement)?.value?.trim();
    const jobTitle = (document.getElementById("title") as HTMLInputElement)?.value?.trim();
    const phone = (document.getElementById("phoneNumber") as HTMLInputElement)?.value?.trim();
    const gender = (document.getElementById("gender") as HTMLSelectElement)?.value;
    const type = (document.getElementById("type") as HTMLSelectElement)?.value;

    const errors = [];

    if (!fullName || fullName.length < 3) {
      errors.push("Full name must be at least 3 characters.");
    }

    if (!jobTitle || jobTitle.length < 3) {
      errors.push("Job title must be at least 3 characters.");
    }

    const phoneRegex = /^[0-9]{8,15}$/; // Allow 8–15 digits only
    if (!phone || !phoneRegex.test(phone)) {
      errors.push("Phone number must be 8 to 15 digits only.");
    }

    if (errors.length > 0) {
      // alert("Please fix the following:\n\n" + errors.join("\n"));
      Toast_message("error", "Validation Error", errors.join("\n"));
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("jobTitle", jobTitle);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("type", type);
    formData.append("aboutMe", profile?.aboutMe);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://jobgenius.bsite.net/api/Profile/Update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      console.log("Profile updated successfully:", data);

      // alert("Profile updated successfully!");
      Toast_message("success", "Profile Updated", "Your profile has been updated successfully.");
      fetchMeProfile(); // Refresh profile data

    } catch (error) {
      console.error("Error updating profile:", error);
      // alert("Failed to update profile. Please try again.");
      Toast_message("error", "Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Basic Information</h2>
        <p className="text-gray-600">This is your personal information that you can update anytime.</p>
      </div>
      
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-2">Profile Photo</h3>
        <p className="text-gray-600 mb-4">
          This image will be shown publicly as your profile picture, it will help recruiters recognize you!
        </p>
        
        <div className="flex justify-start gap-8">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border"
          />
          
          <div
            onClick={handleDivClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-[350px] h-[200px] border-4 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                stroke="#4B5563"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 font-medium text-center">Click to replace</p>
            <p className="text-xs text-gray-600 text-center mt-1">or drag and drop</p>
            <p className="text-xs text-gray-600 text-center mt-1">
              SVG, PNG, JPG (max. 400 x 400px)
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
      </div>
      
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-4">Personal Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              name="fullname"
              id="fullName" 
              defaultValue={profile?.fullname} 
              className="mt-1" 
            />
          </div>
          
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input 
              id="title" 
              defaultValue={profile?.jobTitle} 
              className="mt-1" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                defaultValue={profile?.phone} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                defaultChecked={profile?.gender}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type" 
                defaultChecked={profile?.type} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1"
              >
                <option value="freelance">Freelancer</option>
                <option value="full-time">Full time</option>
                <option value="part-time">Part time</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="flex justify-end">
        <Button className="bg-jobblue hover:bg-jobblue-dark" onClick={handleSaveProfile}>Save Profile</Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
