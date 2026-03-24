import { Outlet } from "react-router-dom";
import loginImage from "@/assets/login2.jpeg";

function AuthLayout() {
  return (
    <div className="h-dvh w-full overflow-hidden grid grid-cols-1 md:grid-cols-[48%_52%]">
      
     
      <div className="hidden md:block overflow-hidden">
        <img
          src={loginImage}
          alt="Login"
          className="h-full w-full object-fill"
        />
      </div>

      <div className="flex items-center justify-center bg-white px-6 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}

export default AuthLayout;
