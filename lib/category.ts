import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, CategoryType, ProductType, SubCategoryType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getCategories = async() => {

const {data:categories, error} = await supabase.from('categories').select('*').order('name', {ascending: true})

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return categories as CategoryType[]

}

export const getCategory = async(slug:string) => {

const {data:category, error} = await supabase.from('categories').select('*').eq('slug', slug).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return category as CategoryType

}

export const getSubCategories = async() => {

const {data:categories, error} = await supabase.from('sub_category').select('*, parent(*)').order('parent', {ascending: true})

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return categories as SubCategoryType[]

}

export const getSubCatecory = async(slug:string) => {

const {data:categories, error} = await supabase.from('sub_category').select('*, parent(*)').eq('slug', slug).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return categories as SubCategoryType

}


export const filterSubCategoryByParent = async (category:string) => {

  const {data:categories, error} = await supabase.from('sub_category').select('*,parent(*)').order('name', {ascending: true}).eq('parent', category)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return categories as SubCategoryType[]

}
