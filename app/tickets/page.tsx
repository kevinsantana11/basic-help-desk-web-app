import TicketList from "@/components/TicketList";
import { Tables } from "@/utils/supabase/database.types";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  let cookieStore = cookies();
  const adminSupabase = createAdminClient();
  let supabase = createClient(cookieStore);

  let getTicketsReq = await supabase.from("tickets").select().limit(10);

  let tickets: (Tables<"tickets"> & { email: string })[] = [];
  if (getTicketsReq.error === null) {
    for (let ticket of getTicketsReq.data) {
      const {
        data: { user },
      } = await adminSupabase.auth.admin.getUserById(ticket.user_id);
      tickets.push({
        email: user && user.email ? user.email : "N/A",
        ...ticket,
      });
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  } else {
    const getUserRole = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .single();
    
    if (!getUserRole.error && getUserRole.data.role !== "ADMIN") {
      redirect("/403");
    } else if (getUserRole.error) {
      redirect("/");
    }
  }

  return (
    <div className="bg-slate-800 p-5 my-3 rounded">
      <TicketList tickets={tickets} />
    </div>
  )
}
