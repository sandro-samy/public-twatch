import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { setWishList } from "../state/authSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";

const fetcher = async () => {
  const { data } = await axios.get("/api/wishlist");
  return data;
};

const useWishList = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [pagesNum, setPagesNum] = useState(1);

  const { data: session, status } = useSession();
  const {
    data: wishList,
    refetch,
    isLoading,
  } = useQuery(
    "wishlist",
    status === "authenticated"
      ? fetcher
      : () => {
          return { data: [] };
        }
  );
  const dispatch = useAppDispatch();

  const { wishList: stateWishList = [] } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const localWishList = JSON.parse(localStorage.getItem("wishlist")!);
    if (
      status === "authenticated" &&
      stateWishList.length === 0 &&
      typeof window !== "undefined" &&
      localWishList &&
      localWishList.length > 0
    ) {
      dispatch(setWishList({ wishList: localWishList }));
    }
  }, [status]);

  useEffect(() => {
    if (typeof wishList !== "undefined") {
      const newIds: string[] =
        wishList.length > 0
          ? wishList.reduce((acc: string[], item: IProduct) => {
              acc = [...acc, item._id];
              return acc;
            }, [])
          : [];
      setIds([...newIds]);
      if (
        newIds.length !== stateWishList.length &&
        status === "authenticated"
      ) {
        dispatch(setWishList({ wishList: [...newIds] }));
      }
      setPagesNum(Math.ceil(wishList.length / 16));
    }
  }, [wishList]);

  const res: {
    wishList: IProduct[];
    refetch: typeof refetch;
    ids: string[];
    pagesNum: number;
    isLoading: boolean;
  } = {
    wishList,
    refetch,
    ids,
    pagesNum,
    isLoading,
  };
  return res;
};

export default useWishList;
