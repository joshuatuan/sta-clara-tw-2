"use server";

import { getUser } from "@/lib/data-service";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const addTodoTask = async (task: string) => {
  const user = await getUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .insert([{ user_id: user!.id, task }])
    .select("*") // Get the inserted task
    .single(); // Ensure only one row is returned

  if (error) {
    console.error("Error adding todo task:", error.message);
    throw new Error("Failed to add task");
  }

  revalidatePath("/features/to-do-list");

  return data; // Return the full task object
};

export const updateTodoTaskState = async (id: string) => {
  const supabase = await createClient();

  const { data: task, error: fetchError } = await supabase
    .from("todos")
    .select("is_completed")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching task:", fetchError.message);
    throw new Error("Failed to fetch task");
  }

  const toggledState = !task.is_completed;

  const { error } = await supabase
    .from("todos")
    .update({ is_completed: toggledState })
    .eq("id", id);

  if (error) {
    console.error("Error updating task:", error.message);
    throw new Error("Failed to update task");
  }

  revalidatePath("/features/to-do-list");
};

export const deleteTodoTask = async (id: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error.message);
    throw new Error("Failed to delete task");
  }

  revalidatePath("/features/to-do-list");
};
