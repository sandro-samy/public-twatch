import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import ProductDetails from "../../components/store/productDetails/ProductDetails";
import Product from "../../model/Product";
import db from "../../utils/db";
const Index = ({ product }: { product: IProduct }) => {
  return <>{product ? <ProductDetails product={product} /> : <></>}</>;
};

export default Index;

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = context?.params?.slug;
  await db.connect();
  const product = JSON.parse(JSON.stringify(await Product.findOne({ slug })));
  await db.disconnect();
  return {
    props: { product },
    revalidate:1
  };
}

export async function getStaticPaths() {
  await db.connect();
  const products = JSON.parse(JSON.stringify(await Product.find({})));
  await db.disconnect();
  const paths = products.reduce((acc: any, product: IProduct) => {
    acc.push({ params: { slug: product.slug } });
    return acc;
  }, []);
  return {
    paths,
    fallback: false,
  };
}
