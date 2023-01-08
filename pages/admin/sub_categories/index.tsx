import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";
import slugify from "slugify";
import Dashboard from "../../../components/Dashboard";
import { Database, SubCategoryType } from "../../../utils/database.d.types";
import { v4 as uuidv4 } from "uuid";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

import { getSubCategories } from "../../../lib/category";
import { RiEye2Line, RiEyeLine, RiLoaderLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";


type ComponentProps = {
  subCategories: SubCategoryType[],
};

const Brands = ({ subCategories }:ComponentProps) => {
  const router = useRouter();

  const supabase = useSupabaseClient<Database>();

  const createDraftCategory = async () => {
    const slug_id = uuidv4();
    const slug = slugify(`Draft ${slug_id}`, {
      lower: true,
      replacement: "_",
      trim: true,
    });

    const { data, error } = await supabase
      .from("sub_category")
      .insert([{ name: "Draft", slug: slug }])
      .select("*")
      .single();

    console.log({ data, error });

    if (error) {
      toast.error(`${error.message}`);
    } else if (data) {
      router.push(`/admin/sub_categories/${data.slug}`);
    }
  };

  console.log({ subCategories });

  return (
    <Dashboard>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Sub Categories</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="bg-slate-800 text-white rounded-lg font-medium font-sans px-8 py-3"
          >
            Back To Dashboard
          </Link>
          <button
            onClick={createDraftCategory}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium font-sans px-8 py-3 flex items-center space-x-2"
          >
            <span>New Sub Category</span>
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="w-full p-8">
        <div className="w-full flex justify-between mt-4 items-center"></div>
        <table className="w-full">
          <thead className="bg-slate-100 border-b-2 border-slate-300">
            <tr>
              <th className="p-3 text-md font-bold tracking-wide text-left">
                Name
              </th>
              <th className="p-3 text-md font-bold tracking-wide text-left">
                Slug
              </th>
              <th className="p-3 text-md font-bold tracking-wide text-left">
                Parent
              </th>
              <th className="p-3 text-md font-bold tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subCategories?.map((category) => (
              <tr key={category.id} className="odd:bg-slate-50 even:bg-slate-200 px-4 py-2">
                <td className="px-2 py-1 font-medium text-sm">{category.name}</td>
                <td className="px-2 py-1 font-medium text-sm">{category.slug}</td>
                <td className="px-2 py-1 font-medium text-sm">{category.parent.name}</td>
                <td className="px-2 py-1 font-medium text-sm">
                  <Link href={`/admin/sub_categories/${category.slug}`}>
                  <RiEyeLine className="text-xl" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
};
export default Brands;


export async function getServerSideProps() {
   const subCategories = await getSubCategories()

   return {
    props: {
      subCategories
    }
   }
}
