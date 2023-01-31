import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../state/store";
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js/";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient();
  const initialOptions = {
    "client-id": process?.env?.PAYPAL_CLIENT_ID!,
  };

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PayPalScriptProvider deferLoading={false} options={initialOptions}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PayPalScriptProvider>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
