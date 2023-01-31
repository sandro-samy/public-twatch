import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import ProductsAdmin from "../../../components/admin/products/ProductsAdmin";

const index = () => {
  return <ProductsAdmin />;
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
  return {
    props: { session },
  };
}
