import React from "react";
import UpdateProfileForm from "./UpdateProfileForm";

const UpdateProfilePage = () => {
  return (
    <div className="min-h-full h-full w-full flex flex-col items-center ">
      <h1 className="text-3xl mb-5 h-1/6">Update Profile</h1>
      <div className="inner-container flex justify-center items-center">
        <UpdateProfileForm />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
