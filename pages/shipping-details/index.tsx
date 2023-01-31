import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ShippingPage from "../../components/store/paymentCycle/shipping-details/ShippingPage";
import LoadingPage from "../../components/UI/Loading/LoadingPage";

const Index = () => {
  return <ShippingPage />;
};

export default Index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/shipping-details",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
