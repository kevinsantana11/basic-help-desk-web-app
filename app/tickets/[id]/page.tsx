import { Tables } from "@/utils/supabase/database.types";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import View from "./view";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const adminSupabase = createAdminClient();

  let getTicketReq = await supabase
    .from("tickets")
    .select()
    .eq("id", params.id)
    .limit(1)
    .single();

  if (!getTicketReq.error) {
    let getTicketUserReq = await adminSupabase.auth.admin.getUserById(
      getTicketReq.data.user_id,
    );
    let email = "N/A";
    if (!getTicketUserReq.error && getTicketUserReq.data.user.email) {
      email = getTicketUserReq.data.user.email;
    } else {
      console.log("Error occured trying to get ticket users info/email: ", getTicketUserReq.error);
    }

    let getCommentReq = await supabase
      .from("comments")
      .select()
      .eq("ticket_id", params.id);
    let comments: (Tables<"comments"> & { email: string })[] = [];
    if (!getCommentReq.error) {
      for (let comment of getCommentReq.data) {
        let getCommentUserReq = await adminSupabase.auth.admin.getUserById(
          comment.user_id,
        );
        if (!getCommentUserReq.error && getCommentUserReq.data.user.email) {
          comments.push({
            email: getCommentUserReq.data.user.email,
            ...comment,
          });
        } else {
          console.log(
            "Error retrieving user info or email for comment: ", getCommentUserReq.error
          );
        }
      }
    }

    let getThisUserReq = await supabase.auth.getUser();
    if (!getThisUserReq.error && getTicketUserReq.data.user) {
      return (
        <View
          isCreator={getThisUserReq.data.user.id === getTicketUserReq.data.user.id}
          ticket={{
            ...getTicketReq.data,
            comments,
            email,
          }}
        />
      );
    }

    redirect("/error")
  }
}
