import AuthButton from "../components/AuthButton";
import "./globals.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Home2 } from "@/components/icons";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Basic Ticketing Application",
  description: "A simple ticketing request application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


  const getUserSection = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();


    let userControls = null;
    if (user) {
      const getUserRoleReq = await supabase
        .from("users")
        .select()
        .eq("id", user.id)
        .single();

        if (!getUserRoleReq.error) {
          userControls = (
            <Link href="/?force=true">
              <button className="rounded p-2 bg-slate-800">
                Change Role (Current: {getUserRoleReq.data.role})
              </button>
            </Link>
          );
        }
    }

    return (
        <div className="flex flex-row gap-x-5 items-baseline">
          <div className="flex flex-row gap-x-1">
            <AuthButton user={user}/>
            {userControls}
          </div>
        </div>
    );
  }

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
                <div className="flex flex-row gap-x-5 items-center">
                  <Link href="/">
                    <button className="p-2 rounded bg-slate-800">
                      <Home2 />
                    </button>
                  </Link>
                  <p className="text-blue-500">
                    <b>Basic Ticketing Application</b>
                  </p>
                </div>
                {await getUserSection()}
            </div>
          </nav>
          {children}
          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
