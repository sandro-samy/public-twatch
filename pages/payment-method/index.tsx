import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import PaymentMethodPage from "../../components/store/paymentCycle/payment-method/PaymentMethodPage";

const index = () => {
  return <PaymentMethodPage />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/payment-method",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
