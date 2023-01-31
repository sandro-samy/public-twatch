import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react'
import WishListPage from '../../components/store/wishList/WishListPage';

const index = () => {
  return (
    <WishListPage />
  )
}

export default index

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