"use server";

import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { redirect  } from "next/navigation";

const addComment = async (form: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let content = form.get("content") as string;
  let ticket_id = form.get("ticket-id") as string;
  let getUserRequest = await supabase.auth.getUser();

  if (!getUserRequest.error) {
    let { error } = await supabase.from("comments").insert({
      ticket_id,
      content: content,
      user_id: getUserRequest.data.user.id,
    });

    if (error === null) {
      redirect(`/tickets/${ticket_id}`);
    } else {
      console.log("error: ", error);
    }
  } else {
    console.log("error: ", getUserRequest.error);
  }

  redirect('/error');

};

const saveChanges = async (form: FormData) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let description = form.get("description") as string;
  let ticket_id = form.get("ticket-id") as string;
  let title = form.get("title") as string;
  let status = form.get("status") as "NEW" | "IN-PROGRESS" | "RESOLVED";

  let getCurrentUser = await supabase.auth.getUser();
  let getTicketUser = await supabase
    .from("tickets")
    .select()
    .eq("id", ticket_id)
    .single();

  let updateObj = {};
  if (!getCurrentUser.error 
      && !getTicketUser.error 
      && getCurrentUser.data.user.id === getTicketUser.data.user_id) {
    updateObj = {title, description, status};
  } else if (!getCurrentUser.error 
              && !getTicketUser.error 
              && getCurrentUser.data.user.id !== getTicketUser.data.user_id) {
    
    let getCurrentUserRole = await supabase
      .from("users")
      .select()
      .eq("id", getCurrentUser.data.user.id)
      .single();

    if (!getCurrentUserRole.error && getCurrentUserRole.data.role == "ADMIN") {
      updateObj = {status};
    } else {
      redirect("/"); // They may not have an assigned role, redirect to home to get choose role
    }
  } else {
    console.log("Error getting current user or ticket user: ", getCurrentUser.error, getTicketUser.error);
  }

  const { error } = await supabase
    .from("tickets")
    .update({ ...updateObj, updated_at: moment().format() })
    .eq("id", ticket_id);

  if (!error) {
    redirect(`/tickets/${ticket_id}`);
  } else {
    console.log("Updating error: ", error);
  }

  redirect('/error');
};

export { addComment, saveChanges };
