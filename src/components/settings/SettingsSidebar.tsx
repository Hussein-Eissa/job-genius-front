import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  HelpCircle,
  LogOut,
  LayoutGrid,
  FileText,
  Bookmark,
  User,
} from "lucide-react";
import LogoIcon from "@/components/common/LogoIcon";
import { useUserStore } from "@/reducers/UserReducerStore";
import { useProfileStore } from "@/reducers/ProfileReducerStore";
import { useEffect } from "react";

const SettingsSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useUserStore();
  const { profile, fetchMeProfile } = useProfileStore();

  useEffect(() => {
    fetchMeProfile();
    console.log("profile?.image");
    console.log(profile?.image);
    
  }, [fetchMeProfile]);

  function HandelLogOut() {
    logout();
    console.log("Logged Out");
  }

  const navItems = [
    { to: "/overview", label: "Overview", icon: <LayoutGrid size={20} /> },
    { to: "/applications", label: "My Applications", icon: <FileText size={20} /> },
    { to: "/saved-jobs", label: "Saved Jobs", icon: <Bookmark size={20} /> },
    { to: "/profile", label: "My Profile", icon: <User size={20} /> },
  ];

  return (
    <aside className="bg-[#f5f9ff] w-60 min-w-60 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <LogoIcon className="h-8 w-8" />
          <span className="ml-2 text-xl font-semibold">JobGenius</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center py-2 px-3 rounded-md ${
                currentPath === item.to
                  ? "bg-blue-100 text-jobblue font-medium"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <span className="w-6 h-6 mr-3 flex items-center justify-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            SETTINGS
          </h3>

          <Link
            to="/settings"
            className={`flex items-center py-2 px-3 rounded-md ${
              currentPath === "/settings"
                ? "bg-blue-100 text-jobblue font-medium"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <span className="w-6 h-6 mr-3 flex items-center justify-center">
              <Settings size={20} />
            </span>
            Settings
          </Link>

          <Link
            to="/help"
            className={`flex items-center py-2 px-3 rounded-md ${
              currentPath === "/help"
                ? "bg-blue-100 text-jobblue font-medium"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <span className="w-6 h-6 mr-3 flex items-center justify-center">
              <HelpCircle size={20} />
            </span>
            Help Center
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src={profile?.image || "https://randomuser.me/api/portraits/men/44.jpg"}
            alt="User Avatar"
            className="h-10 w-10 rounded-full mr-3 object-cover"
          />
          <div className="flex flex-col overflow-hidden">
            <p className="font-semibold">{profile?.fullname || "User"}</p>
            <p className="text-sm text-gray-500" title={profile?.email} >{profile?.email || "Loading..."}</p>
          </div>
        </div>

        <button 
          className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={HandelLogOut}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
