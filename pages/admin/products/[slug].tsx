import Dashboard from "../../../components/Dashboard";
import { getAdminProduct, getProduct } from "../../../lib/products";
import { BrandType, CategoryType, Database, ImageObject, ProductType, SubCategoryType, SupplierType } from "../../../utils/database.d.types";
// import {v4 as uuidv4} from "uuid"
import { ChangeEvent, FormEvent, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import slugify from "slugify";
import { toast } from "react-toastify";
import { getBrands } from "../../../lib/brands";
import { getCategories, getSubCategories } from "../../../lib/category";
import { Switch } from "@headlessui/react";
import { getSuppliers } from "../../../lib/suppliers";
import { RiDeleteBackLine, RiDeleteBin3Line } from "react-icons/ri";
import { useRouter } from "next/router";
import Image from "next/image";

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  brand: z.string().uuid(),
  category: z.string().uuid(),
  sub_category: z.string().uuid(),
  price: z.string(),
  cost: z.string(),
  featured: z.boolean(),
  in_stock: z.boolean(),
  published: z.boolean(),
  warranty: z.string(),
  product_code: z.string(),
  supplier: z.string().uuid(),
});

type FormSchemaType = z.infer<typeof ProductSchema>;

  type Details = {
    key: string;
    value: string;
  };


type ComponentProp = {
  product: {
    id: string;
    created_at: string;
    name: string;
    description: string;
    brand: string;
    slug: string;
    category: string;
    details: {
      key: string;
      value: string;
    }[];
    refund_policy: string;
    rating: number;
    shipping: number;
    sub_category: string;
    images: Array<ImageObject>;
    price: number;
    cost: number;
    featured: boolean;
    in_stock: boolean;
    published: boolean;
    warranty: string;
    supplier: string;
    product_code: string;
  };
  categories: CategoryType[];
  brands: BrandType[];
  subCategories: SubCategoryType[];
  suppliers: SupplierType[];
};

const Product = ({
  product,
  categories,
  subCategories,
  brands,
  suppliers,
}: ComponentProp) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(ProductSchema),
  });

  console.log(errors)

  const router = useRouter()
  const [productData, setProductData] = useState(product);

  const [images, setImages] = useState<Array<ImageObject>>(product.images);

  const [detailsArray, setDetailsArray] = useState<
    Array<{
      key: string;
      value: string;
    }>
  >(product.details);



  const saveToDetailsArray = function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    let { attribute, value } = Object.fromEntries(
      new FormData(e.currentTarget)
    );

 setDetailsArray((currItems) => [
   ...currItems,
   { key: attribute.toString(), value: value.toString() },
 ]);

    console.log({ attribute, value });


  };

  const deleteFromDetailsArray = (i:number) => {
    setDetailsArray((currItems) => {
       return currItems.filter((item, index) => index !== i);
    })
  }

  const deleteFromImagesArray = (i:number) => {
    setImages((currItems) => {
       return currItems.filter((item, index) => index !== i);
    })
  }

  const supabase = useSupabaseClient<Database>();

  const uploadFiles = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setImages([])

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

      setImages((currItems) => {
        return [
          ...currItems,
          { url: data.url, width: data.width, height: data.height },
        ];
      });

      toast.success("File upload complete " + file.name);
    }
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data);

    const slug = slugify(data.name, {
      lower: true,
      replacement: '_',
      trim: true
    })

      const { data: product, error: productError } = await supabase
        .from("products")
        .update({
          name: data.name,
          slug: slug,
          brand: data.brand,
          category: data.category,
          cost: +data.cost,
          description: data.description,
          details: detailsArray,
          featured: data.featured,
          images: images,
          in_stock: data.in_stock,
          price: +data.price,
          warranty: data.warranty,
          product_code: data.product_code,
          published: data.published,
          sub_category: data.sub_category,
          supplier: data.supplier,
        })
        .eq("slug", productData.slug)
        .select("*")
        .single();


        console.log({product, productError})

        if(productError) {
          toast.error(productError.message)
        } else {
          toast.success('Product saved successfully')
          router.push(`/admin/products/${product.slug}`)
        }
  };

  console.log({productData});

  const brandId = brands.find((c) => c.id === productData.brand);
  const supplierId = suppliers.find((c) => c.id === product.supplier);
  const categoryId = categories.find((c) => c.id === product.category);
  const subCategoriesId = subCategories.find(
    (c) => c.id === product.sub_category
  );

  console.log({ brandId });

  return (
    <Dashboard>
      <div className="p-8">
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="p-4 my-6">
            <form
              onSubmit={saveToDetailsArray}
              className="my-8 border p-4 border-dashed border-slate-400 rounded-md"
            >
              <p className="font-medium font-sans">Add Product Details</p>
              <div className="w-full flex space-x-3 items-center">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Attribute e.g. size/colour
                  </label>
                  <input
                    type="text"
                    id="attribute"
                    name="attribute"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Attribute Value e.g. 500g/black
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div></div>
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3">
              {detailsArray?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 justify-between py-2 border border-slate-200 rounded px-4"
                >
                  <div className="flex items-center space-x-4 py-2">
                    <p className="text-sm font-medium">
                      Attribute:{" "}
                      <span className="pl-3 font-bold text-slate-900">
                        {item.key}
                      </span>
                    </p>

                    <p className="text-sm font-medium">
                      Value:
                      <span className="pl-3 font-bold text-slate-900">
                        {item.value}
                      </span>
                    </p>
                  </div>

                  <RiDeleteBin3Line
                    className="text-red-500 text-lg cursor-pointer"
                    onClick={() => deleteFromDetailsArray(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <input
                  {...register("name")}
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="product_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Code
                </label>
                <input
                  {...register("product_code")}
                  value={productData.product_code}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      product_code: e.target.value,
                    })
                  }
                  type="text"
                  name="product_code"
                  id="product_code"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="warranty"
                  className="block text-sm font-medium text-gray-700"
                >
                  warranty
                </label>
                <input
                  type="text"
                  // name="warranty"
                  {...register("warranty")}
                  value={productData.warranty}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      warranty: e.target.value,
                    })
                  }
                  id="warranty"
                  autoComplete="warranty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Price
                </label>
                <input
                  {...register("price")}
                  value={productData.price}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  type="number"
                  name="price"
                  id="price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="cost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Cost
                </label>
                <input
                  type="number"
                  // name="cost"
                  {...register("cost")}
                  value={productData.cost}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      cost: parseFloat(e.target.value),
                    })
                  }
                  id="cost"
                  autoComplete="cost"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-3 flex flex-col space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="featured"
                      {...register("featured")}
                      checked={productData.featured}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          featured: e.target.checked,
                        })
                      }
                      name="featured"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="featured"
                      className="font-medium text-gray-700"
                    >
                      Featured
                    </label>
                    <p className="text-gray-500">
                      Mark this product as featured to give it prominance
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex flex-col space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="in_stock"
                      {...register("in_stock")}
                      checked={productData.in_stock}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          in_stock: e.target.checked,
                        })
                      }
                      name="in_stock"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="in_stock"
                      className="font-medium text-gray-700"
                    >
                      In Stock
                    </label>
                    <p className="text-gray-500">Is product in stock?</p>
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex flex-col space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="published"
                      {...register("published")}
                      checked={productData.published}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          published: e.target.checked,
                        })
                      }
                      name="published"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="published"
                      className="font-medium text-gray-700"
                    >
                      Published
                    </label>
                    <p className="text-gray-500">
                      Published products are visible on the frontend
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  // name="description"
                  {...register("description")}
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Product Description"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description of the product.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand
                </label>
                <select
                  // name="parent"
                  id="brand"
                  {...register("brand")}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      brand: e.target.value,
                    })
                  }
                  value={productData.brand}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value={productData.brand}>
                    {productData.brand ? brandId?.name : "Choose Brand"}
                  </option>
                  {brands.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="supplier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Supplier
                </label>
                <select
                  // name="supplier"
                  id="supplier"
                  {...register("supplier")}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      supplier: e.target.value,
                    })
                  }
                  value={productData.supplier}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option>
                    {productData.supplier
                      ? supplierId?.name
                      : "Choose Supplier"}
                  </option>
                  {suppliers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 my-8">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  // name="parent"
                  id="category"
                  {...register("category")}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      category: e.target.value,
                    })
                  }
                  value={productData.category}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option>
                    {productData.category
                      ? categoryId?.name
                      : "Choose Category"}
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="sub_category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sub Category
                </label>
                <select
                  // name="supplier"
                  id="sub_category"
                  {...register("sub_category")}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      sub_category: e.target.value,
                    })
                  }
                  value={productData.sub_category}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">
                    {productData.sub_category
                      ? subCategoriesId?.name
                      : "Choose Supplier"}
                  </option>
                  {subCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-5 grid grid-cols-4 gap-3">
                {images?.map((image, i) => (
                  <div key={i} className="relative isolate">
                    <Image
                      className="w-full aspect-1 object-cover rounded-lg p-2 border border-slate-200"
                      src={image.url}
                      width={image.width}
                      height={image.height}
                      alt={product.name}
                    />
                    <RiDeleteBin3Line
                      className="text-red-500 text-lg absolute top-3 right-3 z-30 cursor-pointer"
                      onClick={() => deleteFromImagesArray(i)}
                    />
                  </div>
                ))}
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Product Images
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
                        multiple
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
            </div>
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-5">
                <div className="border-t border-gray-200" />
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
export default Product;


 type SlugParam = {
  params: {
    slug: string
  }
}

export async function getServerSideProps({params: {slug}}:SlugParam) {

const product = await getAdminProduct(slug)
const brands = await getBrands()
const categories = await getCategories()
const subCategories = await getSubCategories()
const suppliers = await getSuppliers()

  return {
    props: {
      product,
      brands,
      categories,
      subCategories,
      suppliers,
    },
  };
}
