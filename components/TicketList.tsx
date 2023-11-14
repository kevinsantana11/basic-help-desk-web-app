import { Tables } from "@/utils/supabase/database.types"
import TicketCard from "./TicketCard"

interface TicketCardProps {
  tickets: (Tables<'tickets'> & { email: string })[]
}
export default function TicketList ({ tickets }: TicketCardProps) {
  return (
    tickets.length > 0 ?
      <div className="m-1 mb-5">
        <span className="text-2xl">Tickets</span>
        <div className="bg-slate-700 p-3 rounded flex flex-col gap-y-5">
          {tickets.map((ticket) => (
            <TicketCard ticket={ticket} key={ticket.id}/>
          ))}
        </div>
      </div>
    :
    <span>No tickets found...</span>
  )
}