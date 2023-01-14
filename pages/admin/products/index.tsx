import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { MdAdd } from "react-icons/md";
import Dashboard from "../../../components/Dashboard";
import { Database, ProductType } from "../../../utils/database.d.types";
import slugify from "slugify"
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getAdminProducts, getProducts } from "../../../lib/products";
import { RiDeleteBin2Line, RiPencilLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type ComponentProps = {
  products: ProductType[]
  page: string
}


const Products = ({products, page}:ComponentProps) => {

  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['products', page],
    queryFn: () => getAdminProducts(page),
    initialData:products,
  })

  const [productsPage, setProductsPage] = useState(+page)

  const nextPage = () => {
    if(data?.length < 21) {
      setProductsPage(productsPage);
    } else {
      setProductsPage(productsPage + 1);
      router.push(`/admin/products?page=${productsPage}`);
    }
  }

  const prevPage = () => {
    if(productsPage === 1) {
      setProductsPage(productsPage);
    } else {
      setProductsPage(productsPage - 1);
          router.push(`/admin/products?page=${productsPage}`);
    }
  }

  console.log({products})

  const router = useRouter()

  const supabase = useSupabaseClient<Database>();

  const createDraftProduct = async () => {

   const slug_id = uuidv4();
   const slug = slugify(`Draft ${slug_id}`, {
     lower: true,
     replacement: "_",
     trim: true,
   });

    const { data, error } = await supabase
      .from("products")
      .insert([{ name: "Draft Product", description: "", slug: slug,images: [{url: "/images/placeholder.jpg", width: 500, height: 500}] , details: [{"key": "Condition", "value": "New"}] }]).select("*").single();

      console.log({data, error})

      if(error) {
        toast.error(`${error.message}`)
      } else if(data) {
        router.push(`/admin/products/${data.slug}`)
      }


  }

  return (
    <Dashboard>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Products Grid</h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="bg-slate-800 text-white rounded-lg font-medium font-sans px-8 py-3"
          >
            Back To Dashboard
          </Link>
          <button
            onClick={createDraftProduct}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium font-sans px-8 py-3 flex items-center space-x-2"
          >
            <span>New Product</span>
            <MdAdd className="text-2xl" />
          </button>
        </div>
      </div>{" "}
      <section className="bg-white px-4 mt-6 rounded-lg">
        <form className="w-full py-3 border-b border-slate-300">
          <input
            type="text"
            className="border-0 focus:outline-none focus:ring-0 focus:border-0 w-full max-w-sm text-lg bg-slate-200 rounded-md placeholder:text-slate-500 placeholder:font-medium px-2 py-1"
            placeholder="Search..."
          />
          <button className="sr-only" type="submit">
            Search
          </button>
        </form>

        <div className="mt-4 w-full grid grid-cols-4 gap-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="w-full aspect-1 rounded-lg border border-slate-300 flex flex-col p-2"
            >
              {product.images ? (
                <Image
                  src={product.images[0]?.url}
                  width={product.images[0]?.width}
                  height={product.images[0]?.height}
                  alt={product.name}
                  className="w-full aspect-1 object-cover"
                />
              ) : (
                <Image
                  src="/images/placeholder.jpg"
                  width={500}
                  height={500}
                  alt={product.name}
                  className="w-full aspect-1 object-cover"
                />
              )}
              <p className="text-lg font-medium text-slate-600 font-sans">
                {product.name}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/admin/products/${product.slug}`}
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
        <div className="mt-3 w-full flex justify-between">
          <button
            disabled={+page < 2}
            onClick={() => router.push(`/admin/products?page=${+page - 1}`)}
            className="bg-slate-700 text-white font-medium px-8 py-1 rounded"
          >
            Prev
          </button>
          {productsPage}
          <button
            disabled={data.length < 20}
            onClick={() => router.push(`/admin/products?page=${+page + 1}`)}
            className="bg-slate-700 text-white font-medium px-8 py-1 rounded"
          >
            Next
          </button>
        </div>
      </section>
    </Dashboard>
  );
};
export default Products;

export async function getServerSideProps({query:{page = '1'}}) {




  const products = await getAdminProducts(page)

  return {
    props: {
      products,
      page
    }
  }

}
