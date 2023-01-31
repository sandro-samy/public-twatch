import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import SignupPage from "../../components/signup/SignupPage";

const index = () => {
  return <SignupPage />;
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