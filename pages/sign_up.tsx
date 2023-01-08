import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { Fragment, useState } from "react";
import { Database } from "../utils/database.d.types";

const SignUp = () => {

    const supabase = createBrowserSupabaseClient<Database>();


  return (
    <Fragment>
      <Head>
        <title>Sign In | Podium Push</title>
      </Head>
      <div className="max-w-7xl mx-auto py-10 lg:py-20">
        <SignUp />
      </div>
    </Fragment>
  );
};
export default SignUp;
