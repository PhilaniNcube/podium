import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, AdminType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getAdmins = async () => {
  const {data:admins, error} = await supabase.from('admins').select('*')

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return admins as AdminType[]
}
