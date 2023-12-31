import { Circle, Triangle } from "@/components/icons";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  searchParams: { force: boolean | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const getUserReq = await supabase.auth.getUser();

  if (getUserReq.data && getUserReq.error === null) {
    let getUserMetadataReq = await supabase
      .from("users")
      .select()
      .eq("id", getUserReq.data.user.id)
      .limit(1)
      .single();

    if (getUserMetadataReq.error === null && !searchParams.force) {
      switch (getUserMetadataReq.data.role) {
        case "ADMIN":
          redirect("/tickets");
        case "END-USER":
          redirect(`/user/${getUserReq.data.user.id}`);
      }
    } else if (getUserMetadataReq.error !== null) {
      console.log("error retrieving user metadata", getUserMetadataReq.error);
    }

    const createSetRole = (role: "ADMIN" | "END-USER") => {
      const setRole = async (form: FormData) => {
        "use server";
        let userId = form.get("user-id") as string;

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const { error } = await supabase.from("users").upsert({ role });

        if (error === null) {
          switch (role) {
            case "ADMIN":
              redirect("/tickets");
            case "END-USER":
              redirect(`/user/${userId}`);
          }
        } else {
          console.log("some error has occured", error);
        }
      };

      return setRole;
    };

    return (
      <div className="flex flex-col items-center">
        <div className="w-full rounded p-2 my-2 border-2 border-slate-900 text-center">
          <span className="text-2xl">Select your user role</span>
        </div>
        <form className="flex flex-row gap-y-5 justify-center gap-x-10 my-10">
          <div className="w-40 h-40 p-1 rounded bg-slate-500 flex items-center justify-center">
            <button
              className="flex flex-col items-center justify-center gap-y-2"
              formAction={createSetRole("END-USER")}
            >
              <Triangle size={40} />
              <b>End User</b>
            </button>
          </div>
          <div className="w-40 h-40 p-1 rounded bg-slate-700 flex items-center justify-center">
            <button
              className="flex flex-col items-center justify-center gap-y-2"
              formAction={createSetRole("ADMIN")}
            >
              <Circle size={40} />
              <b>Admin</b>
            </button>
          </div>
          <input
            readOnly
            value={getUserReq.data.user.id}
            name="user-id"
            className="hidden"
          />
        </form>
      </div>
    );
  }

  redirect("/login");
}
