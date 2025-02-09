import { Database } from "@/app/types/supabase ";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async (
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
) => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
