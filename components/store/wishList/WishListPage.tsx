import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import useWishList from "../../../hooks/useWishList";
import { useAppSelector } from "../../../state/hooks";
import LoadingPage from "../../UI/Loading/LoadingPage";
import Pagination from "../../UI/Pagination/Pagination";
import ProductCard from "../productCard/ProductCard";
import EmptyWishList from "./EmptyWishList";

const WishListPage = () => {
  const [currentWishList, setCurrentWishList] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNum, setPagesNum] = useState(1);
  // updated data from server
  const { wishList, isLoading, refetch } = useWishList();
  const { wishList: stateWishList = [] } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (
      (stateWishList.length > 0,
      typeof wishList !== "undefined" && wishList.length > 0)
    ) {
      let newWishList =
        wishList.filter((item) => stateWishList.includes(item._id)) || [];
      setCurrentWishList(newWishList);
      setPagesNum(Math.ceil(newWishList.length / 16));
    }
    if (
      currentPage > 1 &&
      currentWishList.slice((currentPage - 1) * 16, currentPage * 16).length < 1
    ) {
      setCurrentPage((prev) => (prev -= 1));
    }
  }, [stateWishList, wishList]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full ">
      <h1 className="text-3xl">Wish List</h1>

      {stateWishList.length === 0 ? (
        <EmptyWishList />
      ) : isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
            {typeof wishList !== "undefined"
              ? currentWishList
                  .slice((currentPage - 1) * 16, currentPage * 16)
                  .map((product: IProduct, i: number) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      i={i}
                      refetch={refetch}
                    />
                  ))
              : null}
          </div>
          <Pagination
            pagesNum={pagesNum}
            currentPage={currentPage}
            setState={setCurrentPage}
            type="setState"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(WishListPage);
