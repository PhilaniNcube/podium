import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";
import slugify from "slugify";
import Dashboard from "../../../components/Dashboard";
import { CategoryType, Database } from "../../../utils/database.d.types";
import { v4 as uuidv4 } from 'uuid';
import { RiDeleteBin2Line, RiPencilLine } from "react-icons/ri";
import { getCategories } from "../../../lib/category";
import Image from "next/image";


type ComponentProps = {
  categories: CategoryType[],
}

const Categories = ({ categories }:ComponentProps) => {
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
      .from("categories")
      .insert([{ name: "Draft", slug: slug }])
      .select("*")
      .single();

    console.log({ data, error });

    if (error) {
      toast.error(`${error.message}`);
    } else if (data) {
      router.push(`/admin/categories/${data.slug}`);
    }
  };

  return (
    <Dashboard>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
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
            <span>New Category</span>
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="mt-4 w-full grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <article
            key={category.id}
            className="w-full aspect-1 rounded-lg border border-slate-300 flex flex-col p-2"
          >
            <Image src={category.image.url} width={category.image.width} height={category.image.height} alt={category.name} className="aspect-1 object-cover rounded-md" />
            <p className="text-lg font-medium text-slate-600 font-sans">
              {category.name}
            </p>
            <div className="flex justify-between items-center">
              <Link
                href={`/admin/categories/${category.slug}`}
                className="bg-blue-50 px-3 items-center text-blue-600 rounded-lg py-1 flex space-x-2"
              >
                <span>Edit</span>
                <RiPencilLine />
              </Link>
              <button className="bg-red-50 px-3 items-center text-red-600 rounded-lg py-1 flex space-x-2">
                <span>Delete</span>
                <RiDeleteBin2Line />
              </button>
            </div>
          </article>
        ))}
      </div>
    </Dashboard>
  );
};
export default Categories;


export async function getServerSideProps() {

  const categories = await getCategories();

  return {
    props: {
      categories,
    },
  };

}
