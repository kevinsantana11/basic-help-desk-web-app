import TicketCard from "@/components/TicketCard"
import TicketList from "@/components/TicketList"
import { Tables } from "@/utils/supabase/database.types"
import { createAdminClient, createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export default async function Page () {
  let cookieStore = cookies()
  const adminSupabase = createAdminClient()
  let supabase = createClient(cookieStore)

  let getTicketsReq = await supabase.from('tickets').select().limit(10)

  let tickets: (Tables<'tickets'> & { email: string })[] = []
  if (getTicketsReq.error === null) {
    for (let ticket of getTicketsReq.data) {
      const {data: { user }} = await adminSupabase.auth.admin.getUserById(ticket.user_id)
      tickets.push({
        email: user && user.email ? user.email : "N/A",
        ...ticket
      })
    }
  } 

  return (
    <TicketList tickets={tickets}/>
  )
}