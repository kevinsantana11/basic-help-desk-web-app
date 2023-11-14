'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const addComment = async (form: FormData) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let content = form.get("content") as string
  let ticket_id = form.get("ticket-id") as string
  let getUserRequest = await supabase.auth.getUser()

  let {data, error} = await supabase.from('comments').insert({
    ticket_id,
    content: content,
    user_id: getUserRequest.data.user!.id
  })

  console.log("There was some sort of issue", error)

  redirect(`/tickets/${ticket_id}`)
}

const saveChanges = async (form: FormData) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  console.log("trying to save changes", form)

  let description = form.get('description') as string
  let ticket_id = form.get('ticket-id') as string
  let title = form.get('title') as string
  let status = form.get('status') as "NEW" | "IN-PROGRESS" | "RESOLVED"
  await supabase.from('tickets').update({title, description, status}).eq('id', ticket_id)

  redirect(`/tickets/${ticket_id}`)
}

const revertChanges = async (form: FormData) => {
  let ticket_id = form.get('ticket-id') as string
  redirect(`/tickets/${ticket_id}`)
}

export {
    addComment,
    saveChanges,
    revertChanges
}
 