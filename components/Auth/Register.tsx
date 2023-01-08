import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { RiLock2Line, RiMailAddLine, RiMailLine, RiUser3Line } from "react-icons/ri";
import { Database } from "../../utils/database.d.types";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

type FormSchemaType = z.infer<typeof UserSchema>;

const Register = () => {
  const supabase = createBrowserSupabaseClient<Database>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data);

    if (
      typeof data.email === "undefined" ||
      typeof data.password === "undefined" ||
      typeof data.first_name === "undefined" ||
      typeof data.last_name === "undefined"
    ) {
      throw new Error("Please enter valid data");
    } else if (
      typeof data.password !== "string" ||
      typeof data.email !== "string" ||
      typeof data.first_name !== "string" ||
      typeof data.last_name !== "string"
    ) {
      throw new Error("Please enter a valid data");
    }

    const { data: user, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options : {
        data : {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      }
    });

    console.log({ user, error });

    if (error) {
      toast.error(JSON.stringify(error.message));
    } else {
      toast.success("Registration Successful. Please check your email address to confirm your sign up!", {
        delay: 1000,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full grid grid-cols-3 h-full shadow-md rounded-lg overflow-hidden">
        <div className="col-span-1 hidden lg:flex">
          <Image
            src="/images/podium.jpg"
            width={1920}
            height={3413}
            alt="Podium"
            className="w-full object-cover "
          />
        </div>
        <div className="h-full w-full p-8 bg-slate-50 col-span-3 lg:col-span-2">
          <h1 className="font-bold text-slate-600 text-3xl">
            We are <span className="underline text-slate-800">Podium Push</span>
          </h1>

          <p className="mt-3 text-md font-medium text-slate-700">
            Welcome back, please sign in to your account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full mt-8"
          >
            <div className="flex items-center space-x-7">
              <RiUser3Line className="text-slate-400 h-10 w-10" />
              <div className="flex flex-col w-full">
                <label
                  htmlFor="first_name"
                  className="text-slate-400 text-md sr-only"
                >
                  First Name
                </label>
                <input
                  {...register("first_name")}
                  type="text"
                  placeholder="First Name"
                  className="w-full  border-slate-200 rounded-xl focus:outline-none  focus:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-7">
              <RiMailLine className="text-slate-400 h-10 w-10" />
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="text-slate-400 text-md sr-only"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  placeholder="Email"
                  className="w-full  border-slate-200 rounded-xl focus:outline-none  focus:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-7 mt-8">
              <RiLock2Line className="text-slate-400 h-10 w-10" />
              <div className="flex flex-col w-full">
                <label
                  htmlFor="password"
                  className="text-slate-400 text-md sr-only"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="Password"
                  className="w-full focus:outline-none  focus:ring-0  border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              className="bg-slate-700 text-white mt-4 w-full rounded-xl text-xl uppercase font-medium py-3"
              type="submit"
            >
              Sign In
            </button>
            <span className="text-slate-700 text-md mt-10 py-6">
              Dont Have an account?{" "}
              <Link href="/sign_up" className="font-bold">
                Sign Up
              </Link>
            </span>
            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
