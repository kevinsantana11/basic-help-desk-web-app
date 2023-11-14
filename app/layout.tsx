import AuthButton from '../components/AuthButton'
import { GeistSans } from 'geist/font'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Basic Ticketing Application',
  description: 'A simple ticketing request application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <p className="text-blue-500">
                <b>
                  Basic Ticketing Application
                </b>
              </p>
              <AuthButton />
            </div>
          </nav>
          {children}
          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p>
              Powered by{' '}
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
  )
}
