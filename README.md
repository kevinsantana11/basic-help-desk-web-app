## Help Desk Web Application

You can view a fully working demo at [Help Desk Web Application on Vercel](https://basic-help-desk-web-app.vercel.app).

This application is a basic help desk web application using React, Next.js, Tailwinds CSS and Supabase+Postgres

### Requirements

#### Functional

- all users can define their role ["role", "end-user"]
- end users can submit support ticket requests
- end users can update their support ticket requests
- end users can view a detailed view of their support ticket requests
- end users can view a list of their support ticket requests
- end users can add comments to the support request ticket
- admin users can view a list of all support request tickets
- admin users can view a detailed view of the support request ticket
- admin users can add comments to the support request ticket
- The support ticket requests should should contain information such as: name, email and description and status["new", "in-progress", "resolved"]

## Clone and run locally

0. Clone repository
1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)
2. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY=[INSERT YOUR SERVICE ROLE KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

3. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
