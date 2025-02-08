"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { ReviewType } from "@/app/types/globals";

type ReviewFormProps = {
  photoId: string;
  type: ReviewType;
  onReviewSubmit: (
    photoId: string,
    type: ReviewType,
    reviewText: string,
  ) => Promise<void>;
};

export default function ReviewForm({
  photoId,
  type,
  onReviewSubmit,
}: ReviewFormProps) {
  const [reviewText, setReviewText] = useState("");

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    await onReviewSubmit(photoId, type, reviewText);
    setReviewText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <Label className="text-muted-foreground" htmlFor="reviewText">
          Add your review
        </Label>
        <Textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write a review"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button size="sm" type="submit">
          Submit Review
        </Button>
      </div>
    </form>
  );
}
