import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, SupplierType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getSuppliers = async () => {
  const {data:suppliers, error} = await supabase.from('supplier').select('*').order('name', {ascending: true})

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return suppliers as SupplierType[]
}

export const getSupplier = async (slug:string) => {
  const {data:suppliers, error} = await supabase.from('supplier').select('*').eq('slug', slug).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return suppliers as SupplierType
}
