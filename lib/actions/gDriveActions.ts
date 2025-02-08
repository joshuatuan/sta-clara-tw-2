"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "../data-service";

export const uploadPhoto = async (file: File, fileName: string) => {
  const supabase = await createClient();
  const user = await getUser();

  const filePath = `${Date.now()}_${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw new Error("Failed to upload file");
  }

  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("photos").insert([
    {
      user_id: user?.id,
      file_name: fileName,
      file_url: urlData.publicUrl,
    },
  ]);

  if (dbError) {
    console.error("Error saving metadata:", dbError);
    throw new Error("Failed to save metadata");
  }
};

export const fetchPhotos = async (searchQuery?: string, sortBy?: string) => {
  const supabase = await createClient();
  const user = await getUser();

  let query = supabase.from("photos").select("*").eq("user_id", user!.id);

  if (searchQuery) {
    query = query.ilike("file_name", `%${searchQuery}%`);
  }

  if (sortBy === "name") {
    query = query.order("file_name", { ascending: true });
  } else if (sortBy === "date") {
    query = query.order("uploaded_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching photos:", error);
    throw new Error("Failed to fetch photos");
  }

  return data;
};

export const deletePhoto = async (id: string, fileUrl: string) => {
  const supabase = await createClient();

  const filePath = fileUrl.split("/").pop();

  const { error: storageError } = await supabase.storage
    .from("photos")
    .remove([filePath!]);

  if (storageError) {
    console.error("Error deleting file:", storageError);
    throw new Error("Failed to delete file");
  }

  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (dbError) {
    console.error("Error deleting metadata:", dbError);
    throw new Error("Failed to delete metadata");
  }
};
