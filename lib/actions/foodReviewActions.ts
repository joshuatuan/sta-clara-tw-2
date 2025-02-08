"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "../data-service";
import { revalidatePath } from "next/cache";

export const addReview = async (
  photoId: string,
  type: "pokemon" | "food",
  reviewText: string,
) => {
  const supabase = await createClient();
  const user = await getUser();

  console.log("add review type: ", type);

  const { error } = await supabase.from("reviews").insert([
    {
      photo_id: photoId,
      type,
      user_id: user!.id,
      user_email: user!.email,
      review_text: reviewText,
    },
  ]);

  if (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to add review");
  }

  revalidatePath(`/features/${type}-review`);
};

export const createReviewAction = async (formData: FormData) => {
  const supabase = await createClient();
  const user = await getUser();
  const userId = user!.id;
  const userEmail = user!.email;

  const reviewType = formData.get("type") as string;
  const reviewTitle = formData.get("reviewTitle") as string;
  const reviewText = formData.get("reviewText") as string;
  const file = formData.get("photo") as File;
  const fileName = file.name;

  if (!file) {
    throw new Error("No file uploaded");
  }

  const filePath = `${Date.now()}_${fileName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("photos")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw new Error("Failed to upload file");
  }

  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(filePath);

  const { data: photoData, error: photoError } = await supabase
    .from("review_photos")
    .insert([
      {
        user_id: userId,
        file_name: fileName,
        file_url: urlData.publicUrl,
        title: reviewTitle,
        type: reviewType,
      },
    ])
    .select()
    .single();

  console.log("PHOTO DATA: ", photoData);

  if (photoError) {
    console.error("Error saving photo metadata:", photoError);
    throw new Error("Failed to save photo metadata");
  }

  const { error: reviewError } = await supabase.from("reviews").insert([
    {
      photo_id: photoData.id,
      type: reviewType,
      user_id: userId,
      user_email: userEmail,
      review_text: reviewText,
    },
  ]);

  if (reviewError) {
    console.error("Error saving review:", reviewError);
    throw new Error("Failed to save review");
  }

  revalidatePath(`/features/${reviewType}-review`);
};
