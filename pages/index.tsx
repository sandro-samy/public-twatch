import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ProductsPage from "../components/store";
import LatestProducts from "../components/UI/Swiper/LatestProducts";
import Product from "../model/Product";
import db from "../utils/db";

const Index = ({
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
  return (
    <>
      <LatestProducts />
      <ProductsPage
        products={products}
        pagesNum={pagesNum}
        brands={brands}
        productsCount={productsCount}
      />
    </>
  );
};
export default Index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (Object.keys(context.query).length > 0) {
    const { query } = context;
    const page: number = Number(query.page) || 1;
    const gender = query.gender || "";
    const brand = query.brand || "";
    const price: string | string[] = query.price || "";
    const rating = query.rating || "";
    const sort = query.sort || "";

    const genderFilter = gender ? { gender } : {};
    const brandFilter = brand ? { brand } : {};
    // const ratingFilter =
    //   rating && rating !== "all"
    //     ? {
    //         rating: {
    //           $gte: Number(rating),
    //         },
    //       }
    //     : {};
    const priceFilter =
      price && price !== "all" && typeof price === "string"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const order: any =
      sort === "lowest"
        ? { price: 1 }
        : sort === "highest"
        ? { price: -1 }
        : sort === "toprated"
        ? { rating: -1 }
        : sort === "newest"
        ? { createdAt: -1 }
        : {};

    await db.connect();
    const brands = await Product.find().distinct("brand");
    const productDocs = await Product.find(
      {
        ...genderFilter,
        ...priceFilter,
        ...brandFilter,
        // ...ratingFilter,
      },
      "-reviews"
    )
      .sort(order)
      .skip((page - 1) * 16)
      .limit(16)
      .lean();

    const productsCount = await Product.countDocuments({
      ...genderFilter,
      ...priceFilter,
      ...brandFilter,
      // ...ratingFilter,
    });
    const products = JSON.parse(JSON.stringify(productDocs));
    await db.disconnect();
    return {
      props: {
        products,
        productsCount,
        page,
        pagesNum: Math.ceil(productsCount / 16),
        brands,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/1",
        permanent: false,
      },
    };
  }
}
