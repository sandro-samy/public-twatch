import React from "react";
import SignupForm from "./SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-full h-full w-full flex flex-col items-center ">
      <h1 className="text-3xl mb-5 h-1/6">Sign Up</h1>
      <div className="inner-container flex justify-center items-center">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
