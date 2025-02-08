"use server";

import { ReviewType } from "@/app/types/globals";
import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const getUserTasks = async () => {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user!.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error.message);
  }

  return data;
};

export const getReviews = async (photoId: string, type: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("photo_id", photoId)
    .eq("type", type);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }

  return data;
};

export const getReviewPhotos = async (type: ReviewType) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("review_photos")
    .select("*")
    .eq("type", type);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
  return data;
};
