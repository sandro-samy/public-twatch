import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import PlaceOrderPage from "../../components/store/paymentCycle/place-order/PlaceOrderPage";

const index = () => {
  return <PlaceOrderPage />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/place-order",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}