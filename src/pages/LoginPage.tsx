
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import LogoIcon from "@/components/common/LogoIcon";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="block mb-8">
            <div className="flex items-center">
              <LogoIcon className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold">JobGenius</span>
            </div>
          </Link>
          
          <LoginForm />
        </div>
      </div>
      
      <div className="hidden md:block md:w-1/2 bg-jobblue relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <img 
            src="/lovable-uploads/a479d8e5-e6f0-427b-8290-941c6a5c547e.png" 
            alt="Login illustration" 
            className="w-3/4 max-w-lg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-jobblue-dark to-jobblue opacity-80"></div>
      </div>
    </div>
  );
};

export default LoginPage;
