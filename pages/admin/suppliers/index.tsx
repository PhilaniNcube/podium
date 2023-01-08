import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd, MdOutlinePreview } from "react-icons/md";
import { toast } from "react-toastify";
import slugify from "slugify";
import Dashboard from "../../../components/Dashboard";
import { Database, SupplierType } from "../../../utils/database.d.types";
import { v4 as uuidv4 } from "uuid";
import { getSuppliers } from "../../../lib/suppliers";

type ComponentProps = {
  suppliers: SupplierType[],
}

const Brands = ({suppliers}:ComponentProps) => {
  const router = useRouter();

  const supabase = useSupabaseClient<Database>();

  const createSupplier = async () => {
      const slug_id = uuidv4();
      const slug = slugify(`Draft ${slug_id}`, {
        lower: true,
        replacement: "_",
        trim: true,
      });

    const { data, error } = await supabase
      .from("supplier")
      .insert([{ name: "Draft", slug: slug }])
      .select("*")
      .single();

    console.log({ data, error });

    if (error) {
      toast.error(`${error.message}`);
    } else if (data) {
      router.push(`/admin/suppliers/${data.slug}`);
    }
  };

  return (
    <Dashboard>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Suppliers</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="bg-slate-800 text-white rounded-lg font-medium font-sans px-8 py-3"
          >
            Back To Dashboard
          </Link>
          <button
            onClick={createSupplier}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium font-sans px-8 py-3 flex items-center space-x-2"
          >
            <span>New Supplier</span>
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <table className="w-full rounded-md overflow-hidden shadow-md">
          <thead className="bg-slate-400 border-b border-slate-700">
            <tr>
              <th className="font-bold text-xl text-left tracking-wider px-3 py-2">
                Name
              </th>
              <th className="font-bold text-xl text-left tracking-wider px-3 py-2">
                Contact
              </th>
              <th className="font-bold text-xl text-left tracking-wider px-3 py-2">
                Email
              </th>
              <th className="font-bold text-xl text-left tracking-wider px-3 py-2">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((supplier) => (
              <tr key={supplier.id} className="odd:bg-slate-100 even:bg-slate-300">
                <td className="font-medium text-md text-left tracking-wider px-3 py-1">{supplier.name}</td>
                <td className="font-medium text-md text-left tracking-wider px-3 py-1">{supplier.contact}</td>
                <td className="font-medium text-md text-left tracking-wider px-3 py-1">{supplier.email}</td>
                <td className="font-medium text-md text-left tracking-wider px-3 py-1">
                  <Link href={`/admin/suppliers/${supplier.slug}`}>
                  <MdOutlinePreview className="text-xl" />
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


export async function getServerSideProps(){

  const suppliers  = await getSuppliers()

  return {
    props: {
      suppliers
    }
  }
}
