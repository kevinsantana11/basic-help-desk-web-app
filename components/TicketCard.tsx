import { Tables } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/server";
import { ArrowIn, Trash } from "@/components/icons"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StatusChip from "./StatusChip";


interface TicketCardProps {
  ticket: Tables<'tickets'> & { email: string  }
}

export default function TicketCard({ticket}: TicketCardProps) {

  const deleteTicket = async (form: FormData) => {
    'use server'
    let ticketId = form.get("ticket-id") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.from('tickets').delete().eq('id', ticketId)
    
    if (error) {
      console.log('There was some kind of error deleting the ticket: ', error)
    }
    redirect('/tickets')
  }

  const viewTicket = async (form: FormData) => {
    'use server'
    let ticketId = form.get("ticket-id") as string
    redirect(`/tickets/${ticketId}`)
  }

  return (
    <div className="bg-slate-500 p-3 my-1 rounded max-w-md" key={ticket.id}>
      <div aria-label="header" className="mb-5">
        <form className="h-10 flex gap-x-3">
          <span className="text-xl w-3/4">{ticket.title}</span>
          <div className="w-1/4 flex flex-row gap-x-2 justify-end">
            <button aria-label="view" type="submit" formAction={viewTicket}>
              <ArrowIn className="stroke-blue-400"/>
            </button>
            <button aria-label="delete" type="submit" formAction={deleteTicket}>
              <Trash className="stroke-red-400"/>
            </button>
          </div>
          <input className="hidden" value={ticket.id} readOnly name="ticket-id"/>
        </form>
      </div>
      <div aria-label="body">
        <div>
          <label>
            <b>
              Email
            </b>
          </label>
          <p className="text-slate-300">{ticket.email}</p>
        </div>
        <div>
          <label>
            <b>
              Description
            </b>
          </label>
          <p className="text-slate-300 ">{ticket.description}</p>
        </div>
        <div>
          <label>
            <b>
              Created At
            </b>
          </label>
          <p className="text-slate-300">{ticket.created_at}</p>
        </div>
        <div>
          <label>
            <b>
              Status
            </b>
          </label>
          <StatusChip status={ticket.status}/>
        </div>
      </div>
    </div>
  )
}