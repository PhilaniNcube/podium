import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



export async function middleware(req: NextRequest, res:NextResponse) {

  const supabase = createMiddlewareSupabaseClient({req, res})

  if (req.nextUrl.pathname.startsWith('/admin')) {
    // This logic is only applied to /admin
    // console.log('admin middleware is running')

     const {data: { session }} = await supabase.auth.getSession()

    //  console.log(session)

     if(session) {

       let { data, error } = await supabase.rpc('is_admin')
      //  console.log({data, error})

       if(error) {
        return NextResponse.json({message: 'Unauthorized'})
       } else {
        console.log(req.url)
        return NextResponse.next()
       }


      }

  }

}
