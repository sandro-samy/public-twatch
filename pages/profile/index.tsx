import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import UpdateProfilePage from "../../components/update-profile/UpdateProfilePage";

const index = () => {
  return <UpdateProfilePage />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/profile",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
