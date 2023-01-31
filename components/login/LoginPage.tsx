import React from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
 
  return (
    <div className="min-h-full h-full w-full flex flex-col items-center ">
      <h1 className="text-3xl mb-5 h-1/6">Login</h1>
      <div className="inner-container flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
