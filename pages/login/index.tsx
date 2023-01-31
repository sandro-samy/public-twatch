import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import LoginPage from "../../components/login/LoginPage";

const index = () => {
  return <LoginPage />;
};

export default index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });
  const { redirect } = context.query;

  if (session) {
    if (!redirect) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: redirect,
          permanent: false,
        },
      };
    }
  }
  return {
    props: { session },
  };
}
