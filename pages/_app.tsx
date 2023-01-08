import '../styles/globals.css'
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from 'next/app';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  DehydratedState
} from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

let persistor = persistStore(store)


function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
  dehydratedState: DehydratedState;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Header />
              <Component {...pageProps} />
              <Footer />
              <ToastContainer position="bottom-right" newestOnTop />
            </PersistGate>
          </Provider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
export default MyApp;
