import Dashboard from "../../../components/Dashboard";
import {
  BrandType,
  CategoryType,
  Database,
  ImageObject,
  ProductType,
  SubCategoryType,
  SupplierType,
} from "../../../utils/database.d.types";
// import {v4 as uuidv4} from "uuid"
import { FormEvent, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import slugify from "slugify";
import { toast } from "react-toastify";
import { getBrand } from "../../../lib/brands";
import {
  getCategories,
  getCategory,
  getSubCatecory,
} from "../../../lib/category";
import { getSupplier } from "../../../lib/suppliers";
import { useRouter } from "next/router";

const SupplierSchema = z.object({
  name: z.string(),
  slug: z.string(),
  contact: z.string(),
  email: z.string().email(),
});

type FormSchemaType = z.infer<typeof SupplierSchema>;

type ComponentProp = {
supplier: SupplierType
};

const Supplier = ({ supplier}: ComponentProp) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(SupplierSchema),
  });

  const router = useRouter()

  const [supplierData, setSupplierData] = useState<SupplierType>(supplier);

  const supabase = useSupabaseClient<Database>();

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
      console.log(data);


      if (
        typeof data.name === "undefined" ||
        typeof data.contact === "undefined" ||
        typeof data.email === "undefined" ||
        typeof data.slug === "undefined"
      ) {
        throw new Error("Please enter valid data");
      } else if (
        typeof data.name !== "string" ||
        typeof data.contact !== "string" ||
        typeof data.email !== "string" ||
        typeof data.slug !== "string"
      ) {
        throw new Error("Please enter a valid data");
      }

      const { data: supplier, error: supplierError } = await supabase
        .from("supplier")
        .update({
          name: data.name,
          slug: data.slug,
          contact: data.contact,
          email: data.email,
        })
        .eq("slug", supplierData.slug)
        .select("*")
        .single();

         if (supplier) {
          toast.success('Successfully created supplier')
           router.push(`/admin/suppliers/${supplier.slug}`);
         }

         if (supplierError) {
           toast.error(supplierError.details);
         }

    };

  console.log({ supplierData });

  return (
    <Dashboard>
      <div className="p-8">
        <div className="bg-white border border-slate-200 rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  value={supplierData.name}
                  onChange={(e) =>
                    setSupplierData({ ...supplierData, name: e.target.value })
                  }
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>
                <input
                  {...register("slug")}
                  type="text"
                  name="slug"
                  value={slugify(supplierData.name, {
                    lower: true,
                    replacement: "_",
                    trim: true,
                  })}
                  id="slug"
                  autoComplete="slug"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact
                </label>
                <input
                  {...register("contact")}
                  type="text"
                  name="contact"
                  value={supplierData.contact}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      contact: e.target.value,
                    })
                  }
                  id="contact"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  name="email"
                  value={supplierData.email}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      email: e.target.value,
                    })
                  }
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};
export default Supplier;

type SlugParam = {
  params: {
    slug: string;
  };
};

export async function getServerSideProps({ params: { slug } }: SlugParam) {
  const supplier = await getSupplier(slug);


  return {
    props: {
      supplier,
    },
  };
}
