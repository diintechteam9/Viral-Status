import { useState } from "react";
import { Link } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthLayout = ({ onLogin }) => {
  const [authState, setAuthState] = useState({
    step: "role-selection", // 'role-selection', 'register', 'login'
    userType: null, // 'user', 'admin', 'client'
  });

  const handleRoleSelect = (role) => {
    setAuthState({
      step: "login",
      userType: role,
    });
  };

  const switchToLogin = () => {
    setAuthState({
      ...authState,
      step: "login",
    });
  };

  const switchToRegister = () => {
    setAuthState({
      ...authState,
      step: "register",
    });
  };

  const handleRegisterSuccess = () => {
    setAuthState({
      ...authState,
      step: "login",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className=" max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          {authState.step === "role-selection" && "Select Your Role"}
          {authState.step === "login" && `Login as ${authState.userType}`}
          {authState.step === "register" && `Register as ${authState.userType}`}
        </h1>

        {authState.step === "role-selection" && (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        )}

        {authState.step === "login" && (
          <LoginForm
            userType={authState.userType}
            onLogin={onLogin}
            switchToRegister={switchToRegister}
          />
        )}

        {authState.step === "register" && (
          <RegisterForm
            userType={authState.userType}
            onSuccess={handleRegisterSuccess}
            switchToLogin={switchToLogin}
          />
        )}

        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-sm">
          <Link to="/admin" className="text-blue-500 hover:text-blue-700">
            Admin Portal
          </Link>
          <Link
            to="/superadmin"
            className="text-purple-500 hover:text-purple-700"
          >
            Super Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
