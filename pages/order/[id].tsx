import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import OrderPage from "../../components/order/OrderPage";
import Order from "../../model/Order";
import db from "../../utils/db";

const index = ({ order }: { order: IOrder }) => {
  return <OrderPage order={order} />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: any = await getSession({ req: context.req });
  const id = context?.params?.id;
  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=/order/${id}`,
        permanent: false,
      },
    };
  }
  await db.connect();
  const order = JSON.parse(JSON.stringify(await Order.findById(id)));
  await db.disconnect();
  if (!session || (session && !session.isAdmin && session._id !== order.user)) {
    return {
      redirect: {
        destination: `/1`,
        permanent: false,
      },
    };
  }
  return {
    props: { order: order },
  };
}
