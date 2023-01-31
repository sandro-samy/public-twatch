import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useWishList from "../../hooks/useWishList";
import Filter from "../UI/Filter/Filter";
import LoadingPage from "../UI/Loading/LoadingPage";
import Pagination from "../UI/Pagination/Pagination";
import Sort from "../UI/Sort/Sort";
import ProductCard from "./productCard/ProductCard";

const ProductsPage = ({
  products,
  pagesNum,
  brands,
  productsCount,
}: {
  products: IProduct[];
  pagesNum: number;
  brands: string[];
  productsCount: number;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const type: "route" | "query" =
    Object.keys(router.query).length >= 2 ? "query" : "route";
  const currentPage: number =
    (type == "query"
      ? Number(router.query.page)
      : Number(router.asPath.split("/")[router.asPath.split.length - 1])) || 1;
  const { refetch } = useWishList();

  const countOfPage = Math.ceil(products.length / 16);

  useEffect(() => {
    const end = () => {
      setLoading(false);
    };
    if (["", "[page]"].includes(router.pathname.split("/")[1])) {
      router.events.on("routeChangeComplete", end);
      router.events.on("routeChangeError", end);

      return () => {
        router.events.off("routeChangeComplete", end);
        router.events.off("routeChangeError", end);
      };
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full ">
      <div className="mx-auto pt-2 mb-3">
        <h1 className="text-3xl text-center">Products</h1>
      </div>
      <div className="grid grid-cols-2 max-w-4xl w-11/12 justify-end items-center gap-5 mb-4">
        <div className="col-span-1 flex justify-start items-center">
          <h3 className={`text-lg ${loading ? "text-gray-500" : "text-black"}`}>
            Results : {productsCount}
          </h3>
        </div>
        <div className="col-span-1 flex justify-end items-center gap-4">
          <Sort setLoading={setLoading} dir="right" disabled={loading} />
          <Filter setLoading={setLoading} brands={brands} disabled={loading} />
        </div>
      </div>
      {Object.keys(router.query).length >= 2 && loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                i={i}
                refetch={refetch}
              />
            ))}
          </div>
          <Pagination
            pagesNum={pagesNum}
            currentPage={currentPage}
            type={type}
          />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
