import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, BrandType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getBrands = async () => {
  const {data:brands, error} = await supabase.from('brands').select('*').order('name', {ascending: true})

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return brands as BrandType[]
}

export const getBrand = async (slug:string) => {
  const {data:brand, error} = await supabase.from('brands').select('*').eq('slug', slug).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return brand as BrandType
}
