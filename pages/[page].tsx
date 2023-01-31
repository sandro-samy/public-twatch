import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import React from "react";
import ProductsPage from "../components/store";
import LatestProducts from "../components/UI/Swiper/LatestProducts";
import Product from "../model/Product";
import db from "../utils/db";

const index = ({
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

export default index;
export async function getStaticProps(context: GetStaticPropsContext) {
  await db.connect();
  const pageNumber: number =
    (context?.params?.page && Number(context?.params?.page[0])) || 1;
  const products = JSON.parse(JSON.stringify(await Product.find({})));

  const pageProducts = products.slice((pageNumber - 1) * 16, pageNumber * 16);
  const brands = JSON.parse(
    JSON.stringify(await Product.find().distinct("brand"))
  );
  const productsCount = await Product.countDocuments({});
  await db.disconnect();

  const pagesNum = Math.ceil(products.length / 16);
  return {
    props: { products: pageProducts, pagesNum, brands, productsCount },
    revalidate: 1,
  };
}

export async function getStaticPaths(context: GetStaticPathsContext) {
  await db.connect();
  const numberOfPages = Math.ceil((await Product.find({}).count()) / 16);
  await db.disconnect();
  const paths = [];
  for (let i = 1; i <= numberOfPages; i++) {
    paths.push({ params: { page: i.toString() } });
  }
  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
}
