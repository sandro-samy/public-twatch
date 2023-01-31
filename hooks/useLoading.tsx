import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const useLoading = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath ? setLoading(true) : setLoading(false);

    const handleComplete = (url: string) =>
      url === router.asPath ? setLoading(false) : setLoading(true);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    console.log(loading);
    // return () => {
    //   router.events.off("routeChangeStart", handleStart);
    //   router.events.off("routeChangeComplete", handleComplete);
    //   router.events.off("routeChangeError", handleComplete);
    // };
  }, [router]);

  return loading;
};

export default useLoading;
