import Dashboard from "../../../components/Dashboard";
import {
  BrandType,
  CategoryType,
  Database,
  ImageObject,
  ProductType,
  SubCategoryType,
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
import { getCategories, getCategory, getSubCatecory } from "../../../lib/category";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import Link from "next/link";

const CategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  parent: z.string()
});

type FormSchemaType = z.infer<typeof CategorySchema>;

type ComponentProp = {
  category: {
    id:string,
    name:string,
    created_at:string,
    slug:string,
    parent: string
  };
  parentCategories: CategoryType[];
};

const Category = ({ category, parentCategories }: ComponentProp) => {

const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(CategorySchema),
  });

    const [categoryData, setCategoryData] = useState(category);

  const supabase = useSupabaseClient<Database>();
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {

console.log(data)

  if (typeof data.name === "undefined" || typeof data.slug === "undefined") {
    throw new Error("Please enter valid data");
  } else if (typeof data.name !== "string" || typeof data.slug !== "string") {
    throw new Error("Please enter a valid data");
  }

  const { data: category, error: categoryError } = await supabase
    .from("sub_category")
    .update({
      name: data.name,
      slug: data.slug,
      parent: data.parent,
    })
    .eq("slug", categoryData.slug)
    .select("*")
    .single();

  console.log({ category, categoryError });

  toast.warning("Please wait...");

  if (category) {
    router.push(`/admin/sub_categories/${category.slug}`);
  }

  if (categoryError) {
    toast.error(categoryError.details);
  }
  };

  const parent = parentCategories.find(c => c.id === category.parent);


  console.log({parent});

  return (
    <Dashboard>
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/sub_categories"
            className="bg-slate-800 text-white rounded-lg font-medium font-sans px-8 py-3"
          >
            Back
          </Link>

        </div>
        <div className="bg-white mt-4 border border-slate-200 rounded-xl">
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
                  value={categoryData.name}
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, name: e.target.value })
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
                  value={slugify(categoryData.name, {
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
                  htmlFor="parent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent Category
                </label>
                <select
                  // name="parent"
                  id="parent"
                  {...register("parent")}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value={categoryData.parent}>
                    {categoryData.parent
                      ? parent?.name
                      : "Choose Parent Category"}
                  </option>
                  {parentCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
export default Category;

type SlugParam = {
  params: {
    slug: string;
  };
};

export async function getServerSideProps({ params: { slug } }: SlugParam) {
  const category = await getSubCatecory(slug);
  const parentCategories = await getCategories();

  return {
    props: {
      category,
      parentCategories,
    },
  };
}
