import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TicketList from "@/components/TicketList";
import { Tables } from "@/utils/supabase/database.types";

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const addTicket = async (form: FormData) => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    let description = form.get("description") as string;
    let title = form.get("title") as string;
    let createTicketReq = await supabase
      .from("tickets")
      .insert({ title, description, status: "NEW" })
      .select();

    if (createTicketReq.error === null) {
      redirect(`/tickets/${createTicketReq.data[0].id}`);
    } else {
      redirect("/error")
    }
  };

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let getUserReq = await supabase.auth.getUser();

  let tickets: (Tables<"tickets"> & { email: string })[] = [];
  if (!getUserReq.error && getUserReq.data.user.id === params.id) {
    let getTicketsReq = await supabase
      .from("tickets")
      .select()
      .eq("user_id", getUserReq.data.user.id)
      .limit(10);

    if (!getTicketsReq.error) {
      for (let ticket of getTicketsReq.data) {
        tickets.push({
          email: getUserReq.data.user.email
            ? getUserReq.data.user.email
            : "N/A",
          ...ticket,
        });
      }
    }
  } else if (!getUserReq.error && getUserReq.data.user.id !== params.id) {
    redirect("/403");
  } else {
    redirect("/login");
  }

  return (
    <div className="m-5 p-3 rounded bg-slate-800 flex flex-col gap-y-2">
      <span className="text-2xl">Submit your Ticket Request</span>
      <form>
        <div className="flex gap-x-2 p-3 my-1 rounded flex flex-col">
          <label>Title</label>
          <input
            className="text-black rounded grow p-1"
            name="title"
            required
          />
        </div>
        <div className="flex gap-x-2 p-3 my-1 rounded flex flex-col">
          <label>Description</label>
          <textarea
            className="text-black rounded grow p-1"
            name="description"
            required
          />
        </div>
        <button
          className="rounded bg-blue-400 mt-5 p-1"
          type="submit"
          formAction={addTicket}
        >
          Submit Ticket
        </button>
      </form>
      <TicketList tickets={tickets} />
    </div>
  );
}
