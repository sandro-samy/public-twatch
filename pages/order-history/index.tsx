import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import OrderHistoryPage from "../../components/order-history/OrderHistoryPage";

const index = () => {
  return <OrderHistoryPage />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/order-history",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
