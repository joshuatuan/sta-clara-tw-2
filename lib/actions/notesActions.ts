"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getUser } from "../data-service";

export const upsertNote = async (content: string) => {
  const supabase = await createClient();
  const user = await getUser();

  const { error } = await supabase
    .from("notes")
    .upsert({ user_id: user!.id, content: content }, { onConflict: "user_id" });

  if (error && error.code !== "PGRST116") {
    console.error("Error upserting note:", error);
    throw new Error("Failed to save note");
  }

  revalidatePath("/features/notes/");
};

export const fetchNotes = async () => {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching note:", error);
  }

  return data;
};
