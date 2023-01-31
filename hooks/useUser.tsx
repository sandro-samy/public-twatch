import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../state/authSlice";

const useUser = () => {
  const {
    data: session,
    status,
  }: { data: any; status: "authenticated" | "unauthenticated" | "loading" } =
    useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(
        login({
          _id: session?._id,
          username: session.user?.name,
          email: session.user?.email,
        })
      );
    }
  }, [status, session]);
};

export default useUser;
