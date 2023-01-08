import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database, ProfileType } from "../utils/database.d.types"

const supabase = createBrowserSupabaseClient<Database>()

export const getAllProfiles = async () => {
  const {data:profiles, error} = await supabase.from('profiles').select('*').order('last_name', {ascending: true})

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return profiles as ProfileType[]
}



export const getProfiles = async (page = '1', limit = '40',) => {

  let p = +page

   let range = parseInt(limit)
  let start = (p - 1) * range

  const {data:profiles, error} = await supabase.from('profiles').select('*').order('last_name', {ascending: true}).range(start, range)

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return profiles as ProfileType[]
}


export const getProfile = async (id:string) => {
  const {data:profile, error} = await supabase.from('profiles').select('*').eq('id', id).single()

  if (error) {
    throw new Error(`There was an error: ${error.details} - ${error.message} - ${error.hint}`)
  }

  return profile as ProfileType
}
