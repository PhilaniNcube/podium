import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";
import slugify from "slugify";
import Dashboard from "../../../components/Dashboard";
import { BrandType, Database } from "../../../utils/database.d.types";
import { v4 as uuidv4 } from "uuid";
import { GetServerSideProps } from "next";
import { getBrands } from "../../../lib/brands";
import { RiEyeLine } from "react-icons/ri";

type ComponentProps = {
  brands: BrandType[]
}

const Brands = ({brands}:ComponentProps) => {

 const router = useRouter();

 const supabase = useSupabaseClient<Database>();

 const createDraftBrand = async () => {

    const slug_id = uuidv4();
    const slug = slugify(`Draft ${slug_id}`, {
      lower: true,
      replacement: "_",
      trim: true,
    });

   const { data, error } = await supabase
     .from("brands")
     .insert([{ name: "Draft", slug: slug }])
     .select("*")
     .single();

   console.log({ data, error });

   if (error) {
     toast.error(`${error.message}`);
   } else if (data) {
     router.push(`/admin/brands/${data.slug}`);
   }
 };

console.log({brands})

  return (
    <Dashboard>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Brands</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="bg-slate-800 text-white rounded-lg font-medium font-sans px-8 py-3"
          >
            Back To Dashboard
          </Link>
          <button
            onClick={createDraftBrand}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium font-sans px-8 py-3 flex items-center space-x-2"
          >
            <span>New Brand</span>
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="mt-6 w-full">
        <table className="w-full rounded-md overflow-hidden">
          <thead className="bg-slate-400 p-4 border-b-2 border-slate-800">
            <tr className="p-3">
              <th className="px-3 text-lg font-bold text-slate-900 text-left">
                Name
              </th>
              <th className="px-3 text-lg font-bold text-slate-900 text-left">
                Slug
              </th>
              <th className="px-3 text-lg font-bold text-slate-900 text-left">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {brands?.map((brand) => (
              <tr
                key={brand.id}
                className="text-md font-bold odd:bg-slate-100 even:bg-slate-200"
              >
                <td className="px-3 text-md text-slate-700 font-medium">
                  {brand.name}
                </td>
                <td className="px-3 text-md text-slate-700 font-medium">
                  {brand.slug}
                </td>
                <td className="px-3 text-md text-slate-700">
                  <Link href={`/admin/brands/${brand.slug}`}>
                    <RiEyeLine className="text-lg" />
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

  const brands = await getBrands()

  return {
    props: {
      brands
    }
  }
}
