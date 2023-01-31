import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import UsersAdmin from "../../../components/admin/users/UsersAdmin";

const index = () => {
  return <UsersAdmin />;
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
