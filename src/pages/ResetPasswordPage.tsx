
import { Link } from "react-router-dom";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import LogoIcon from "@/components/common/LogoIcon";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <img 
            src="/lovable-uploads/Images/image 7.png" 
            alt="Reset password illustration" 
            className="w-3/4 max-w-lg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br opacity-80"></div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="block mb-8">
            <div className="flex items-center">
              <LogoIcon className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold">JobGenius</span>
            </div>
          </Link>
          
          <ResetPasswordForm />
        </div>
      </div>
      
    </div>
  );
};

export default ResetPasswordPage;
