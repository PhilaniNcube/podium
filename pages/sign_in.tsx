import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { Fragment, useState } from "react";
import SignIn from "../components/Auth/SignIn";

import { Database } from "../utils/database.d.types";

const Sign_In = () => {


  return <Fragment>
    <Head>
      <title>Sign In | Podium Push</title>
    </Head>
    <div className="max-w-7xl mx-auto py-10 lg:py-20">
        <SignIn />
    </div>
  </Fragment>;
};
export default Sign_In;
