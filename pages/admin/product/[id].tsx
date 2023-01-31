import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import ProductEditPage from "../../../components/admin/product/ProductEditPage";
import Product from "../../../model/Product";
import db from "../../../utils/db";

const index = ({ product }: { product: IProduct }) => {
  return <ProductEditPage product={product} />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: any = await getSession({ req: context.req });

  if (!session || !session.isAdmin) {
    return {
      redirect: {
        destination: "/1",
        permanent: false,
      },
    };
  }
  const id = context.query.id;
  await db.connect();
  const product = JSON.parse(JSON.stringify(await Product.findById(id)));
  await db.disconnect();
  return {
    props: { product },
  };
}
