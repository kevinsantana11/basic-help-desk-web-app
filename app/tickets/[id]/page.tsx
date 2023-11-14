import { Tables } from "@/utils/supabase/database.types"
import { createClient, createAdminClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import View from "./view"

export default async function Page({ params }: { params: {id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const adminSupabase = createAdminClient()

  let getTicketReq = await supabase.from('tickets').select().eq('id', params.id).limit(1).single()

  if (getTicketReq.error === null) {
    let getUserReq = await adminSupabase.auth.admin.getUserById(getTicketReq.data.user_id)
    let email = "N/A"
    if (getUserReq.data.user && getUserReq.data.user.email) {
      email = getUserReq.data.user.email
    }

    let getCommentReq = await supabase.from('comments').select().eq('ticket_id', params.id)
    let comments: (Tables<'comments'> & { email: string })[] = []
    if(getCommentReq.error === null) {
      for (let comment of getCommentReq.data) {
        let getUserReq = await adminSupabase.auth.admin.getUserById(comment.user_id)
        if (getUserReq.error === null && getUserReq.data.user.email) {
          comments.push({
            email: getUserReq.data.user.email,
            ...comment
          })
        } else {
          console.log("Tried adding a comment for a user that doesn't have an email")
        }
      }
    }

    return (
      <View 
        ticket={{
          ...getTicketReq.data,
          comments,
          email,
        }}
      />
    )
  }
}