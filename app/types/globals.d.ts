export type Notes = {
  content: string | null;
  created_at: string;
  id: string;
  user_id: string;
};

export type Review = {
  created_at: string;
  id: string;
  review_text: string;
  user_id: string | null;
  user_email: string;
};

export type ReviewPhoto = {
  created_at: string;
  file_name: string;
  file_url: string;
  id: string;
  title: string;
  type: string;
  user_id: string | null;
};

export type GDrivePhoto = {
  file_name: string;
  file_url: string;
  id: string;
  uploaded_at: string | null;
  user_id: string | null;
};

export type Task = {
  created_at: string;
  id: string;
  is_completed: boolean | null;
  task: string | null;
  updated_at: string | null;
  user_id: string | null;
};

// Only the necessary fields for the user, instead of the entire user object
export type UserData = {
  email: string | undefined;
  id: string;
  created_at: string;
};

export type ReviewType = "food" | "pokemon";
