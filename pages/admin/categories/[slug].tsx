import Dashboard from "../../../components/Dashboard";
import {
  BrandType,
  CategoryType,
  Database,
  ImageObject,
  ProductType,
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
import { getCategory } from "../../../lib/category";
import { useRouter } from "next/router";

const CategorySchema = z.object({
  name: z.string(),
  slug: z.string(),

});

type FormSchemaType = z.infer<typeof CategorySchema>;

type ComponentProp = {
  category: CategoryType;
};

const Category = ({ category }: ComponentProp) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(CategorySchema),
  });

  const router = useRouter()


  const [categoryData, setCategoryData] = useState(category);

  const [image, setImage] = useState<ImageObject | null>(category.image || null);

  const supabase = useSupabaseClient<Database>();

  const uploadFiles = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let files: FileList | null = e.currentTarget.files;

    const fileArray = Array.from(files!);

    const formData = new FormData();

    for (const file of fileArray) {
      formData.append("file", file);
      formData.append("upload_preset", "podium_push");

      const data = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((r) => r.json())
        .catch((err) => err.json());

      console.log(data);

      setImage({ url: data.url, width: data.width, height: data.height });

      toast.success("File upload complete " + file.name);
    }
  };





    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {



      if (
        typeof data.name === "undefined" ||
        typeof data.slug === "undefined"
      ) {
        throw new Error("Please enter valid data");
      } else if (
        typeof data.name !== "string" ||
        typeof data.slug !== "string"
      ) {
        throw new Error("Please enter a valid data");
      }

      const { data: category, error: categoryError } = await supabase
        .from("categories").update({
          name: data.name,
          slug: data.slug,
          image: image!,
        }).eq("slug", categoryData.slug).select("*").single();

      console.log({ category, categoryError, image });

      toast.warning('Please wait...')

      if(category) {
        router.push(`/admin/categories/${category.slug}`);
      }

      if(categoryError) {
        toast.error(categoryError.details)
      }
    };



  return (
    <Dashboard>
      <div className="p-8">
        <div className="bg-white border border-slate-200 rounded-xl">
          <form className="px-4 py-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Logo
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      onChange={uploadFiles}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </form>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand Name
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
                  onChange={(e) => {
                    setCategoryData({
                      ...categoryData,
                      slug: slugify(categoryData.name, {
                        lower: true,
                        replacement: "_",
                        trim: true,
                      }),
                    });
                  }}
                  id="slug"
                  autoComplete="slug"
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
export default Category;

type SlugParam = {
  params: {
    slug: string;
  };
};

export async function getServerSideProps({ params: { slug } }: SlugParam) {
  const category = await getCategory(slug);

  return {
    props: {
      category,
    },
  };
}
