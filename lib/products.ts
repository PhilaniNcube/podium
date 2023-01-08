import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, ProductType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getAllProducts = async() => {

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)')

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}

export const getProducts = async(page = '1', limit = '20') => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').eq('published', true).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}

export const getAdminProducts = async(page = '1', limit = '20') => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').order('name', {ascending: false}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}



export const getProductsByCategory = async(page = '1', limit = '20', category:string) => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({'published': true, 'category': category}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}



export const getProductsBySubCategory = async(page = '1', limit = '20', category:string) => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({'published': true, 'sub_category': category}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}



export const getProductsByBrand = async(page = '1', limit = '20', brand:string) => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({'published': true, 'brand': brand}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}



export const getProductsBySupplier = async(page = '1', limit = '20', supplier:string) => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({ 'supplier': supplier}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}


export const getProduct = async(slug:string) => {

  const {data:product, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({'slug': slug}).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return product as ProductType

}


export const getAdminProduct = async(slug:string) => {

  const {data:product, error} = await supabase.from('products').select('*').match({'slug': slug}).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return product as ProductType

}


export const searchProduct = async(page = '1', limit = '20', search:string) => {
 let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

    const {data:products, error} = await supabase.from('products').select('*, brand(*), category(*), sub_category(*), supplier(*)').match({'published': true}).textSearch('name',search, {config:'english', type: 'websearch'}).range(start, range)

      if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }
  return products as ProductType[]

}
